"""Eviction engine — LRU + relevance scoring for memory lifecycle management."""

from __future__ import annotations

import logging
import time
from typing import Any

from ..models.memory import Memory, EvictionCandidate

logger = logging.getLogger(__name__)

# Tunable weights for eviction scoring
WEIGHT_RECENCY = 0.4      # How recently accessed
WEIGHT_RELEVANCE = 0.3    # Relevance decay score
WEIGHT_ACCESS = 0.2       # Total access count
WEIGHT_TYPE = 0.1         # Memory type importance

# Memory type importance multipliers
TYPE_WEIGHTS = {
    "fact": 2.0,           # Facts are high value
    "code": 1.5,           # Code has lasting value
    "document": 1.2,       # Documents are reference material
    "conversation": 0.8,   # Conversations decay faster
    "summary": 1.8,        # Summaries are pre-compressed knowledge
    "shadow": 3.0,         # Shadow memory is critical, rarely evict
}

RELEVANCE_DECAY_RATE = 0.95  # Daily decay multiplier
EVICTION_THRESHOLD = 0.1     # Below this score → eligible for eviction


class EvictionEngine:
    """Manages memory lifecycle with combined LRU + relevance scoring.

    Memories decay in relevance over time, weighted by access patterns
    and type importance. Below the threshold, they become eviction candidates.
    """

    def __init__(
        self,
        max_total_tokens: int = 10_000_000,
        eviction_threshold: float = EVICTION_THRESHOLD,
        decay_rate: float = RELEVANCE_DECAY_RATE,
    ):
        self.max_total_tokens = max_total_tokens
        self.eviction_threshold = eviction_threshold
        self.decay_rate = decay_rate

    def score_memory(self, memory: Memory) -> EvictionCandidate:
        """Score a memory for eviction eligibility.

        Lower score = more likely to be evicted.
        """
        now = time.time()
        age_hours = (now - memory.created_at) / 3600
        hours_since_access = (now - memory.last_accessed) / 3600

        # Recency score: exponential decay based on last access
        recency_score = self.decay_rate ** (hours_since_access / 24)

        # Relevance decay: original relevance × time decay
        days_old = age_hours / 24
        relevance_score = memory.relevance_score * (self.decay_rate ** days_old)

        # Access frequency normalization (log scale)
        import math
        access_score = math.log2(memory.access_count + 1) / 10  # Normalize to ~0-1

        # Type importance
        type_weight = TYPE_WEIGHTS.get(memory.memory_type.value, 1.0)
        type_score = type_weight / 3.0  # Normalize

        # Combined score
        combined = (
            WEIGHT_RECENCY * recency_score
            + WEIGHT_RELEVANCE * relevance_score
            + WEIGHT_ACCESS * access_score
            + WEIGHT_TYPE * type_score
        )

        return EvictionCandidate(
            memory_id=memory.memory_id,
            combined_score=combined,
            lru_score=recency_score,
            relevance_score=relevance_score,
            access_count=memory.access_count,
            age_hours=age_hours,
        )

    def find_eviction_candidates(
        self,
        memories: list[Memory],
        needed_tokens: int = 0,
    ) -> list[EvictionCandidate]:
        """Find memories eligible for eviction, sorted by score (lowest first).

        If needed_tokens > 0, returns enough candidates to free that many tokens.
        """
        candidates = []
        for memory in memories:
            candidate = self.score_memory(memory)
            if candidate.combined_score < self.eviction_threshold:
                candidates.append(candidate)

        # Sort by score ascending (lowest = evict first)
        candidates.sort(key=lambda c: c.combined_score)

        if needed_tokens > 0:
            # Return just enough to free needed tokens
            token_map = {m.memory_id: m.token_count for m in memories}
            freed = 0
            selected = []
            for candidate in candidates:
                if freed >= needed_tokens:
                    break
                freed += token_map.get(candidate.memory_id, 0)
                selected.append(candidate)
            return selected

        return candidates

    def should_evict(self, memory: Memory) -> bool:
        """Quick check: should this specific memory be evicted?"""
        candidate = self.score_memory(memory)
        return candidate.combined_score < self.eviction_threshold

    def check_ttl(self, memory: Memory) -> bool:
        """Check if a memory has exceeded its TTL."""
        if memory.ttl_hours is None:
            return False  # Permanent memory
        age_hours = (time.time() - memory.created_at) / 3600
        return age_hours > memory.ttl_hours

    def update_access(self, memory: Memory):
        """Update access tracking when a memory is retrieved."""
        memory.last_accessed = time.time()
        memory.access_count += 1
