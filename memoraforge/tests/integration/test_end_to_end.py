"""End-to-end integration tests for MemoraForge.

Tests the full flow: register agent → store memory → claw memory → verify.
Runs against the actual services (MCP, ACP, Memory Hub) in-process.
"""

import asyncio
import pytest
from httpx import ASGITransport, AsyncClient

# Import all service apps
from memoraforge.mcp_server.server import app as mcp_app
from memoraforge.acp_handler.handler import app as acp_app
from memoraforge.memory_hub.app import app as hub_app


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def mcp_client():
    transport = ASGITransport(app=mcp_app)
    async with AsyncClient(transport=transport, base_url="http://mcp") as client:
        yield client


@pytest.fixture
async def acp_client():
    transport = ASGITransport(app=acp_app)
    async with AsyncClient(transport=transport, base_url="http://acp") as client:
        yield client


@pytest.fixture
async def hub_client():
    transport = ASGITransport(app=hub_app)
    async with AsyncClient(transport=transport, base_url="http://hub") as client:
        yield client


class TestFullAgentLifecycle:
    """Test the complete agent lifecycle from registration to memory retrieval."""

    @pytest.mark.anyio
    async def test_register_store_claw(self, acp_client, hub_client):
        """Full flow: register → store memories → claw them back."""

        # 1. Register agent
        resp = await acp_client.post("/rpc", json={
            "jsonrpc": "2.0",
            "method": "agent.register",
            "params": {
                "agent_id": "test-e2e-agent",
                "agent_name": "E2E Test Agent",
                "capabilities": ["memory_claw", "memory_store"],
            },
            "id": 1,
        })
        assert resp.status_code == 200
        reg_result = resp.json()["result"]
        assert reg_result["agent_id"] == "test-e2e-agent"
        assert "session_token" in reg_result

        # 2. Store memories via Memory Hub
        memories = [
            "Python was created by Guido van Rossum in 1991.",
            "FastAPI is a modern Python web framework for building APIs.",
            "Docker containers provide lightweight virtualization.",
        ]

        stored_ids = []
        for mem in memories:
            resp = await hub_client.post("/ingest/store", json={
                "agent_id": "test-e2e-agent",
                "content": mem,
                "memory_type": "fact",
                "auto_summarize": False,
            })
            assert resp.status_code == 200
            stored_ids.append(resp.json()["memory_id"])

        assert len(stored_ids) == 3

        # 3. Verify stats
        resp = await hub_client.get("/stats")
        assert resp.status_code == 200
        stats = resp.json()
        assert stats["total_memories"] >= 3

        # 4. Claw memories
        resp = await hub_client.post("/retrieve/claw", json={
            "query": "Python programming language",
            "agent_id": "test-e2e-agent",
            "top_k": 5,
            "max_tokens": 10000,
        })
        assert resp.status_code == 200
        claw_result = resp.json()
        assert claw_result["total_results"] > 0
        assert claw_result["retrieval_ms"] >= 0

        # 5. Verify retrieval has relevant content
        contents = [r["content"] for r in claw_result["results"]]
        found_python = any("Python" in c or "python" in c for c in contents)
        assert found_python, f"Expected Python-related content in results: {contents}"

    @pytest.mark.anyio
    async def test_memory_retrieval_by_id(self, hub_client):
        """Store a memory and retrieve it by ID."""
        resp = await hub_client.post("/ingest/store", json={
            "agent_id": "id-test-agent",
            "content": "The Eiffel Tower is 330 meters tall.",
            "memory_type": "fact",
            "auto_summarize": False,
        })
        memory_id = resp.json()["memory_id"]

        resp = await hub_client.get(f"/ingest/memory/{memory_id}")
        assert resp.status_code == 200
        data = resp.json()
        assert "Eiffel Tower" in data["content"]
        assert data["access_count"] == 1

    @pytest.mark.anyio
    async def test_memory_deletion(self, hub_client):
        """Store and delete a memory."""
        resp = await hub_client.post("/ingest/store", json={
            "agent_id": "delete-test-agent",
            "content": "Temporary memory to delete.",
            "memory_type": "conversation",
            "auto_summarize": False,
        })
        memory_id = resp.json()["memory_id"]

        resp = await hub_client.delete(f"/ingest/memory/{memory_id}")
        assert resp.status_code == 200
        assert resp.json()["deleted"] == memory_id

        resp = await hub_client.get(f"/ingest/memory/{memory_id}")
        assert resp.status_code == 404


class TestContextStreaming:
    """Test MCP context stream operations."""

    @pytest.mark.anyio
    async def test_stream_lifecycle(self, mcp_client):
        """Create stream → push context → retrieve → verify versioning."""

        # Create
        resp = await mcp_client.post("/streams", json={
            "name": "e2e-test-stream",
            "owner_agent_id": "e2e-agent",
        })
        assert resp.status_code == 200
        stream_id = resp.json()["stream_id"]

        # Push multiple items
        for i in range(3):
            resp = await mcp_client.post("/streams/push", json={
                "stream_id": stream_id,
                "content": f"Context chunk {i}: important information about topic {i}.",
                "priority": "high" if i == 0 else "medium",
            })
            assert resp.status_code == 200
            assert resp.json()["version"] == i + 1

        # Retrieve
        resp = await mcp_client.post("/streams/retrieve", json={
            "stream_id": stream_id,
            "max_tokens": 50000,
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["version"] == 3
        assert len(data["chunks"]) >= 3
        # High priority chunk should come first
        assert data["chunks"][0]["priority"] == "high"

        # Stats
        resp = await mcp_client.get(f"/streams/{stream_id}/stats")
        assert resp.status_code == 200
        stats = resp.json()
        assert stats["total_chunks"] >= 3
        assert stats["current_version"] == 3

    @pytest.mark.anyio
    async def test_priority_filtering(self, mcp_client):
        """Test retrieval with priority filters."""
        resp = await mcp_client.post("/streams", json={
            "name": "priority-test",
            "owner_agent_id": "e2e-agent",
        })
        stream_id = resp.json()["stream_id"]

        # Push critical and low priority
        await mcp_client.post("/streams/push", json={
            "stream_id": stream_id,
            "content": "CRITICAL: System safety instruction.",
            "priority": "critical",
        })
        await mcp_client.post("/streams/push", json={
            "stream_id": stream_id,
            "content": "Low priority background info.",
            "priority": "low",
        })

        # Retrieve only critical
        resp = await mcp_client.post("/streams/retrieve", json={
            "stream_id": stream_id,
            "priority_filter": ["critical"],
            "max_tokens": 50000,
        })
        data = resp.json()
        for chunk in data["chunks"]:
            assert chunk["priority"] == "critical"


class TestACPProtocol:
    """Test ACP JSON-RPC protocol behavior."""

    @pytest.mark.anyio
    async def test_invalid_jsonrpc_version(self, acp_client):
        """Should reject non-2.0 JSON-RPC."""
        resp = await acp_client.post("/rpc", json={
            "jsonrpc": "1.0",
            "method": "agent.register",
            "params": {},
            "id": 1,
        })
        assert resp.status_code == 422  # Validation error

    @pytest.mark.anyio
    async def test_method_not_found(self, acp_client):
        """Should return proper error for unknown methods."""
        resp = await acp_client.post("/rpc", json={
            "jsonrpc": "2.0",
            "method": "nonexistent.method",
            "params": {},
            "id": 1,
        })
        data = resp.json()
        assert data["error"]["code"] == -32601

    @pytest.mark.anyio
    async def test_audit_log(self, acp_client):
        """Verify audit log captures RPC calls."""
        await acp_client.post("/rpc", json={
            "jsonrpc": "2.0",
            "method": "agent.register",
            "params": {"agent_id": "audit-test", "agent_name": "Audit Test"},
            "id": 1,
        })

        resp = await acp_client.get("/audit?limit=10")
        assert resp.status_code == 200
        entries = resp.json()["entries"]
        assert len(entries) > 0
        assert any(e["method"] == "agent.register" for e in entries)

    @pytest.mark.anyio
    async def test_agent_listing(self, acp_client):
        """Register multiple agents and list them."""
        for i in range(3):
            await acp_client.post("/rpc", json={
                "jsonrpc": "2.0",
                "method": "agent.register",
                "params": {"agent_id": f"list-test-{i}", "agent_name": f"Agent {i}"},
                "id": i,
            })

        resp = await acp_client.get("/agents")
        assert resp.status_code == 200
        agents = resp.json()["agents"]
        registered_ids = [a["agent_id"] for a in agents]
        for i in range(3):
            assert f"list-test-{i}" in registered_ids


class TestServiceHealth:
    """Test health endpoints across all services."""

    @pytest.mark.anyio
    async def test_mcp_health(self, mcp_client):
        resp = await mcp_client.get("/health")
        assert resp.status_code == 200
        assert resp.json()["status"] == "healthy"

    @pytest.mark.anyio
    async def test_acp_health(self, acp_client):
        resp = await acp_client.get("/health")
        assert resp.status_code == 200
        assert "methods" in resp.json()

    @pytest.mark.anyio
    async def test_hub_health(self, hub_client):
        resp = await hub_client.get("/health")
        assert resp.status_code == 200
        assert resp.json()["status"] == "healthy"
