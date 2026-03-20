"""MCP gRPC transport — high-performance inter-service context streaming.

Provides gRPC endpoints parallel to the WebSocket transport for
service-to-service communication where latency matters most.
Uses streaming RPCs for context subscriptions.
"""

from __future__ import annotations

import asyncio
import logging
import time
import uuid
from typing import AsyncIterator

from .models import (
    ContextChunk, ContextStream, ContextVersion,
    ChunkType, Priority,
)
from .compression import compress_context, semantic_chunk

logger = logging.getLogger(__name__)

# ─── Proto-equivalent message classes ────────────────────────────
# In production, generate from .proto files with grpcio-tools.
# These dataclasses mirror the proto schema.


class CreateStreamReq:
    def __init__(self, name: str = "", owner_agent_id: str = "", max_tokens: int = 5_000_000):
        self.name = name
        self.owner_agent_id = owner_agent_id
        self.max_tokens = max_tokens


class CreateStreamResp:
    def __init__(self, stream_id: str = "", name: str = "", version: int = 0):
        self.stream_id = stream_id
        self.name = name
        self.version = version


class PushContextReq:
    def __init__(self, stream_id: str = "", content: str = "",
                 priority: str = "medium", compress: bool = True):
        self.stream_id = stream_id
        self.content = content
        self.priority = priority
        self.compress = compress


class PushContextResp:
    def __init__(self, chunk_id: str = "", version: int = 0,
                 tokens_used: int = 0, compression_ratio: float = 1.0):
        self.chunk_id = chunk_id
        self.version = version
        self.tokens_used = tokens_used
        self.compression_ratio = compression_ratio


class SubscribeReq:
    def __init__(self, stream_id: str = "", agent_id: str = "", from_version: int = 0):
        self.stream_id = stream_id
        self.agent_id = agent_id
        self.from_version = from_version


class ContextUpdate:
    def __init__(self, stream_id: str = "", version: int = 0,
                 total_tokens: int = 0, chunks: list = None):
        self.stream_id = stream_id
        self.version = version
        self.total_tokens = total_tokens
        self.chunks = chunks or []


class RetrieveReq:
    def __init__(self, stream_id: str = "", max_tokens: int = 128_000,
                 priority_filter: list = None):
        self.stream_id = stream_id
        self.max_tokens = max_tokens
        self.priority_filter = priority_filter or []


class RetrieveResp:
    def __init__(self, stream_id: str = "", version: int = 0,
                 chunks: list = None, total_tokens: int = 0, truncated: bool = False):
        self.stream_id = stream_id
        self.version = version
        self.chunks = chunks or []
        self.total_tokens = total_tokens
        self.truncated = truncated


# ─── gRPC Service Implementation ────────────────────────────────


class MCPGrpcService:
    """gRPC service implementation for Model Context Protocol.

    In production, this extends the generated protobuf servicer.
    Here it implements the same logic as the REST/WebSocket server
    but optimized for gRPC streaming.
    """

    def __init__(self):
        self._streams: dict[str, ContextStream] = {}
        self._subscriptions: dict[str, dict] = {}  # stream_id → {agent_id: queue}

    async def CreateStream(self, request: CreateStreamReq) -> CreateStreamResp:
        """Create a new context stream."""
        stream = ContextStream(
            name=request.name,
            owner_agent_id=request.owner_agent_id,
            max_tokens=request.max_tokens,
        )
        self._streams[stream.stream_id] = stream
        logger.info("gRPC: Created stream %s", stream.stream_id)
        return CreateStreamResp(
            stream_id=stream.stream_id,
            name=stream.name,
            version=stream.current_version,
        )

    async def PushContext(self, request: PushContextReq) -> PushContextResp:
        """Push context into a stream with compression."""
        stream = self._streams.get(request.stream_id)
        if not stream:
            raise ValueError(f"Stream {request.stream_id} not found")

        sem_chunks = semantic_chunk(request.content)
        priority = Priority(request.priority)

        first_chunk_id = ""
        compression_ratio = 1.0

        for sc in sem_chunks:
            ratio = 1.0
            if request.compress:
                _, ratio = compress_context(sc.text)
                compression_ratio = ratio

            chunk = ContextChunk(
                content=sc.text,
                token_count=sc.token_estimate,
                chunk_type=ChunkType.TEXT,
                priority=priority,
                compressed=request.compress,
                compression_ratio=ratio,
                metadata={"hash": sc.chunk_hash},
            )
            stream.chunks[chunk.chunk_id] = chunk
            if not first_chunk_id:
                first_chunk_id = chunk.chunk_id

        stream.current_version += 1
        version = ContextVersion(
            version=stream.current_version,
            stream_id=stream.stream_id,
            chunk_ids=[first_chunk_id],
            total_tokens=stream.total_tokens,
        )
        stream.versions.append(version)

        # Notify gRPC subscribers
        await self._notify_grpc_subscribers(stream, version)

        return PushContextResp(
            chunk_id=first_chunk_id,
            version=stream.current_version,
            tokens_used=stream.total_tokens,
            compression_ratio=compression_ratio,
        )

    async def Subscribe(self, request: SubscribeReq) -> AsyncIterator[ContextUpdate]:
        """Server-streaming RPC — yields context updates as they arrive.

        This is the key advantage of gRPC: true server-push streaming
        without WebSocket overhead.
        """
        stream = self._streams.get(request.stream_id)
        if not stream:
            raise ValueError(f"Stream {request.stream_id} not found")

        # Create async queue for this subscriber
        queue: asyncio.Queue[ContextUpdate] = asyncio.Queue(maxsize=1000)

        if request.stream_id not in self._subscriptions:
            self._subscriptions[request.stream_id] = {}
        self._subscriptions[request.stream_id][request.agent_id] = queue

        stream.subscribers.add(request.agent_id)
        logger.info("gRPC: Agent %s subscribed to stream %s", request.agent_id, request.stream_id)

        try:
            while True:
                update = await queue.get()
                yield update
        finally:
            self._subscriptions.get(request.stream_id, {}).pop(request.agent_id, None)
            stream.subscribers.discard(request.agent_id)

    async def Retrieve(self, request: RetrieveReq) -> RetrieveResp:
        """Retrieve context from a stream within token budget."""
        stream = self._streams.get(request.stream_id)
        if not stream:
            raise ValueError(f"Stream {request.stream_id} not found")

        chunks = list(stream.chunks.values())
        priority_order = {
            Priority.CRITICAL: 0, Priority.HIGH: 1,
            Priority.MEDIUM: 2, Priority.LOW: 3,
        }
        chunks.sort(key=lambda c: (priority_order.get(c.priority, 9), -c.created_at))

        selected = []
        budget = request.max_tokens
        truncated = False

        for chunk in chunks:
            effective = chunk.effective_tokens()
            if budget - effective < 0:
                truncated = True
                break
            budget -= effective
            selected.append({
                "chunk_id": chunk.chunk_id,
                "content": chunk.content,
                "token_count": chunk.token_count,
                "priority": chunk.priority.value,
            })

        return RetrieveResp(
            stream_id=stream.stream_id,
            version=stream.current_version,
            chunks=selected,
            total_tokens=sum(c["token_count"] for c in selected),
            truncated=truncated,
        )

    async def _notify_grpc_subscribers(self, stream: ContextStream, version: ContextVersion):
        """Push updates to all gRPC stream subscribers."""
        subs = self._subscriptions.get(stream.stream_id, {})
        update = ContextUpdate(
            stream_id=stream.stream_id,
            version=version.version,
            total_tokens=version.total_tokens,
        )
        for agent_id, queue in subs.items():
            try:
                queue.put_nowait(update)
            except asyncio.QueueFull:
                logger.warning("gRPC subscriber queue full for agent %s", agent_id)


# ─── Proto definition reference ─────────────────────────────────

PROTO_DEFINITION = """
// mcp.proto — Model Context Protocol service definition
// Generate with: python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. mcp.proto

syntax = "proto3";
package memoraforge.mcp;

service MCPService {
    rpc CreateStream (CreateStreamRequest) returns (CreateStreamResponse);
    rpc PushContext (PushContextRequest) returns (PushContextResponse);
    rpc Subscribe (SubscribeRequest) returns (stream ContextUpdate);
    rpc Retrieve (RetrieveRequest) returns (RetrieveResponse);
    rpc StreamStats (StreamStatsRequest) returns (StreamStatsResponse);
}

message CreateStreamRequest {
    string name = 1;
    string owner_agent_id = 2;
    int64 max_tokens = 3;
}

message CreateStreamResponse {
    string stream_id = 1;
    string name = 2;
    int32 version = 3;
}

message PushContextRequest {
    string stream_id = 1;
    string content = 2;
    string priority = 3;
    string chunk_type = 4;
    bool compress = 5;
    map<string, string> metadata = 6;
}

message PushContextResponse {
    string chunk_id = 1;
    int32 version = 2;
    int64 tokens_used = 3;
    int64 tokens_remaining = 4;
    bool compressed = 5;
    double compression_ratio = 6;
}

message SubscribeRequest {
    string stream_id = 1;
    string agent_id = 2;
    int32 from_version = 3;
}

message ContextUpdate {
    string stream_id = 1;
    int32 version = 2;
    int64 total_tokens = 3;
    repeated ChunkData chunks = 4;
    double timestamp = 5;
}

message ChunkData {
    string chunk_id = 1;
    string content = 2;
    int32 token_count = 3;
    string priority = 4;
    string chunk_type = 5;
}

message RetrieveRequest {
    string stream_id = 1;
    int32 max_tokens = 2;
    repeated string priority_filter = 3;
}

message RetrieveResponse {
    string stream_id = 1;
    int32 version = 2;
    repeated ChunkData chunks = 3;
    int64 total_tokens = 4;
    bool truncated = 5;
}

message StreamStatsRequest {
    string stream_id = 1;
}

message StreamStatsResponse {
    string stream_id = 1;
    string name = 2;
    int32 total_chunks = 3;
    int64 total_tokens = 4;
    int64 max_tokens = 5;
    double utilization = 6;
    int32 current_version = 7;
    int32 subscribers = 8;
}
"""

# Write proto file for reference
def write_proto_file(output_path: str = "mcp.proto"):
    """Write the proto definition to a file for code generation."""
    with open(output_path, "w") as f:
        f.write(PROTO_DEFINITION)
    logger.info("Wrote proto definition to %s", output_path)
