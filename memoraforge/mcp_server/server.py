"""MCP Server — WebSocket + gRPC transport for context streaming.

This is the core server that manages context streams, handles subscriptions,
and coordinates context injection for agents seeing 5M+ effective tokens.
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
import uuid
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .compression import (
    compress_context,
    decompress_context,
    semantic_chunk,
    estimate_tokens,
)
from .models import (
    ContextChunk,
    ContextStream,
    ContextVersion,
    ChunkType,
    Priority,
    StreamSubscription,
)

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(title="MemoraForge MCP Server", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory stores (swap for Redis in production)
_streams: dict[str, ContextStream] = {}
_subscriptions: dict[str, StreamSubscription] = {}
_agent_connections: dict[str, WebSocket] = {}

SNAPSHOT_INTERVAL = 100  # Create snapshot every N versions
MAX_CONTEXT_PER_LLM_CALL = 128_000  # Tokens injected per LLM call


# ---------------------------------------------------------------------------
# Pydantic request/response models
# ---------------------------------------------------------------------------


class CreateStreamRequest(BaseModel):
    name: str
    owner_agent_id: str
    max_tokens: int = 5_000_000


class CreateStreamResponse(BaseModel):
    stream_id: str
    name: str
    version: int


class PushContextRequest(BaseModel):
    stream_id: str
    content: str
    priority: str = "medium"
    chunk_type: str = "text"
    metadata: dict[str, Any] = {}
    compress: bool = True


class PushContextResponse(BaseModel):
    chunk_id: str
    version: int
    tokens_used: int
    tokens_remaining: int
    compressed: bool
    compression_ratio: float


class RetrieveContextRequest(BaseModel):
    stream_id: str
    max_tokens: int = 128_000
    priority_filter: list[str] | None = None
    from_version: int | None = None


class RetrieveContextResponse(BaseModel):
    stream_id: str
    version: int
    chunks: list[dict[str, Any]]
    total_tokens: int
    truncated: bool


# ---------------------------------------------------------------------------
# REST Endpoints
# ---------------------------------------------------------------------------


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "streams": len(_streams),
        "connections": len(_agent_connections),
        "uptime": time.time(),
    }


@app.post("/streams", response_model=CreateStreamResponse)
async def create_stream(req: CreateStreamRequest):
    """Create a new context stream."""
    stream = ContextStream(
        name=req.name,
        owner_agent_id=req.owner_agent_id,
        max_tokens=req.max_tokens,
    )
    _streams[stream.stream_id] = stream
    logger.info("Created stream %s (%s) for agent %s", stream.stream_id, req.name, req.owner_agent_id)
    return CreateStreamResponse(
        stream_id=stream.stream_id,
        name=stream.name,
        version=stream.current_version,
    )


@app.post("/streams/push", response_model=PushContextResponse)
async def push_context(req: PushContextRequest):
    """Push context into a stream. Auto-chunks and compresses."""
    stream = _streams.get(req.stream_id)
    if not stream:
        raise HTTPException(404, f"Stream {req.stream_id} not found")

    priority = Priority(req.priority)
    chunk_type = ChunkType(req.chunk_type)

    # Semantic chunking
    sem_chunks = semantic_chunk(req.content)
    total_new_tokens = sum(c.token_estimate for c in sem_chunks)

    if not stream.has_capacity(total_new_tokens):
        # Evict low-priority chunks to make room
        _evict_chunks(stream, total_new_tokens)

    compression_ratio = 1.0
    first_chunk_id = ""

    for sc in sem_chunks:
        content = sc.text
        compressed = False
        ratio = 1.0

        if req.compress:
            compressed_bytes, ratio = compress_context(content)
            compressed = True
            compression_ratio = ratio

        chunk = ContextChunk(
            content=content,
            token_count=sc.token_estimate,
            chunk_type=chunk_type,
            priority=priority,
            metadata={**req.metadata, "hash": sc.chunk_hash},
            compressed=compressed,
            compression_ratio=ratio if compressed else 1.0,
        )

        stream.chunks[chunk.chunk_id] = chunk
        if not first_chunk_id:
            first_chunk_id = chunk.chunk_id

    # Increment version
    stream.current_version += 1
    is_snapshot = (stream.current_version % SNAPSHOT_INTERVAL) == 0

    version = ContextVersion(
        version=stream.current_version,
        stream_id=stream.stream_id,
        chunk_ids=[first_chunk_id],
        total_tokens=stream.total_tokens,
        parent_version=stream.current_version - 1 if stream.current_version > 1 else None,
        snapshot=is_snapshot,
    )
    stream.versions.append(version)

    # Notify subscribers
    await _notify_subscribers(stream, version)

    return PushContextResponse(
        chunk_id=first_chunk_id,
        version=stream.current_version,
        tokens_used=stream.total_tokens,
        tokens_remaining=stream.max_tokens - stream.total_tokens,
        compressed=req.compress,
        compression_ratio=compression_ratio,
    )


@app.post("/streams/retrieve", response_model=RetrieveContextResponse)
async def retrieve_context(req: RetrieveContextRequest):
    """Retrieve context from a stream, respecting token budget.

    Chunks are returned in priority order (critical first), then by recency.
    If total exceeds max_tokens, lower-priority chunks are truncated.
    """
    stream = _streams.get(req.stream_id)
    if not stream:
        raise HTTPException(404, f"Stream {req.stream_id} not found")

    # Filter and sort chunks
    chunks = list(stream.chunks.values())

    if req.priority_filter:
        allowed = {Priority(p) for p in req.priority_filter}
        chunks = [c for c in chunks if c.priority in allowed]

    if req.from_version is not None:
        version_chunk_ids = set()
        for v in stream.versions:
            if v.version >= req.from_version:
                version_chunk_ids.update(v.chunk_ids)
        chunks = [c for c in chunks if c.chunk_id in version_chunk_ids]

    # Sort: critical → high → medium → low, then newest first
    priority_order = {Priority.CRITICAL: 0, Priority.HIGH: 1, Priority.MEDIUM: 2, Priority.LOW: 3}
    chunks.sort(key=lambda c: (priority_order.get(c.priority, 9), -c.created_at))

    # Truncate to token budget
    selected: list[dict[str, Any]] = []
    token_budget = req.max_tokens
    truncated = False

    for chunk in chunks:
        effective = chunk.effective_tokens()
        if token_budget - effective < 0:
            truncated = True
            break
        token_budget -= effective
        selected.append({
            "chunk_id": chunk.chunk_id,
            "content": chunk.content,
            "token_count": chunk.token_count,
            "priority": chunk.priority.value,
            "chunk_type": chunk.chunk_type.value,
            "metadata": chunk.metadata,
        })

    return RetrieveContextResponse(
        stream_id=stream.stream_id,
        version=stream.current_version,
        chunks=selected,
        total_tokens=sum(c["token_count"] for c in selected),
        truncated=truncated,
    )


@app.get("/streams/{stream_id}/stats")
async def stream_stats(stream_id: str):
    """Get statistics for a context stream."""
    stream = _streams.get(stream_id)
    if not stream:
        raise HTTPException(404, f"Stream {stream_id} not found")

    priority_breakdown = {}
    for chunk in stream.chunks.values():
        p = chunk.priority.value
        priority_breakdown[p] = priority_breakdown.get(p, 0) + chunk.effective_tokens()

    return {
        "stream_id": stream.stream_id,
        "name": stream.name,
        "total_chunks": len(stream.chunks),
        "total_tokens": stream.total_tokens,
        "max_tokens": stream.max_tokens,
        "utilization": stream.total_tokens / stream.max_tokens,
        "current_version": stream.current_version,
        "subscribers": len(stream.subscribers),
        "priority_breakdown": priority_breakdown,
    }


# ---------------------------------------------------------------------------
# WebSocket — Agent Connections & Live Streaming
# ---------------------------------------------------------------------------


@app.websocket("/ws/{agent_id}")
async def agent_websocket(websocket: WebSocket, agent_id: str):
    """WebSocket endpoint for agents to subscribe to context streams."""
    await websocket.accept()
    _agent_connections[agent_id] = websocket
    logger.info("Agent %s connected via WebSocket", agent_id)

    try:
        while True:
            raw = await websocket.receive_text()
            message = json.loads(raw)
            response = await _handle_ws_message(agent_id, message)
            await websocket.send_json(response)
    except WebSocketDisconnect:
        logger.info("Agent %s disconnected", agent_id)
    finally:
        _agent_connections.pop(agent_id, None)
        # Clean up subscriptions
        for sub_id, sub in list(_subscriptions.items()):
            if sub.agent_id == agent_id:
                sub.active = False


async def _handle_ws_message(agent_id: str, message: dict) -> dict:
    """Route WebSocket messages to handlers."""
    action = message.get("action", "")

    if action == "subscribe":
        return await _ws_subscribe(agent_id, message)
    elif action == "unsubscribe":
        return await _ws_unsubscribe(agent_id, message)
    elif action == "push":
        return await _ws_push(agent_id, message)
    elif action == "retrieve":
        return await _ws_retrieve(agent_id, message)
    elif action == "ping":
        return {"action": "pong", "timestamp": time.time()}
    else:
        return {"error": f"Unknown action: {action}"}


async def _ws_subscribe(agent_id: str, message: dict) -> dict:
    stream_id = message.get("stream_id", "")
    stream = _streams.get(stream_id)
    if not stream:
        return {"error": f"Stream {stream_id} not found"}

    sub = StreamSubscription(
        agent_id=agent_id,
        stream_id=stream_id,
        from_version=message.get("from_version", stream.current_version),
        filters=message.get("filters", {}),
    )
    _subscriptions[sub.subscription_id] = sub
    stream.subscribers.add(agent_id)

    return {
        "action": "subscribed",
        "subscription_id": sub.subscription_id,
        "stream_id": stream_id,
        "current_version": stream.current_version,
    }


async def _ws_unsubscribe(agent_id: str, message: dict) -> dict:
    sub_id = message.get("subscription_id", "")
    sub = _subscriptions.pop(sub_id, None)
    if sub:
        stream = _streams.get(sub.stream_id)
        if stream:
            stream.subscribers.discard(agent_id)
    return {"action": "unsubscribed", "subscription_id": sub_id}


async def _ws_push(agent_id: str, message: dict) -> dict:
    stream_id = message.get("stream_id", "")
    content = message.get("content", "")
    priority = message.get("priority", "medium")

    req = PushContextRequest(
        stream_id=stream_id,
        content=content,
        priority=priority,
        metadata=message.get("metadata", {}),
    )
    # Reuse REST handler
    try:
        result = await push_context(req)
        return {"action": "pushed", **result.model_dump()}
    except HTTPException as e:
        return {"error": e.detail}


async def _ws_retrieve(agent_id: str, message: dict) -> dict:
    req = RetrieveContextRequest(
        stream_id=message.get("stream_id", ""),
        max_tokens=message.get("max_tokens", MAX_CONTEXT_PER_LLM_CALL),
        priority_filter=message.get("priority_filter"),
    )
    try:
        result = await retrieve_context(req)
        return {"action": "context", **result.model_dump()}
    except HTTPException as e:
        return {"error": e.detail}


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _evict_chunks(stream: ContextStream, needed_tokens: int) -> int:
    """Evict lowest-priority, oldest chunks to free space.

    Uses combined LRU + priority scoring for eviction decisions.
    """
    evicted = 0
    now = time.time()

    # Score chunks: lower score = evict first
    scored = []
    for cid, chunk in stream.chunks.items():
        priority_score = {
            Priority.CRITICAL: 1000,
            Priority.HIGH: 100,
            Priority.MEDIUM: 10,
            Priority.LOW: 1,
        }.get(chunk.priority, 1)

        age_hours = (now - chunk.created_at) / 3600
        decay = 0.95 ** age_hours  # Exponential decay
        score = priority_score * decay
        scored.append((score, cid, chunk))

    scored.sort(key=lambda x: x[0])  # Lowest score first

    for score, cid, chunk in scored:
        if chunk.priority == Priority.CRITICAL:
            continue  # Never evict critical context
        if evicted >= needed_tokens:
            break
        evicted += chunk.effective_tokens()
        del stream.chunks[cid]
        logger.debug("Evicted chunk %s (score=%.2f, tokens=%d)", cid, score, chunk.token_count)

    return evicted


async def _notify_subscribers(stream: ContextStream, version: ContextVersion):
    """Push version update to all subscribed agents via WebSocket."""
    notification = {
        "action": "version_update",
        "stream_id": stream.stream_id,
        "version": version.version,
        "total_tokens": version.total_tokens,
        "timestamp": version.timestamp,
    }

    for agent_id in stream.subscribers:
        ws = _agent_connections.get(agent_id)
        if ws:
            try:
                await ws.send_json(notification)
            except Exception:
                logger.warning("Failed to notify agent %s", agent_id)


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8100, log_level="info")
