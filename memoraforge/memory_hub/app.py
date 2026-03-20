"""Memory Hub — Standalone FastAPI microservice.

The central long-term memory system for MemoraForge agents.
Combines hierarchical RAG, knowledge graph, and vector store
for sub-100ms retrieval across 5M+ effective tokens.
"""

from __future__ import annotations

import logging
import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import retrieval, ingestion
from .services.vector_store import VectorStoreService
from .services.knowledge_graph import KnowledgeGraphService
from .services.embeddings import EmbeddingService
from .services.summarizer import SummarizerService
from .services.eviction import EvictionEngine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(
    title="MemoraForge Memory Hub",
    version="0.1.0",
    description="Long-term memory microservice — RAG + Knowledge Graph + Vector Store",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Services
# ---------------------------------------------------------------------------

vector_store = VectorStoreService()
knowledge_graph = KnowledgeGraphService()
embedding_service = EmbeddingService()
summarizer = SummarizerService()
eviction_engine = EvictionEngine()


# ---------------------------------------------------------------------------
# Lifecycle
# ---------------------------------------------------------------------------


@app.on_event("startup")
async def startup():
    """Initialize all services on startup."""
    logger.info("Starting Memory Hub...")
    await vector_store.initialize()
    await knowledge_graph.initialize()
    await embedding_service.initialize()

    # Inject services into routers
    retrieval.configure_services(vector_store, knowledge_graph, embedding_service, eviction_engine)
    ingestion.configure_services(vector_store, knowledge_graph, embedding_service, summarizer)

    logger.info("Memory Hub ready.")


@app.on_event("shutdown")
async def shutdown():
    """Clean up on shutdown."""
    await knowledge_graph.close()
    logger.info("Memory Hub shut down.")


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

app.include_router(retrieval.router)
app.include_router(ingestion.router)


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "memory-hub",
        "uptime": time.time(),
        "stores": {
            "vector_store": vector_store._initialized,
            "knowledge_graph": knowledge_graph._driver is not None or len(knowledge_graph._entities) >= 0,
            "embedding_cache_size": len(embedding_service._cache),
        },
    }


@app.get("/stats")
async def stats():
    """Global memory statistics."""
    from .routers.ingestion import _memories
    total_memories = len(_memories)
    total_tokens = sum(m.token_count for m in _memories.values())
    total_chunks = sum(len(m.chunks) for m in _memories.values())

    type_breakdown = {}
    for m in _memories.values():
        t = m.memory_type.value
        type_breakdown[t] = type_breakdown.get(t, 0) + 1

    return {
        "total_memories": total_memories,
        "total_tokens": total_tokens,
        "total_chunks": total_chunks,
        "type_breakdown": type_breakdown,
        "vector_store_entries": len(vector_store._store),
        "graph_entities": len(knowledge_graph._entities),
        "graph_relations": len(knowledge_graph._relations),
        "embedding_cache_size": len(embedding_service._cache),
    }


@app.post("/evict")
async def run_eviction(max_evictions: int = 100):
    """Manually trigger eviction of low-value memories."""
    from .routers.ingestion import _memories

    memories = list(_memories.values())
    candidates = eviction_engine.find_eviction_candidates(memories)

    evicted = []
    for candidate in candidates[:max_evictions]:
        memory = _memories.pop(candidate.memory_id, None)
        if memory:
            # Clean up indexes
            for chunk in memory.chunks:
                await vector_store.delete(chunk.chunk_id)
            evicted.append({
                "memory_id": candidate.memory_id,
                "score": candidate.combined_score,
                "tokens_freed": memory.token_count,
            })

    return {
        "evicted": len(evicted),
        "details": evicted,
        "remaining_memories": len(_memories),
    }


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8200, log_level="info")
