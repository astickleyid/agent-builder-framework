"""Memory Hub retrieval API — the core "memory clawing" endpoint.

This router handles all retrieval operations, combining vector search,
knowledge graph traversal, and full-text search into a unified pipeline
that returns relevant context in <100ms.
"""

from __future__ import annotations

import asyncio
import logging
import time
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/retrieve", tags=["retrieval"])


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------


class ClawRequest(BaseModel):
    """Memory clawing request — semantic search + graph traversal."""

    query: str
    agent_id: str = ""
    top_k: int = 50
    max_tokens: int = 50_000
    min_relevance: float = 0.3
    include_graph: bool = True
    include_fts: bool = True
    graph_depth: int = 2
    filters: dict[str, Any] = {}
    rerank: bool = True


class ClawResponse(BaseModel):
    """Memory clawing response — merged, ranked results."""

    results: list[dict[str, Any]]
    total_tokens: int
    total_results: int
    sources: dict[str, int]  # source → count
    graph_context: dict[str, Any] | None = None
    retrieval_ms: float
    cached: bool = False


class SimilarityRequest(BaseModel):
    """Simple similarity search (vector-only)."""

    query: str
    top_k: int = 20
    agent_id: str = ""


# ---------------------------------------------------------------------------
# Service references (injected at app startup)
# ---------------------------------------------------------------------------

_vector_store = None
_knowledge_graph = None
_embedding_service = None
_eviction_engine = None

# In-memory FTS index (PostgreSQL in production)
_fts_index: dict[str, dict[str, Any]] = {}


def configure_services(vector_store, knowledge_graph, embedding_service, eviction_engine):
    """Inject service dependencies."""
    global _vector_store, _knowledge_graph, _embedding_service, _eviction_engine
    _vector_store = vector_store
    _knowledge_graph = knowledge_graph
    _embedding_service = embedding_service
    _eviction_engine = eviction_engine


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.post("/claw", response_model=ClawResponse)
async def memory_claw(req: ClawRequest):
    """The core memory clawing endpoint.

    Performs parallel retrieval from:
    1. Vector store (semantic similarity)
    2. Knowledge graph (entity traversal)
    3. Full-text search (keyword matching)

    Results are merged, deduplicated, re-ranked, and filtered.
    Target: <100ms P99 for 5M token corpus.
    """
    start = time.time()
    source_counts: dict[str, int] = {}

    # Step 1: Generate query embedding
    query_embedding = await _embedding_service.embed(req.query)

    # Step 2: Parallel retrieval from all sources
    tasks = [
        _vector_search(query_embedding, req.top_k, req.filters, req.min_relevance),
    ]
    if req.include_graph:
        tasks.append(_graph_search(req.query, req.graph_depth))
    if req.include_fts:
        tasks.append(_fulltext_search(req.query, req.top_k))

    raw_results = await asyncio.gather(*tasks, return_exceptions=True)

    # Step 3: Merge results
    merged: dict[str, dict[str, Any]] = {}

    # Vector results
    if not isinstance(raw_results[0], Exception):
        for r in raw_results[0]:
            rid = r.get("memory_id", r.get("_additional", {}).get("id", uuid.uuid4().hex))
            merged[rid] = {
                "memory_id": rid,
                "content": r.get("content", ""),
                "relevance_score": r.get("_additional", {}).get("certainty", 0.5),
                "source": "vector_store",
                "token_count": r.get("token_count", len(r.get("content", "")) // 4),
                "metadata": {k: v for k, v in r.items() if k not in ("content", "_additional")},
            }
            source_counts["vector_store"] = source_counts.get("vector_store", 0) + 1

    # Graph results
    graph_context = None
    if req.include_graph and len(raw_results) > 1 and not isinstance(raw_results[1], Exception):
        graph_data = raw_results[1]
        graph_context = graph_data
        for entity in graph_data.get("entities", []):
            eid = entity.get("entity_id", uuid.uuid4().hex)
            for mid in entity.get("memory_ids", []):
                if mid not in merged:
                    merged[mid] = {
                        "memory_id": mid,
                        "content": f"[Graph entity: {entity.get('name', eid)}]",
                        "relevance_score": 0.6,  # Graph results get base relevance
                        "source": "knowledge_graph",
                        "token_count": 50,
                        "metadata": {"entity": entity},
                    }
                    source_counts["knowledge_graph"] = source_counts.get("knowledge_graph", 0) + 1

    # FTS results
    fts_idx = 2 if req.include_graph else 1
    if req.include_fts and len(raw_results) > fts_idx and not isinstance(raw_results[fts_idx], Exception):
        for r in raw_results[fts_idx]:
            rid = r.get("memory_id", uuid.uuid4().hex)
            if rid not in merged:
                merged[rid] = r
                source_counts["full_text"] = source_counts.get("full_text", 0) + 1
            else:
                # Boost score for results found in multiple sources
                merged[rid]["relevance_score"] = min(
                    1.0,
                    merged[rid]["relevance_score"] * 1.2,
                )

    # Step 4: Re-rank (cross-encoder would go here in production)
    results = list(merged.values())
    if req.rerank:
        results = _rerank(results, req.query)

    # Step 5: Filter by relevance threshold
    results = [r for r in results if r["relevance_score"] >= req.min_relevance]

    # Step 6: Truncate to token budget
    selected = []
    remaining_tokens = req.max_tokens
    for r in results:
        if remaining_tokens <= 0:
            break
        tokens = r.get("token_count", 0)
        if tokens <= remaining_tokens:
            selected.append(r)
            remaining_tokens -= tokens

    elapsed_ms = (time.time() - start) * 1000
    logger.info(
        "Memory claw: query=%s, results=%d, tokens=%d, time=%.1fms",
        req.query[:50], len(selected),
        sum(r.get("token_count", 0) for r in selected),
        elapsed_ms,
    )

    return ClawResponse(
        results=selected,
        total_tokens=sum(r.get("token_count", 0) for r in selected),
        total_results=len(selected),
        sources=source_counts,
        graph_context=graph_context,
        retrieval_ms=elapsed_ms,
    )


@router.post("/similar")
async def similarity_search(req: SimilarityRequest):
    """Simple vector similarity search (no graph, no FTS)."""
    query_embedding = await _embedding_service.embed(req.query)
    results = await _vector_store.search(query_embedding, top_k=req.top_k)
    return {"results": results, "count": len(results)}


# ---------------------------------------------------------------------------
# Internal retrieval functions
# ---------------------------------------------------------------------------


async def _vector_search(
    embedding: list[float],
    top_k: int,
    filters: dict[str, Any],
    min_relevance: float,
) -> list[dict[str, Any]]:
    """Search the vector store for similar chunks."""
    return await _vector_store.search(
        query_embedding=embedding,
        top_k=top_k,
        filters=filters or None,
        min_certainty=min_relevance,
    )


async def _graph_search(query: str, depth: int) -> dict[str, Any]:
    """Search the knowledge graph for related entities."""
    # First find entities matching the query
    entities = await _knowledge_graph.find_entities_by_name(query, limit=5)
    if not entities:
        return {"entities": [], "relations": []}

    # Traverse from most relevant entity
    start_id = entities[0].get("entity_id", "")
    return await _knowledge_graph.traverse(start_id, max_depth=depth)


async def _fulltext_search(query: str, top_k: int) -> list[dict[str, Any]]:
    """Full-text search via PostgreSQL (in-memory fallback here)."""
    query_lower = query.lower()
    results = []
    for mid, data in _fts_index.items():
        content = data.get("content", "").lower()
        if query_lower in content:
            # Simple TF scoring
            count = content.count(query_lower)
            results.append({
                "memory_id": mid,
                "content": data.get("content", ""),
                "relevance_score": min(1.0, count * 0.2),
                "source": "full_text",
                "token_count": data.get("token_count", 0),
                "metadata": data.get("metadata", {}),
            })

    results.sort(key=lambda r: r["relevance_score"], reverse=True)
    return results[:top_k]


def _rerank(results: list[dict[str, Any]], query: str) -> list[dict[str, Any]]:
    """Re-rank results using a simple scoring boost.

    In production, use a cross-encoder model for more accurate re-ranking.
    """
    query_terms = set(query.lower().split())

    for result in results:
        content = result.get("content", "").lower()
        # Boost score based on query term overlap
        content_terms = set(content.split())
        overlap = len(query_terms & content_terms)
        if query_terms:
            boost = overlap / len(query_terms) * 0.2
            result["relevance_score"] = min(1.0, result["relevance_score"] + boost)

    results.sort(key=lambda r: r["relevance_score"], reverse=True)
    return results
