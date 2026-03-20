"""Vector store service — Weaviate integration for semantic search."""

from __future__ import annotations

import logging
import time
from typing import Any

logger = logging.getLogger(__name__)


class VectorStoreService:
    """Weaviate-backed vector store for memory embeddings.

    In production, connects to Weaviate cluster. This skeleton includes
    the full interface with an in-memory fallback for local dev.
    """

    def __init__(self, weaviate_url: str = "http://weaviate:8080"):
        self.weaviate_url = weaviate_url
        self._client = None
        # In-memory fallback for development
        self._store: dict[str, dict[str, Any]] = {}
        self._initialized = False

    async def initialize(self):
        """Connect to Weaviate and ensure schema exists."""
        try:
            import weaviate
            self._client = weaviate.Client(self.weaviate_url)
            self._ensure_schema()
            self._initialized = True
            logger.info("Connected to Weaviate at %s", self.weaviate_url)
        except ImportError:
            logger.warning("Weaviate client not installed, using in-memory fallback")
            self._initialized = True
        except Exception as e:
            logger.warning("Weaviate unavailable (%s), using in-memory fallback", e)
            self._initialized = True

    def _ensure_schema(self):
        """Create Weaviate schema for MemoryChunk class."""
        schema = {
            "class": "MemoryChunk",
            "vectorizer": "none",  # We provide our own embeddings
            "properties": [
                {"name": "memory_id", "dataType": ["text"]},
                {"name": "agent_id", "dataType": ["text"]},
                {"name": "content", "dataType": ["text"]},
                {"name": "memory_type", "dataType": ["text"]},
                {"name": "chunk_index", "dataType": ["int"]},
                {"name": "level", "dataType": ["int"]},
                {"name": "token_count", "dataType": ["int"]},
                {"name": "created_at", "dataType": ["number"]},
            ],
        }
        if self._client:
            try:
                self._client.schema.create_class(schema)
            except Exception:
                pass  # Schema already exists

    async def index(
        self,
        chunk_id: str,
        embedding: list[float],
        properties: dict[str, Any],
    ) -> str:
        """Index a memory chunk with its embedding."""
        if self._client:
            self._client.data_object.create(
                class_name="MemoryChunk",
                data_object=properties,
                vector=embedding,
                uuid=chunk_id,
            )
        else:
            # In-memory fallback
            self._store[chunk_id] = {
                "embedding": embedding,
                "properties": properties,
            }

        return chunk_id

    async def search(
        self,
        query_embedding: list[float],
        top_k: int = 50,
        filters: dict[str, Any] | None = None,
        min_certainty: float = 0.3,
    ) -> list[dict[str, Any]]:
        """Semantic search via approximate nearest neighbors.

        Returns top_k results ranked by cosine similarity.
        """
        start = time.time()

        if self._client:
            query = (
                self._client.query
                .get("MemoryChunk", ["memory_id", "agent_id", "content", "token_count"])
                .with_near_vector({"vector": query_embedding, "certainty": min_certainty})
                .with_limit(top_k)
                .with_additional(["certainty", "id"])
            )

            if filters:
                where_filter = self._build_filter(filters)
                query = query.with_where(where_filter)

            result = query.do()
            chunks = result.get("data", {}).get("Get", {}).get("MemoryChunk", [])
        else:
            # In-memory cosine similarity fallback
            chunks = self._inmemory_search(query_embedding, top_k, min_certainty)

        elapsed_ms = (time.time() - start) * 1000
        logger.debug("Vector search: %d results in %.1fms", len(chunks), elapsed_ms)
        return chunks

    async def delete(self, chunk_id: str):
        """Delete a chunk from the vector store."""
        if self._client:
            self._client.data_object.delete(chunk_id, class_name="MemoryChunk")
        else:
            self._store.pop(chunk_id, None)

    async def batch_index(
        self,
        items: list[tuple[str, list[float], dict[str, Any]]],
    ) -> int:
        """Batch index multiple chunks. Returns count indexed."""
        count = 0
        for chunk_id, embedding, properties in items:
            await self.index(chunk_id, embedding, properties)
            count += 1
        return count

    def _inmemory_search(
        self,
        query_embedding: list[float],
        top_k: int,
        min_certainty: float,
    ) -> list[dict[str, Any]]:
        """Fallback cosine similarity search for development."""
        import math

        results = []
        for chunk_id, data in self._store.items():
            stored_emb = data["embedding"]
            if not stored_emb:
                continue
            similarity = self._cosine_similarity(query_embedding, stored_emb)
            if similarity >= min_certainty:
                results.append({
                    **data["properties"],
                    "_additional": {"certainty": similarity, "id": chunk_id},
                })

        results.sort(key=lambda x: x["_additional"]["certainty"], reverse=True)
        return results[:top_k]

    @staticmethod
    def _cosine_similarity(a: list[float], b: list[float]) -> float:
        """Compute cosine similarity between two vectors."""
        if len(a) != len(b):
            return 0.0
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = sum(x * x for x in a) ** 0.5
        norm_b = sum(x * x for x in b) ** 0.5
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot / (norm_a * norm_b)

    @staticmethod
    def _build_filter(filters: dict[str, Any]) -> dict:
        """Build Weaviate where filter from dict."""
        conditions = []
        for key, value in filters.items():
            conditions.append({
                "path": [key],
                "operator": "Equal",
                "valueText": str(value),
            })
        if len(conditions) == 1:
            return conditions[0]
        return {"operator": "And", "operands": conditions}
