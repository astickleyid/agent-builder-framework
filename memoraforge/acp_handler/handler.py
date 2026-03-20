"""ACP Handler — JSON-RPC 2.0 server for Agent Client Protocol.

Handles agent registration, inter-agent communication, memory operations,
context subscriptions, and multi-agent orchestration dispatch.
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
import uuid
from typing import Any, Callable, Awaitable

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    JsonRpcRequest,
    JsonRpcResponse,
    JsonRpcError,
    ErrorCode,
    AgentRegisterParams,
    AgentInvokeParams,
    MemoryClawParams,
    MemoryStoreParams,
    ContextSubscribeParams,
    OrchestratorDispatchParams,
    MemoryHandoffParams,
    AgentRegisterResult,
    MemoryClawResult,
    MemoryStoreResult,
    AgentInvokeResult,
)
from .auth import (
    generate_api_key,
    validate_api_key,
    issue_session_token,
    validate_session_token,
    check_rate_limit,
)

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(title="MemoraForge ACP Handler", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Agent registry
_agents: dict[str, dict[str, Any]] = {}
_agent_ws: dict[str, WebSocket] = {}

# Audit log (in production → PostgreSQL)
_audit_log: list[dict[str, Any]] = []

# Method registry
MethodHandler = Callable[[dict[str, Any], str], Awaitable[Any]]
_methods: dict[str, MethodHandler] = {}


def rpc_method(name: str):
    """Decorator to register a JSON-RPC method handler."""
    def decorator(func: MethodHandler) -> MethodHandler:
        _methods[name] = func
        return func
    return decorator


# ---------------------------------------------------------------------------
# Core RPC dispatch
# ---------------------------------------------------------------------------


async def dispatch_rpc(request: JsonRpcRequest, agent_id: str = "") -> JsonRpcResponse:
    """Dispatch a JSON-RPC request to the appropriate handler."""
    # Rate limit check
    if agent_id and not check_rate_limit(agent_id):
        return JsonRpcResponse(
            id=request.id,
            error=JsonRpcError(
                code=ErrorCode.RATE_LIMITED,
                message="Rate limit exceeded. Try again later.",
            ),
        )

    handler = _methods.get(request.method)
    if not handler:
        return JsonRpcResponse(
            id=request.id,
            error=JsonRpcError(
                code=ErrorCode.METHOD_NOT_FOUND,
                message=f"Method '{request.method}' not found",
                data={"available": list(_methods.keys())},
            ),
        )

    try:
        result = await handler(request.params, agent_id)
        _audit(agent_id, request.method, "success")
        return JsonRpcResponse(id=request.id, result=result)
    except ValueError as e:
        _audit(agent_id, request.method, "invalid_params")
        return JsonRpcResponse(
            id=request.id,
            error=JsonRpcError(code=ErrorCode.INVALID_PARAMS, message=str(e)),
        )
    except Exception as e:
        logger.exception("RPC handler error: %s", request.method)
        _audit(agent_id, request.method, "error")
        return JsonRpcResponse(
            id=request.id,
            error=JsonRpcError(code=ErrorCode.INTERNAL_ERROR, message=str(e)),
        )


# ---------------------------------------------------------------------------
# RPC Methods
# ---------------------------------------------------------------------------


@rpc_method("agent.register")
async def handle_agent_register(params: dict[str, Any], _agent_id: str) -> dict:
    """Register a new agent in the platform."""
    p = AgentRegisterParams(**params)

    api_key = generate_api_key(p.agent_id, scopes=["read", "write", "invoke"])
    session_token = issue_session_token(p.agent_id, scopes=["read", "write", "invoke"])

    _agents[p.agent_id] = {
        "agent_id": p.agent_id,
        "agent_name": p.agent_name,
        "capabilities": p.capabilities,
        "version": p.version,
        "max_context_tokens": p.max_context_tokens,
        "metadata": p.metadata,
        "registered_at": time.time(),
        "status": "active",
    }

    stream_id = f"stream_{p.agent_id[:8]}"

    logger.info("Registered agent: %s (%s)", p.agent_id, p.agent_name)

    return AgentRegisterResult(
        agent_id=p.agent_id,
        session_token=session_token,
        assigned_stream_id=stream_id,
        hub_endpoint="http://memory-hub:8200",
    ).model_dump()


@rpc_method("agent.invoke")
async def handle_agent_invoke(params: dict[str, Any], caller_id: str) -> dict:
    """Invoke an action on another agent."""
    p = AgentInvokeParams(**params)

    target = _agents.get(p.target_agent_id)
    if not target:
        raise ValueError(f"Agent '{p.target_agent_id}' not found")

    target_ws = _agent_ws.get(p.target_agent_id)
    if not target_ws:
        raise ValueError(f"Agent '{p.target_agent_id}' is not connected")

    # Forward the invocation to target agent
    invocation = {
        "type": "invocation",
        "from_agent": caller_id,
        "action": p.action,
        "payload": p.payload,
        "invocation_id": uuid.uuid4().hex[:12],
    }

    start = time.time()
    try:
        await asyncio.wait_for(
            target_ws.send_json(invocation),
            timeout=p.timeout_ms / 1000,
        )
        # In production, wait for response via callback
        response = {"status": "dispatched", "invocation_id": invocation["invocation_id"]}
    except asyncio.TimeoutError:
        raise ValueError(f"Agent '{p.target_agent_id}' timed out after {p.timeout_ms}ms")

    execution_ms = (time.time() - start) * 1000

    handoff_id = None
    if p.require_memory_handoff:
        handoff_id = f"handoff_{uuid.uuid4().hex[:8]}"

    return AgentInvokeResult(
        response=response,
        agent_id=p.target_agent_id,
        execution_ms=execution_ms,
        memory_handoff_id=handoff_id,
    ).model_dump()


@rpc_method("memory.claw")
async def handle_memory_claw(params: dict[str, Any], agent_id: str) -> dict:
    """Retrieve memories from the Memory Hub via semantic search + graph traversal.

    This is a proxy that forwards to the Memory Hub microservice.
    In production, this calls the Memory Hub's /retrieve endpoint.
    """
    p = MemoryClawParams(**params)
    start = time.time()

    # Placeholder: in production, call Memory Hub via httpx
    # async with httpx.AsyncClient() as client:
    #     resp = await client.post("http://memory-hub:8200/retrieve", json=p.model_dump())
    #     memories = resp.json()

    memories = [
        {
            "memory_id": f"mem_{uuid.uuid4().hex[:8]}",
            "content": f"[Memory Hub retrieval for: {p.query}]",
            "relevance_score": 0.95,
            "source": "vector_store",
            "token_count": 256,
        }
    ]

    graph_context = None
    if p.include_graph:
        graph_context = {
            "entities": [],
            "relations": [],
            "traversal_depth": 2,
        }

    retrieval_ms = (time.time() - start) * 1000

    return MemoryClawResult(
        memories=memories,
        total_tokens=sum(m.get("token_count", 0) for m in memories),
        graph_context=graph_context,
        retrieval_ms=retrieval_ms,
    ).model_dump()


@rpc_method("memory.store")
async def handle_memory_store(params: dict[str, Any], agent_id: str) -> dict:
    """Store a new memory in the Memory Hub."""
    p = MemoryStoreParams(**params)

    memory_id = f"mem_{uuid.uuid4().hex[:8]}"

    # Placeholder: in production, call Memory Hub via httpx
    # async with httpx.AsyncClient() as client:
    #     resp = await client.post("http://memory-hub:8200/store", json={
    #         "agent_id": agent_id,
    #         "content": p.content,
    #         "memory_type": p.memory_type,
    #         "metadata": p.metadata,
    #         "relations": p.relations,
    #     })

    logger.info("Stored memory %s for agent %s (%d chars)", memory_id, agent_id, len(p.content))

    from .schemas import MemoryStoreResult as MSR
    return MSR(
        memory_id=memory_id,
        stored_tokens=len(p.content) // 4,
        graph_nodes_created=len(p.relations),
    ).model_dump()


@rpc_method("context.subscribe")
async def handle_context_subscribe(params: dict[str, Any], agent_id: str) -> dict:
    """Subscribe an agent to an MCP context stream."""
    p = ContextSubscribeParams(**params)

    # Placeholder: in production, call MCP Server
    subscription_id = f"sub_{uuid.uuid4().hex[:8]}"

    return {
        "subscription_id": subscription_id,
        "stream_name": p.stream_name,
        "agent_id": agent_id,
        "status": "subscribed",
    }


@rpc_method("orchestrator.dispatch")
async def handle_orchestrator_dispatch(params: dict[str, Any], caller_id: str) -> dict:
    """Dispatch a task to multiple agents via the orchestrator."""
    p = OrchestratorDispatchParams(**params)

    # Select agents
    target_ids = p.agent_ids or list(_agents.keys())
    if not target_ids:
        raise ValueError("No agents available for dispatch")

    results = []
    if p.strategy == "parallel":
        # Fan-out to all agents simultaneously
        tasks = []
        for aid in target_ids:
            invoke_params = {
                "target_agent_id": aid,
                "action": "execute_task",
                "payload": {"task": p.task},
                "timeout_ms": p.timeout_ms,
            }
            tasks.append(handle_agent_invoke(invoke_params, caller_id))

        settled = await asyncio.gather(*tasks, return_exceptions=True)
        for aid, result in zip(target_ids, settled):
            if isinstance(result, Exception):
                results.append({"agent_id": aid, "error": str(result)})
            else:
                results.append({"agent_id": aid, "result": result})

    elif p.strategy == "sequential":
        for aid in target_ids:
            try:
                invoke_params = {
                    "target_agent_id": aid,
                    "action": "execute_task",
                    "payload": {"task": p.task},
                    "timeout_ms": p.timeout_ms,
                }
                result = await handle_agent_invoke(invoke_params, caller_id)
                results.append({"agent_id": aid, "result": result})
            except Exception as e:
                results.append({"agent_id": aid, "error": str(e)})

    return {
        "task": p.task,
        "strategy": p.strategy,
        "dispatched_to": target_ids,
        "results": results,
    }


@rpc_method("memory.handoff")
async def handle_memory_handoff(params: dict[str, Any], caller_id: str) -> dict:
    """Transfer memory between agents — key for multi-agent coordination."""
    p = MemoryHandoffParams(**params)

    handoff_id = f"handoff_{uuid.uuid4().hex[:8]}"

    logger.info(
        "Memory handoff %s: %s → %s (%d memories)",
        handoff_id, p.source_agent_id, p.target_agent_id, len(p.memory_ids),
    )

    return {
        "handoff_id": handoff_id,
        "source_agent_id": p.source_agent_id,
        "target_agent_id": p.target_agent_id,
        "memories_transferred": len(p.memory_ids) or "all",
        "include_shadow": p.include_shadow,
        "status": "completed",
    }


# ---------------------------------------------------------------------------
# REST + WebSocket Endpoints
# ---------------------------------------------------------------------------


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "registered_agents": len(_agents),
        "connected_agents": len(_agent_ws),
        "methods": list(_methods.keys()),
    }


@app.post("/rpc")
async def rpc_endpoint(request: JsonRpcRequest, x_api_key: str = Header(default="")):
    """HTTP endpoint for JSON-RPC 2.0 requests."""
    agent_id = ""
    if x_api_key:
        key_info = validate_api_key(x_api_key)
        if not key_info:
            raise HTTPException(401, "Invalid API key")
        agent_id = key_info["agent_id"]

    response = await dispatch_rpc(request, agent_id)
    return response.model_dump(exclude_none=True)


@app.websocket("/ws/{agent_id}")
async def agent_websocket(websocket: WebSocket, agent_id: str):
    """WebSocket endpoint for persistent agent connections."""
    await websocket.accept()
    _agent_ws[agent_id] = websocket
    logger.info("Agent %s connected to ACP", agent_id)

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                request = JsonRpcRequest(**json.loads(raw))
            except Exception as e:
                error_resp = JsonRpcResponse(
                    error=JsonRpcError(code=ErrorCode.PARSE_ERROR, message=str(e)),
                )
                await websocket.send_json(error_resp.model_dump(exclude_none=True))
                continue

            response = await dispatch_rpc(request, agent_id)
            await websocket.send_json(response.model_dump(exclude_none=True))
    except WebSocketDisconnect:
        logger.info("Agent %s disconnected from ACP", agent_id)
    finally:
        _agent_ws.pop(agent_id, None)


@app.get("/agents")
async def list_agents():
    """List all registered agents."""
    return {
        "agents": [
            {
                "agent_id": a["agent_id"],
                "agent_name": a["agent_name"],
                "capabilities": a["capabilities"],
                "status": a["status"],
                "connected": a["agent_id"] in _agent_ws,
            }
            for a in _agents.values()
        ]
    }


@app.get("/audit")
async def get_audit_log(limit: int = 100):
    """Retrieve recent audit log entries."""
    return {"entries": _audit_log[-limit:]}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _audit(agent_id: str, method: str, status: str):
    """Record an audit log entry."""
    entry = {
        "timestamp": time.time(),
        "agent_id": agent_id,
        "method": method,
        "status": status,
    }
    _audit_log.append(entry)
    # Keep last 10k entries in memory
    if len(_audit_log) > 10_000:
        _audit_log[:] = _audit_log[-5_000:]


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8300, log_level="info")
