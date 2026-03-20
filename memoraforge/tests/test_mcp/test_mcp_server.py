"""Tests for MCP Server endpoints."""

import pytest
from httpx import ASGITransport, AsyncClient
from memoraforge.mcp_server.server import app


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest.mark.anyio
async def test_health(client):
    resp = await client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"


@pytest.mark.anyio
async def test_create_stream(client):
    resp = await client.post("/streams", json={
        "name": "test-stream",
        "owner_agent_id": "agent-1",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "test-stream"
    assert "stream_id" in data


@pytest.mark.anyio
async def test_push_and_retrieve(client):
    # Create stream
    resp = await client.post("/streams", json={
        "name": "push-test",
        "owner_agent_id": "agent-1",
    })
    stream_id = resp.json()["stream_id"]

    # Push context
    resp = await client.post("/streams/push", json={
        "stream_id": stream_id,
        "content": "The capital of France is Paris. It is known for the Eiffel Tower.",
        "priority": "high",
    })
    assert resp.status_code == 200
    push_data = resp.json()
    assert push_data["version"] == 1
    assert push_data["compressed"] is True

    # Retrieve context
    resp = await client.post("/streams/retrieve", json={
        "stream_id": stream_id,
        "max_tokens": 10000,
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_tokens"] > 0
    assert len(data["chunks"]) > 0


@pytest.mark.anyio
async def test_stream_stats(client):
    resp = await client.post("/streams", json={
        "name": "stats-test",
        "owner_agent_id": "agent-1",
    })
    stream_id = resp.json()["stream_id"]

    resp = await client.get(f"/streams/{stream_id}/stats")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_chunks"] == 0
    assert data["utilization"] == 0.0
