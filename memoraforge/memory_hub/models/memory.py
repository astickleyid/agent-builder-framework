"""Memory Hub data models — memories, chunks, graph entities."""

from __future__ import annotations

import time
import uuid
from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class MemoryType(str, Enum):
    CONVERSATION = "conversation"
    FACT = "fact"
    CODE = "code"
    DOCUMENT = "document"
    SUMMARY = "summary"
    SHADOW = "shadow"  # Agent's persistent shadow memory


class RetrievalSource(str, Enum):
    VECTOR_STORE = "vector_store"
    KNOWLEDGE_GRAPH = "knowledge_graph"
    FULL_TEXT = "full_text"
    CACHE = "cache"


@dataclass
class MemoryChunk:
    """A single chunk of memory stored in the hub."""

    chunk_id: str = field(default_factory=lambda: uuid.uuid4().hex[:16])
    memory_id: str = ""
    content: str = ""
    embedding: list[float] = field(default_factory=list)  # 384-dim
    token_count: int = 0
    chunk_index: int = 0  # Position within parent memory
    level: int = 0  # Hierarchy: 0=chunk, 1=section, 2=document
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class Memory:
    """A complete memory entry with hierarchical chunks."""

    memory_id: str = field(default_factory=lambda: uuid.uuid4().hex[:12])
    agent_id: str = ""
    memory_type: MemoryType = MemoryType.CONVERSATION
    title: str = ""
    content: str = ""
    chunks: list[MemoryChunk] = field(default_factory=list)
    token_count: int = 0
    metadata: dict[str, Any] = field(default_factory=dict)
    created_at: float = field(default_factory=time.time)
    last_accessed: float = field(default_factory=time.time)
    access_count: int = 0
    relevance_score: float = 1.0  # Decays over time
    ttl_hours: int | None = None  # None = permanent
    summary: str = ""  # Auto-generated summary


@dataclass
class GraphEntity:
    """An entity in the knowledge graph."""

    entity_id: str = field(default_factory=lambda: uuid.uuid4().hex[:12])
    name: str = ""
    entity_type: str = ""  # person, concept, tool, code_module, etc.
    properties: dict[str, Any] = field(default_factory=dict)
    memory_ids: list[str] = field(default_factory=list)  # Linked memories


@dataclass
class GraphRelation:
    """A relation (edge) in the knowledge graph."""

    source_id: str = ""
    target_id: str = ""
    relation_type: str = ""  # e.g., "uses", "depends_on", "authored_by"
    weight: float = 1.0
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class RetrievalResult:
    """A single result from memory retrieval."""

    memory_id: str = ""
    chunk_id: str = ""
    content: str = ""
    relevance_score: float = 0.0
    source: RetrievalSource = RetrievalSource.VECTOR_STORE
    token_count: int = 0
    metadata: dict[str, Any] = field(default_factory=dict)
    graph_context: dict[str, Any] | None = None


@dataclass
class EvictionCandidate:
    """A memory scored for potential eviction."""

    memory_id: str = ""
    combined_score: float = 0.0  # Lower = more likely to evict
    lru_score: float = 0.0
    relevance_score: float = 0.0
    access_count: int = 0
    age_hours: float = 0.0
