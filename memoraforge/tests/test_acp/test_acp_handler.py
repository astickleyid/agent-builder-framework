"""Tests for ACP Handler JSON-RPC methods."""

import pytest
from httpx import ASGITransport, AsyncClient
from memoraforge.acp_handler.handler import app


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
    assert "methods" in resp.json()


@pytest.mark.anyio
async def test_agent_register(client):
    resp = await client.post("/rpc", json={
        "jsonrpc": "2.0",
        "method": "agent.register",
        "params": {
            "agent_id": "test-agent-1",
            "agent_name": "Test Agent",
            "capabilities": ["memory_claw"],
        },
        "id": 1,
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "result" in data
    assert data["result"]["agent_id"] == "test-agent-1"
    assert "session_token" in data["result"]


@pytest.mark.anyio
async def test_memory_claw(client):
    # Register first
    await client.post("/rpc", json={
        "jsonrpc": "2.0",
        "method": "agent.register",
        "params": {"agent_id": "claw-agent", "agent_name": "Claw"},
        "id": 1,
    })

    resp = await client.post("/rpc", json={
        "jsonrpc": "2.0",
        "method": "memory.claw",
        "params": {"query": "test query", "top_k": 10},
        "id": 2,
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "result" in data
    assert "memories" in data["result"]


@pytest.mark.anyio
async def test_memory_store(client):
    resp = await client.post("/rpc", json={
        "jsonrpc": "2.0",
        "method": "memory.store",
        "params": {
            "content": "Important fact to remember",
            "memory_type": "fact",
        },
        "id": 3,
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "result" in data
    assert "memory_id" in data["result"]


@pytest.mark.anyio
async def test_method_not_found(client):
    resp = await client.post("/rpc", json={
        "jsonrpc": "2.0",
        "method": "nonexistent.method",
        "params": {},
        "id": 4,
    })
    data = resp.json()
    assert data["error"]["code"] == -32601


@pytest.mark.anyio
async def test_list_agents(client):
    resp = await client.get("/agents")
    assert resp.status_code == 200
    assert "agents" in resp.json()
