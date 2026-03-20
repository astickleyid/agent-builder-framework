"""PostgreSQL persistence layer — SQLAlchemy async models + connection pooling.

Provides the relational backbone for:
- Audit logs
- Memory metadata (Memory Hub)
- Agent registry (ACP)
- Rate limit state
- Session tracking
"""

from __future__ import annotations

import logging
import os
import time
import uuid
from datetime import datetime, timezone
from typing import Any, AsyncGenerator

from sqlalchemy import (
    Boolean, Column, DateTime, Float, ForeignKey, Index, Integer,
    String, Text, JSON, BigInteger, func, text,
)
from sqlalchemy.ext.asyncio import (
    AsyncSession, async_sessionmaker, create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase, relationship

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv(
    "POSTGRES_URL",
    "postgresql+asyncpg://memoraforge:memoraforge@localhost:5432/memoraforge",
)

# Ensure we use the async driver
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False,
)

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


# ─── Tables ─────────────────────────────────────────────────────


class AgentRecord(Base):
    """Registered agents."""

    __tablename__ = "agents"

    id = Column(String(64), primary_key=True, default=lambda: uuid.uuid4().hex[:16])
    agent_id = Column(String(128), unique=True, nullable=False, index=True)
    agent_name = Column(String(256), nullable=False)
    capabilities = Column(JSON, default=list)
    version = Column(String(32), default="0.1.0")
    max_context_tokens = Column(Integer, default=128_000)
    status = Column(String(32), default="active")
    metadata_ = Column("metadata", JSON, default=dict)
    api_key_hash = Column(String(128), nullable=True)
    registered_at = Column(DateTime(timezone=True), server_default=func.now())
    last_seen_at = Column(DateTime(timezone=True), server_default=func.now())

    memories = relationship("MemoryRecord", back_populates="agent", lazy="dynamic")
    audit_entries = relationship("AuditLog", back_populates="agent", lazy="dynamic")


class MemoryRecord(Base):
    """Memory metadata (content stored in Weaviate, metadata here)."""

    __tablename__ = "memories"

    id = Column(String(64), primary_key=True, default=lambda: uuid.uuid4().hex[:16])
    memory_id = Column(String(128), unique=True, nullable=False, index=True)
    agent_id = Column(String(128), ForeignKey("agents.agent_id"), nullable=False, index=True)
    memory_type = Column(String(32), nullable=False, default="conversation")
    title = Column(String(512), default="")
    token_count = Column(Integer, default=0)
    chunk_count = Column(Integer, default=0)
    summary = Column(Text, default="")
    metadata_ = Column("metadata", JSON, default=dict)
    relevance_score = Column(Float, default=1.0)
    access_count = Column(Integer, default=0)
    ttl_hours = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_accessed_at = Column(DateTime(timezone=True), server_default=func.now())
    is_deleted = Column(Boolean, default=False)

    agent = relationship("AgentRecord", back_populates="memories")

    __table_args__ = (
        Index("ix_memories_agent_type", "agent_id", "memory_type"),
        Index("ix_memories_relevance", "relevance_score"),
        Index("ix_memories_created", "created_at"),
    )


class AuditLog(Base):
    """Audit trail for all RPC calls and significant events."""

    __tablename__ = "audit_logs"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    agent_id = Column(String(128), ForeignKey("agents.agent_id"), nullable=True, index=True)
    method = Column(String(128), nullable=False)
    status = Column(String(32), nullable=False)  # success, error, rate_limited
    request_id = Column(String(64), nullable=True)
    ip_address = Column(String(45), nullable=True)
    latency_ms = Column(Float, nullable=True)
    error_message = Column(Text, nullable=True)
    metadata_ = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    agent = relationship("AgentRecord", back_populates="audit_entries")

    __table_args__ = (
        Index("ix_audit_created", "created_at"),
        Index("ix_audit_method", "method"),
    )


class ContextStreamRecord(Base):
    """MCP context stream metadata."""

    __tablename__ = "context_streams"

    id = Column(String(64), primary_key=True, default=lambda: uuid.uuid4().hex[:16])
    stream_id = Column(String(128), unique=True, nullable=False, index=True)
    name = Column(String(256), nullable=False)
    owner_agent_id = Column(String(128), nullable=False, index=True)
    current_version = Column(Integer, default=0)
    max_tokens = Column(BigInteger, default=5_000_000)
    total_tokens = Column(BigInteger, default=0)
    subscriber_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class RateLimitRecord(Base):
    """Persistent rate limit state."""

    __tablename__ = "rate_limits"

    id = Column(String(64), primary_key=True, default=lambda: uuid.uuid4().hex[:16])
    agent_id = Column(String(128), unique=True, nullable=False, index=True)
    capacity = Column(Float, default=100.0)
    refill_rate = Column(Float, default=10.0)
    tokens_remaining = Column(Float, default=100.0)
    last_refill_at = Column(DateTime(timezone=True), server_default=func.now())


# ─── Database lifecycle ─────────────────────────────────────────


async def init_db():
    """Create all tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created/verified")


async def drop_db():
    """Drop all tables. USE WITH EXTREME CAUTION."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    logger.info("Database tables dropped")


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Get an async database session (dependency injection)."""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def health_check() -> dict[str, Any]:
    """Check database connectivity."""
    try:
        async with async_session() as session:
            result = await session.execute(text("SELECT 1"))
            result.scalar()
        return {"status": "connected", "url": DATABASE_URL.split("@")[-1]}
    except Exception as e:
        return {"status": "error", "error": str(e)}
