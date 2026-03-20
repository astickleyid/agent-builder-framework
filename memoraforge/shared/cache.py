"""Redis caching layer — shared across all MemoraForge services.

Provides a unified async Redis interface with:
- Connection pooling
- Key namespacing per service
- TTL management
- Serialization (JSON + raw bytes)
- Graceful fallback when Redis is unavailable
"""

from __future__ import annotations

import json
import logging
import os
import time
from typing import Any

logger = logging.getLogger(__name__)

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")


class RedisCache:
    """Async Redis cache with connection pooling and namespace isolation."""

    def __init__(
        self,
        url: str = REDIS_URL,
        namespace: str = "mf",
        default_ttl: int = 300,
        pool_size: int = 20,
    ):
        self.url = url
        self.namespace = namespace
        self.default_ttl = default_ttl
        self.pool_size = pool_size
        self._redis = None
        self._available = False
        # In-memory fallback
        self._fallback: dict[str, tuple[Any, float]] = {}

    async def connect(self):
        """Initialize Redis connection pool."""
        try:
            import redis.asyncio as aioredis
            self._redis = aioredis.from_url(
                self.url,
                max_connections=self.pool_size,
                decode_responses=False,
                socket_connect_timeout=5,
                socket_timeout=5,
                retry_on_timeout=True,
            )
            await self._redis.ping()
            self._available = True
            logger.info("Redis connected: %s (namespace=%s)", self.url, self.namespace)
        except ImportError:
            logger.warning("redis package not installed — using in-memory fallback")
        except Exception as e:
            logger.warning("Redis unavailable (%s) — using in-memory fallback", e)

    async def close(self):
        """Close Redis connection pool."""
        if self._redis:
            await self._redis.aclose()
            self._available = False

    def _key(self, key: str) -> str:
        """Namespace a key."""
        return f"{self.namespace}:{key}"

    # ── Core operations ─────────────────────────────────────────

    async def get(self, key: str) -> Any | None:
        """Get a JSON-serialized value."""
        if self._available:
            try:
                raw = await self._redis.get(self._key(key))
                if raw is None:
                    return None
                return json.loads(raw)
            except Exception as e:
                logger.debug("Redis GET error: %s", e)
        return self._fallback_get(key)

    async def set(self, key: str, value: Any, ttl: int | None = None) -> bool:
        """Set a JSON-serializable value with optional TTL."""
        ttl = ttl if ttl is not None else self.default_ttl
        serialized = json.dumps(value, separators=(",", ":"))
        if self._available:
            try:
                await self._redis.setex(self._key(key), ttl, serialized.encode())
                return True
            except Exception as e:
                logger.debug("Redis SET error: %s", e)
        return self._fallback_set(key, value, ttl)

    async def delete(self, key: str) -> bool:
        """Delete a key."""
        if self._available:
            try:
                await self._redis.delete(self._key(key))
                return True
            except Exception:
                pass
        self._fallback.pop(key, None)
        return True

    async def exists(self, key: str) -> bool:
        """Check if a key exists."""
        if self._available:
            try:
                return bool(await self._redis.exists(self._key(key)))
            except Exception:
                pass
        entry = self._fallback.get(key)
        return entry is not None and entry[1] > time.time()

    # ── Bytes operations (for compressed data) ──────────────────

    async def get_bytes(self, key: str) -> bytes | None:
        """Get raw bytes (for compressed context bundles)."""
        if self._available:
            try:
                return await self._redis.get(self._key(key))
            except Exception:
                pass
        entry = self._fallback.get(key)
        if entry and entry[1] > time.time():
            return entry[0] if isinstance(entry[0], bytes) else None
        return None

    async def set_bytes(self, key: str, data: bytes, ttl: int | None = None) -> bool:
        """Set raw bytes with TTL."""
        ttl = ttl if ttl is not None else self.default_ttl
        if self._available:
            try:
                await self._redis.setex(self._key(key), ttl, data)
                return True
            except Exception:
                pass
        self._fallback[key] = (data, time.time() + ttl)
        return True

    # ── Hash operations (for structured data) ───────────────────

    async def hset(self, name: str, mapping: dict[str, Any]) -> bool:
        """Set multiple hash fields."""
        if self._available:
            try:
                serialized = {k: json.dumps(v) for k, v in mapping.items()}
                await self._redis.hset(self._key(name), mapping=serialized)
                return True
            except Exception:
                pass
        existing = self._fallback.get(name, ({}, time.time() + 86400))[0]
        if isinstance(existing, dict):
            existing.update(mapping)
            self._fallback[name] = (existing, time.time() + 86400)
        return True

    async def hget(self, name: str, field: str) -> Any | None:
        """Get a hash field."""
        if self._available:
            try:
                raw = await self._redis.hget(self._key(name), field)
                return json.loads(raw) if raw else None
            except Exception:
                pass
        entry = self._fallback.get(name)
        if entry and isinstance(entry[0], dict):
            return entry[0].get(field)
        return None

    async def hgetall(self, name: str) -> dict[str, Any]:
        """Get all hash fields."""
        if self._available:
            try:
                raw = await self._redis.hgetall(self._key(name))
                return {k.decode(): json.loads(v) for k, v in raw.items()}
            except Exception:
                pass
        entry = self._fallback.get(name)
        if entry and isinstance(entry[0], dict):
            return entry[0]
        return {}

    # ── Counter operations (for rate limiting, metrics) ─────────

    async def incr(self, key: str, amount: int = 1) -> int:
        """Increment a counter."""
        if self._available:
            try:
                return await self._redis.incrby(self._key(key), amount)
            except Exception:
                pass
        entry = self._fallback.get(key, (0, time.time() + 3600))
        new_val = (entry[0] if isinstance(entry[0], int) else 0) + amount
        self._fallback[key] = (new_val, entry[1])
        return new_val

    async def expire(self, key: str, ttl: int) -> bool:
        """Set expiry on existing key."""
        if self._available:
            try:
                await self._redis.expire(self._key(key), ttl)
                return True
            except Exception:
                pass
        entry = self._fallback.get(key)
        if entry:
            self._fallback[key] = (entry[0], time.time() + ttl)
        return True

    # ── Pub/Sub (for MCP stream notifications) ──────────────────

    async def publish(self, channel: str, message: Any) -> int:
        """Publish a message to a channel."""
        if self._available:
            try:
                data = json.dumps(message, separators=(",", ":"))
                return await self._redis.publish(self._key(channel), data)
            except Exception:
                pass
        return 0

    # ── Utility ─────────────────────────────────────────────────

    async def flush_namespace(self):
        """Delete all keys in this namespace. USE WITH CAUTION."""
        if self._available:
            try:
                cursor = 0
                while True:
                    cursor, keys = await self._redis.scan(cursor, match=f"{self.namespace}:*", count=100)
                    if keys:
                        await self._redis.delete(*keys)
                    if cursor == 0:
                        break
            except Exception:
                pass
        self._fallback.clear()

    async def health_check(self) -> dict[str, Any]:
        """Check Redis health."""
        if self._available:
            try:
                info = await self._redis.info("memory")
                return {
                    "status": "connected",
                    "used_memory_mb": round(info.get("used_memory", 0) / 1048576, 1),
                    "connected_clients": info.get("connected_clients", 0),
                }
            except Exception as e:
                return {"status": "error", "error": str(e)}
        return {"status": "fallback", "entries": len(self._fallback)}

    def _prune_fallback(self):
        """Remove expired entries from in-memory fallback."""
        now = time.time()
        expired = [k for k, (_, exp) in self._fallback.items() if exp <= now]
        for k in expired:
            del self._fallback[k]

    def _fallback_get(self, key: str) -> Any | None:
        entry = self._fallback.get(key)
        if entry is None:
            return None
        value, expires = entry
        if time.time() > expires:
            del self._fallback[key]
            return None
        return value

    def _fallback_set(self, key: str, value: Any, ttl: int) -> bool:
        self._fallback[key] = (value, time.time() + ttl)
        if len(self._fallback) > 50_000:
            self._prune_fallback()
        return True


# ── Singleton instances per service ─────────────────────────────

_instances: dict[str, RedisCache] = {}


async def get_cache(namespace: str = "mf", db: int = 0) -> RedisCache:
    """Get or create a Redis cache instance for a namespace."""
    key = f"{namespace}:{db}"
    if key not in _instances:
        url = REDIS_URL.rsplit("/", 1)[0] + f"/{db}"
        cache = RedisCache(url=url, namespace=namespace)
        await cache.connect()
        _instances[key] = cache
    return _instances[key]
