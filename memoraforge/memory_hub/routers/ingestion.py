"""Memory Hub ingestion API — store, index, and link memories."""

from __future__ import annotations

import logging
import time
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..models.memory import Memory, MemoryChunk, MemoryType

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ingest", tags=["ingestion"])

# Service references (injected at startup)
_vector_store = None
_knowledge_graph = None
_embedding_service = None
_summarizer = None

# In-memory storage (PostgreSQL in production)
_memories: dict[str, Memory] = {}


def configure_services(vector_store, knowledge_graph, embedding_service, summarizer):
    global _vector_store, _knowledge_graph, _embedding_service, _summarizer
    _vector_store = vector_store
    _knowledge_graph = knowledge_graph
    _embedding_service = embedding_service
    _summarizer = summarizer


class StoreRequest(BaseModel):
    agent_id: str
    content: str
    memory_type: str = "conversation"
    title: str = ""
    metadata: dict[str, Any] = {}
    relations: list[dict[str, str]] = []
    ttl_hours: int | None = None
    auto_summarize: bool = True


class StoreResponse(BaseModel):
    memory_id: str
    chunks_created: int
    tokens_stored: int
    graph_nodes_created: int
    summary: str
    ingestion_ms: float


class BatchStoreRequest(BaseModel):
    items: list[StoreRequest]


@router.post("/store", response_model=StoreResponse)
async def store_memory(req: StoreRequest):
    """Store a new memory with full indexing pipeline.

    1. Semantic chunking
    2. Embedding generation (batched)
    3. Vector store indexing
    4. Knowledge graph entity extraction & linking
    5. Auto-summarization (optional)
    """
    start = time.time()

    memory_id = uuid.uuid4().hex[:12]
    memory_type = MemoryType(req.memory_type)

    # Chunk the content
    from ..services.embeddings import EmbeddingService
    from ...mcp_server.compression import semantic_chunk

    sem_chunks = semantic_chunk(req.content)

    # Generate embeddings for all chunks
    chunk_texts = [c.text for c in sem_chunks]
    embeddings = await _embedding_service.embed_batch(chunk_texts)

    # Create memory chunks and index them
    memory_chunks = []
    index_items = []

    for i, (sc, embedding) in enumerate(zip(sem_chunks, embeddings)):
        chunk = MemoryChunk(
            memory_id=memory_id,
            content=sc.text,
            embedding=embedding,
            token_count=sc.token_estimate,
            chunk_index=i,
            metadata={"hash": sc.chunk_hash, **req.metadata},
        )
        memory_chunks.append(chunk)
        index_items.append((
            chunk.chunk_id,
            embedding,
            {
                "memory_id": memory_id,
                "agent_id": req.agent_id,
                "content": sc.text,
                "memory_type": req.memory_type,
                "chunk_index": i,
                "token_count": sc.token_estimate,
                "created_at": time.time(),
            },
        ))

    # Batch index into vector store
    await _vector_store.batch_index(index_items)

    # Index into FTS (in production, PostgreSQL tsvector)
    from .retrieval import _fts_index
    _fts_index[memory_id] = {
        "content": req.content,
        "token_count": sum(c.token_estimate for c in sem_chunks),
        "metadata": req.metadata,
    }

    # Knowledge graph: create entities and relations
    graph_nodes = 0
    if req.relations:
        for rel in req.relations:
            source_name = rel.get("source", "")
            target_name = rel.get("target", "")
            relation_type = rel.get("type", "related_to")

            source_id = uuid.uuid4().hex[:12]
            target_id = uuid.uuid4().hex[:12]

            await _knowledge_graph.add_entity(
                source_id, source_name, "auto", memory_ids=[memory_id],
            )
            await _knowledge_graph.add_entity(
                target_id, target_name, "auto", memory_ids=[memory_id],
            )
            await _knowledge_graph.add_relation(source_id, target_id, relation_type)
            graph_nodes += 2

    # Auto-summarization
    summary = ""
    if req.auto_summarize and len(req.content) > 500:
        summary = await _summarizer.summarize(req.content)

    # Store the complete memory
    memory = Memory(
        memory_id=memory_id,
        agent_id=req.agent_id,
        memory_type=memory_type,
        title=req.title or f"Memory {memory_id}",
        content=req.content,
        chunks=memory_chunks,
        token_count=sum(c.token_count for c in memory_chunks),
        metadata=req.metadata,
        ttl_hours=req.ttl_hours,
        summary=summary,
    )
    _memories[memory_id] = memory

    elapsed_ms = (time.time() - start) * 1000
    logger.info(
        "Stored memory %s: %d chunks, %d tokens, %d graph nodes in %.1fms",
        memory_id, len(memory_chunks), memory.token_count, graph_nodes, elapsed_ms,
    )

    return StoreResponse(
        memory_id=memory_id,
        chunks_created=len(memory_chunks),
        tokens_stored=memory.token_count,
        graph_nodes_created=graph_nodes,
        summary=summary,
        ingestion_ms=elapsed_ms,
    )


@router.post("/batch", response_model=list[StoreResponse])
async def batch_store(req: BatchStoreRequest):
    """Store multiple memories in a single request."""
    results = []
    for item in req.items:
        result = await store_memory(item)
        results.append(result)
    return results


@router.get("/memory/{memory_id}")
async def get_memory(memory_id: str):
    """Retrieve a specific memory by ID."""
    memory = _memories.get(memory_id)
    if not memory:
        raise HTTPException(404, f"Memory {memory_id} not found")

    # Update access tracking
    memory.last_accessed = time.time()
    memory.access_count += 1

    return {
        "memory_id": memory.memory_id,
        "agent_id": memory.agent_id,
        "memory_type": memory.memory_type.value,
        "title": memory.title,
        "content": memory.content,
        "token_count": memory.token_count,
        "summary": memory.summary,
        "chunks": len(memory.chunks),
        "access_count": memory.access_count,
        "created_at": memory.created_at,
        "last_accessed": memory.last_accessed,
        "metadata": memory.metadata,
    }


@router.delete("/memory/{memory_id}")
async def delete_memory(memory_id: str):
    """Delete a memory and its indexed data."""
    memory = _memories.pop(memory_id, None)
    if not memory:
        raise HTTPException(404, f"Memory {memory_id} not found")

    # Clean up vector store
    for chunk in memory.chunks:
        await _vector_store.delete(chunk.chunk_id)

    # Clean up FTS
    from .retrieval import _fts_index
    _fts_index.pop(memory_id, None)

    return {"deleted": memory_id, "chunks_removed": len(memory.chunks)}
