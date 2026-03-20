"""Tests for Memory Hub eviction engine."""

import time
import pytest
from memoraforge.memory_hub.models.memory import Memory, MemoryType
from memoraforge.memory_hub.services.eviction import EvictionEngine


class TestEvictionScoring:
    def setup_method(self):
        self.engine = EvictionEngine()

    def test_fresh_memory_scores_high(self):
        memory = Memory(
            memory_type=MemoryType.FACT,
            relevance_score=1.0,
            access_count=5,
        )
        candidate = self.engine.score_memory(memory)
        assert candidate.combined_score > 0.3

    def test_old_unused_memory_scores_low(self):
        memory = Memory(
            memory_type=MemoryType.CONVERSATION,
            relevance_score=0.1,
            access_count=0,
            created_at=time.time() - 86400 * 30,  # 30 days old
            last_accessed=time.time() - 86400 * 30,
        )
        candidate = self.engine.score_memory(memory)
        assert candidate.combined_score < 0.2

    def test_shadow_memory_protected(self):
        shadow = Memory(
            memory_type=MemoryType.SHADOW,
            relevance_score=0.5,
            access_count=1,
            created_at=time.time() - 86400 * 7,
            last_accessed=time.time() - 86400 * 7,
        )
        candidate = self.engine.score_memory(shadow)
        # Shadow memories get TYPE_WEIGHTS boost of 3.0
        assert candidate.combined_score > 0.1

    def test_find_eviction_candidates(self):
        memories = [
            Memory(memory_id="keep", memory_type=MemoryType.FACT, relevance_score=1.0, access_count=10),
            Memory(
                memory_id="evict", memory_type=MemoryType.CONVERSATION,
                relevance_score=0.01, access_count=0,
                created_at=time.time() - 86400 * 60,
                last_accessed=time.time() - 86400 * 60,
            ),
        ]
        candidates = self.engine.find_eviction_candidates(memories)
        evict_ids = [c.memory_id for c in candidates]
        assert "evict" in evict_ids
        assert "keep" not in evict_ids

    def test_ttl_expiry(self):
        expired = Memory(
            ttl_hours=1,
            created_at=time.time() - 7200,  # 2 hours ago
        )
        not_expired = Memory(
            ttl_hours=24,
            created_at=time.time() - 3600,  # 1 hour ago
        )
        assert self.engine.check_ttl(expired) is True
        assert self.engine.check_ttl(not_expired) is False

    def test_permanent_memory_never_ttl(self):
        permanent = Memory(ttl_hours=None)
        assert self.engine.check_ttl(permanent) is False
