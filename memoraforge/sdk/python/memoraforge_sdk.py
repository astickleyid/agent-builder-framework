"""MemoraForge Python SDK — Client library for the MemoraForge platform.

Usage:
    from memoraforge_sdk import MemoraForge

    mf = MemoraForge(api_key="mf_...")
    agent = mf.create_agent("my-agent", model="llama3.1:8b")
    response = await agent.run("What do you know about quantum computing?")
    memories = await agent.claw("quantum entanglement", top_k=20)
"""

from __future__ import annotations

import json
import uuid
from typing import Any

import httpx


class MemoraForge:
    """Main client for the MemoraForge platform."""

    def __init__(
        self,
        api_key: str = "",
        base_url: str = "http://localhost:8300",
        memory_hub_url: str = "http://localhost:8200",
        mcp_url: str = "http://localhost:8100",
        api_server_url: str = "http://localhost:8000",
    ):
        self.api_key = api_key
        self.base_url = base_url
        self.memory_hub_url = memory_hub_url
        self.mcp_url = mcp_url
        self.api_server_url = api_server_url
        self._http = httpx.AsyncClient(
            timeout=60.0,
            headers={"X-API-Key": api_key} if api_key else {},
        )

    async def create_agent(
        self,
        name: str,
        model: str = "llama3.1:8b",
        capabilities: list[str] | None = None,
    ) -> "AgentClient":
        """Create and register a new agent."""
        agent_id = f"agent_{uuid.uuid4().hex[:8]}"

        result = await self._rpc("agent.register", {
            "agent_id": agent_id,
            "agent_name": name,
            "capabilities": capabilities or ["memory_claw", "memory_store"],
            "max_context_tokens": 128_000,
        })

        return AgentClient(
            agent_id=agent_id,
            name=name,
            model=model,
            session_token=result.get("session_token", ""),
            stream_id=result.get("assigned_stream_id", ""),
            platform=self,
        )

    async def list_agents(self) -> list[dict[str, Any]]:
        """List all registered agents."""
        resp = await self._http.get(f"{self.base_url}/agents")
        return resp.json().get("agents", [])

    async def _rpc(self, method: str, params: dict[str, Any]) -> dict[str, Any]:
        """Make a JSON-RPC 2.0 call to the ACP handler."""
        resp = await self._http.post(
            f"{self.base_url}/rpc",
            json={
                "jsonrpc": "2.0",
                "method": method,
                "params": params,
                "id": uuid.uuid4().hex[:8],
            },
        )
        data = resp.json()
        if "error" in data and data["error"]:
            raise MemoraForgeError(data["error"]["message"], data["error"]["code"])
        return data.get("result", {})

    async def close(self):
        await self._http.aclose()


class AgentClient:
    """Client for interacting with a registered agent."""

    def __init__(
        self,
        agent_id: str,
        name: str,
        model: str,
        session_token: str,
        stream_id: str,
        platform: MemoraForge,
    ):
        self.agent_id = agent_id
        self.name = name
        self.model = model
        self.session_token = session_token
        self.stream_id = stream_id
        self._platform = platform

    async def claw(
        self,
        query: str,
        top_k: int = 50,
        include_graph: bool = True,
        max_tokens: int = 50_000,
    ) -> list[dict[str, Any]]:
        """Claw memories from the Memory Hub."""
        result = await self._platform._rpc("memory.claw", {
            "query": query,
            "top_k": top_k,
            "include_graph": include_graph,
            "max_tokens": max_tokens,
        })
        return result.get("memories", [])

    async def store(
        self,
        content: str,
        memory_type: str = "fact",
        metadata: dict[str, Any] | None = None,
        relations: list[dict[str, str]] | None = None,
    ) -> str:
        """Store a memory in the Memory Hub."""
        result = await self._platform._rpc("memory.store", {
            "content": content,
            "memory_type": memory_type,
            "metadata": metadata or {},
            "relations": relations or [],
        })
        return result.get("memory_id", "")

    async def invoke(
        self,
        target_agent_id: str,
        action: str,
        payload: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Invoke an action on another agent."""
        return await self._platform._rpc("agent.invoke", {
            "target_agent_id": target_agent_id,
            "action": action,
            "payload": payload or {},
        })

    async def subscribe_context(self, stream_name: str) -> dict[str, Any]:
        """Subscribe to an MCP context stream."""
        return await self._platform._rpc("context.subscribe", {
            "stream_name": stream_name,
        })


class MemoraForgeError(Exception):
    """Error from the MemoraForge platform."""

    def __init__(self, message: str, code: int = -1):
        super().__init__(message)
        self.code = code
