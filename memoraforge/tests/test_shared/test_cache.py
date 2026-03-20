"""Tests for Redis cache (in-memory fallback mode)."""

import pytest
from memoraforge.shared.cache import RedisCache


@pytest.fixture
async def cache():
    c = RedisCache(namespace="test")
    await c.connect()  # Will use in-memory fallback
    yield c
    await c.close()


class TestCacheFallback:
    @pytest.mark.asyncio
    async def test_set_and_get(self, cache):
        await cache.set("key1", {"hello": "world"}, ttl=60)
        result = await cache.get("key1")
        assert result == {"hello": "world"}

    @pytest.mark.asyncio
    async def test_get_missing(self, cache):
        result = await cache.get("nonexistent")
        assert result is None

    @pytest.mark.asyncio
    async def test_delete(self, cache):
        await cache.set("to_delete", "value")
        await cache.delete("to_delete")
        assert await cache.get("to_delete") is None

    @pytest.mark.asyncio
    async def test_exists(self, cache):
        await cache.set("exists_key", "yes", ttl=60)
        assert await cache.exists("exists_key") is True
        assert await cache.exists("no_key") is False

    @pytest.mark.asyncio
    async def test_incr(self, cache):
        val = await cache.incr("counter", 1)
        assert val == 1
        val = await cache.incr("counter", 5)
        assert val == 6

    @pytest.mark.asyncio
    async def test_hash_operations(self, cache):
        await cache.hset("myhash", {"field1": "value1", "field2": 42})
        assert await cache.hget("myhash", "field1") == "value1"
        assert await cache.hget("myhash", "field2") == 42
        all_fields = await cache.hgetall("myhash")
        assert len(all_fields) == 2

    @pytest.mark.asyncio
    async def test_bytes_operations(self, cache):
        data = b"compressed binary data"
        await cache.set_bytes("bin_key", data, ttl=60)
        result = await cache.get_bytes("bin_key")
        assert result == data

    @pytest.mark.asyncio
    async def test_health_check(self, cache):
        health = await cache.health_check()
        assert health["status"] == "fallback"
