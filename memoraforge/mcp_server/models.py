"""MCP Server data models — context streams, versions, and chunks."""

from __future__ import annotations

import time
import uuid
from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class Priority(str, Enum):
    CRITICAL = "critical"  # System prompts, safety instructions
    HIGH = "high"          # Recent conversation, active task context
    MEDIUM = "medium"      # Retrieved memories, background knowledge
    LOW = "low"            # Historical context, stale data


class ChunkType(str, Enum):
    TEXT = "text"
    CODE = "code"
    EMBEDDING = "embedding"
    STRUCTURED = "structured"  # JSON/tables


@dataclass
class ContextChunk:
    """A single chunk of context within a stream."""

    chunk_id: str = field(default_factory=lambda: uuid.uuid4().hex[:16])
    content: str = ""
    token_count: int = 0
    chunk_type: ChunkType = ChunkType.TEXT
    priority: Priority = Priority.MEDIUM
    metadata: dict[str, Any] = field(default_factory=dict)
    created_at: float = field(default_factory=time.time)
    compressed: bool = False
    compression_ratio: float = 1.0

    def effective_tokens(self) -> int:
        """Tokens after compression."""
        return int(self.token_count * self.compression_ratio)


@dataclass
class ContextVersion:
    """Immutable snapshot of a context stream at a point in time."""

    version: int
    stream_id: str
    chunk_ids: list[str]
    total_tokens: int
    timestamp: float = field(default_factory=time.time)
    parent_version: int | None = None
    snapshot: bool = False  # True if this is a full snapshot


@dataclass
class ContextStream:
    """A named, subscribable stream of context chunks."""

    stream_id: str = field(default_factory=lambda: uuid.uuid4().hex[:12])
    name: str = ""
    owner_agent_id: str = ""
    chunks: dict[str, ContextChunk] = field(default_factory=dict)
    current_version: int = 0
    versions: list[ContextVersion] = field(default_factory=list)
    max_tokens: int = 5_000_000  # 5M effective token limit
    subscribers: set[str] = field(default_factory=set)
    created_at: float = field(default_factory=time.time)

    @property
    def total_tokens(self) -> int:
        return sum(c.effective_tokens() for c in self.chunks.values())

    def has_capacity(self, additional_tokens: int) -> bool:
        return (self.total_tokens + additional_tokens) <= self.max_tokens


@dataclass
class StreamSubscription:
    """An agent's subscription to a context stream."""

    subscription_id: str = field(default_factory=lambda: uuid.uuid4().hex[:12])
    agent_id: str = ""
    stream_id: str = ""
    from_version: int = 0  # Receive updates from this version onward
    filters: dict[str, Any] = field(default_factory=dict)  # Priority filters etc.
    active: bool = True
