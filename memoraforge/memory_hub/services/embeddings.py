"""Embedding service — batch embedding generation with caching."""

from __future__ import annotations

import hashlib
import logging
import time
from typing import Any

logger = logging.getLogger(__name__)


class EmbeddingService:
    """Generate and cache embeddings for memory content.

    Uses sentence-transformers locally or the headless API server
    for high-throughput embedding generation.
    """

    def __init__(
        self,
        model_name: str = "all-MiniLM-L6-v2",
        api_url: str | None = None,
        cache_ttl_hours: int = 24,
        batch_size: int = 64,
        embedding_dim: int = 384,
    ):
        self.model_name = model_name
        self.api_url = api_url
        self.cache_ttl_hours = cache_ttl_hours
        self.batch_size = batch_size
        self.embedding_dim = embedding_dim
        self._model = None
        # In-memory cache (Redis in production)
        self._cache: dict[str, tuple[list[float], float]] = {}

    async def initialize(self):
        """Load the embedding model."""
        try:
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer(self.model_name)
            logger.info("Loaded embedding model: %s", self.model_name)
        except ImportError:
            logger.warning("sentence-transformers not installed, using hash-based fallback")

    async def embed(self, text: str) -> list[float]:
        """Generate embedding for a single text, with caching."""
        cache_key = self._cache_key(text)

        # Check cache
        cached = self._cache.get(cache_key)
        if cached:
            embedding, ts = cached
            if (time.time() - ts) < self.cache_ttl_hours * 3600:
                return embedding

        # Generate
        if self._model:
            embedding = self._model.encode(text).tolist()
        elif self.api_url:
            embedding = await self._api_embed(text)
        else:
            embedding = self._fallback_embed(text)

        # Cache
        self._cache[cache_key] = (embedding, time.time())
        self._prune_cache()

        return embedding

    async def embed_batch(self, texts: list[str]) -> list[list[float]]:
        """Batch embed multiple texts efficiently.

        Accumulates texts and processes in batches of self.batch_size.
        """
        results: list[list[float]] = []
        uncached_indices: list[int] = []
        uncached_texts: list[str] = []

        # Check cache for each text
        for i, text in enumerate(texts):
            cache_key = self._cache_key(text)
            cached = self._cache.get(cache_key)
            if cached and (time.time() - cached[1]) < self.cache_ttl_hours * 3600:
                results.append(cached[0])
            else:
                results.append([])  # Placeholder
                uncached_indices.append(i)
                uncached_texts.append(text)

        # Batch generate uncached embeddings
        if uncached_texts:
            if self._model:
                embeddings = self._model.encode(uncached_texts, batch_size=self.batch_size).tolist()
            else:
                embeddings = [self._fallback_embed(t) for t in uncached_texts]

            for idx, embedding in zip(uncached_indices, embeddings):
                results[idx] = embedding
                cache_key = self._cache_key(texts[idx])
                self._cache[cache_key] = (embedding, time.time())

        return results

    async def _api_embed(self, text: str) -> list[float]:
        """Generate embedding via the headless API server."""
        import httpx
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.api_url}/v1/embeddings",
                json={"input": text, "model": self.model_name},
                timeout=10.0,
            )
            resp.raise_for_status()
            data = resp.json()
            return data["data"][0]["embedding"]

    def _fallback_embed(self, text: str) -> list[float]:
        """Deterministic hash-based embedding for development."""
        h = hashlib.sha256(text.encode()).digest()
        # Expand hash to embedding_dim floats in [-1, 1]
        embedding = []
        for i in range(self.embedding_dim):
            byte_idx = i % len(h)
            val = (h[byte_idx] / 255.0) * 2 - 1  # Map 0-255 to -1..1
            embedding.append(round(val, 6))
        return embedding

    def _cache_key(self, text: str) -> str:
        """Generate cache key from text hash."""
        return hashlib.md5(text.encode()).hexdigest()

    def _prune_cache(self, max_size: int = 100_000):
        """Prune old cache entries if cache is too large."""
        if len(self._cache) > max_size:
            # Remove oldest 20%
            sorted_keys = sorted(self._cache.keys(), key=lambda k: self._cache[k][1])
            for key in sorted_keys[:max_size // 5]:
                del self._cache[key]
