"""ACP JSON-RPC 2.0 schemas — request/response validation."""

from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field, field_validator


# ---------------------------------------------------------------------------
# JSON-RPC 2.0 Base
# ---------------------------------------------------------------------------


class JsonRpcRequest(BaseModel):
    """JSON-RPC 2.0 request envelope."""

    jsonrpc: str = "2.0"
    method: str
    params: dict[str, Any] = {}
    id: str | int | None = None

    @field_validator("jsonrpc")
    @classmethod
    def validate_version(cls, v: str) -> str:
        if v != "2.0":
            raise ValueError("Only JSON-RPC 2.0 is supported")
        return v


class JsonRpcResponse(BaseModel):
    """JSON-RPC 2.0 response envelope."""

    jsonrpc: str = "2.0"
    result: Any = None
    error: JsonRpcError | None = None
    id: str | int | None = None


class JsonRpcError(BaseModel):
    """JSON-RPC 2.0 error object."""

    code: int
    message: str
    data: Any = None


# ---------------------------------------------------------------------------
# Standard error codes
# ---------------------------------------------------------------------------


class ErrorCode(int, Enum):
    PARSE_ERROR = -32700
    INVALID_REQUEST = -32600
    METHOD_NOT_FOUND = -32601
    INVALID_PARAMS = -32602
    INTERNAL_ERROR = -32603
    # Custom MemoraForge codes
    AUTH_FAILED = -32000
    RATE_LIMITED = -32001
    AGENT_NOT_FOUND = -32002
    MEMORY_OVERFLOW = -32003
    CONTEXT_STALE = -32004
    HANDSHAKE_FAILED = -32005


# ---------------------------------------------------------------------------
# ACP Method Params
# ---------------------------------------------------------------------------


class AgentRegisterParams(BaseModel):
    """Parameters for agent.register."""

    agent_id: str
    agent_name: str
    capabilities: list[str] = []  # e.g., ["web_scrape", "code_exec", "rag"]
    version: str = "0.1.0"
    max_context_tokens: int = 128_000
    metadata: dict[str, Any] = {}


class AgentInvokeParams(BaseModel):
    """Parameters for agent.invoke — call another agent."""

    target_agent_id: str
    action: str
    payload: dict[str, Any] = {}
    timeout_ms: int = 30_000
    require_memory_handoff: bool = False


class MemoryClawParams(BaseModel):
    """Parameters for memory.claw — retrieve from Memory Hub."""

    query: str
    top_k: int = 50
    filters: dict[str, Any] = {}
    include_graph: bool = True
    max_tokens: int = 50_000
    min_relevance: float = 0.3


class MemoryStoreParams(BaseModel):
    """Parameters for memory.store — persist to Memory Hub."""

    content: str
    memory_type: str = "conversation"  # conversation, fact, code, document
    metadata: dict[str, Any] = {}
    ttl_hours: int | None = None  # None = permanent
    relations: list[dict[str, str]] = []  # Knowledge graph edges


class ContextSubscribeParams(BaseModel):
    """Parameters for context.subscribe — subscribe to MCP stream."""

    stream_name: str
    priority_filter: list[str] | None = None
    from_version: int | None = None


class OrchestratorDispatchParams(BaseModel):
    """Parameters for orchestrator.dispatch — multi-agent task dispatch."""

    task: str
    agent_ids: list[str] = []  # Empty = auto-select
    strategy: str = "parallel"  # parallel, sequential, consensus
    timeout_ms: int = 60_000
    aggregate_results: bool = True


class MemoryHandoffParams(BaseModel):
    """Parameters for memory.handoff — transfer memory between agents."""

    source_agent_id: str
    target_agent_id: str
    memory_ids: list[str] = []  # Empty = transfer all
    include_shadow: bool = True  # Include shadow memory


# ---------------------------------------------------------------------------
# ACP Method Results
# ---------------------------------------------------------------------------


class AgentRegisterResult(BaseModel):
    agent_id: str
    session_token: str
    assigned_stream_id: str
    hub_endpoint: str


class MemoryClawResult(BaseModel):
    memories: list[dict[str, Any]]
    total_tokens: int
    graph_context: dict[str, Any] | None = None
    retrieval_ms: float


class MemoryStoreResult(BaseModel):
    memory_id: str
    stored_tokens: int
    graph_nodes_created: int = 0


class AgentInvokeResult(BaseModel):
    response: Any
    agent_id: str
    execution_ms: float
    memory_handoff_id: str | None = None
