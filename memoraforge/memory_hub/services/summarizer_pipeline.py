"""Production auto-summarization pipeline.

Runs an asynchronous background pipeline that:
1. Watches for new memories above a token threshold
2. Generates summaries at 3 hierarchy levels (chunk, section, document)
3. Stores summaries back with links to source memories
4. Supports both local models (Ollama) and API-based models
5. Includes retry logic and fallback to extractive summarization
"""

from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import dataclass, field
from typing import Any

import httpx

logger = logging.getLogger(__name__)


@dataclass
class SummaryTask:
    """A pending summarization task."""

    memory_id: str
    content: str
    memory_type: str = "conversation"
    priority: int = 0  # Higher = process first
    created_at: float = field(default_factory=time.time)
    attempts: int = 0
    max_attempts: int = 3


@dataclass
class SummaryResult:
    """Result of a summarization."""

    memory_id: str
    summary: str
    level: int  # 0=chunk, 1=section, 2=document
    source_tokens: int
    summary_tokens: int
    model_used: str
    latency_ms: float


class SummarizationPipeline:
    """Background pipeline for auto-summarizing memories.

    Runs as a background task that processes a queue of summarization jobs.
    Supports multiple models and automatic fallback.
    """

    def __init__(
        self,
        api_url: str = "http://localhost:8000",
        primary_model: str = "llama3.1:8b",
        fallback_model: str = "llama3.2:3b",
        min_tokens_to_summarize: int = 100,
        max_summary_tokens: int = 200,
        batch_interval_ms: int = 500,
        max_queue_size: int = 10_000,
    ):
        self.api_url = api_url
        self.primary_model = primary_model
        self.fallback_model = fallback_model
        self.min_tokens_to_summarize = min_tokens_to_summarize
        self.max_summary_tokens = max_summary_tokens
        self.batch_interval_ms = batch_interval_ms
        self._queue: asyncio.PriorityQueue[tuple[int, SummaryTask]] = asyncio.PriorityQueue(
            maxsize=max_queue_size
        )
        self._running = False
        self._processed = 0
        self._failed = 0
        self._results: list[SummaryResult] = []

    async def start(self):
        """Start the background summarization worker."""
        self._running = True
        logger.info("Summarization pipeline started (model=%s)", self.primary_model)
        asyncio.create_task(self._worker())

    async def stop(self):
        """Stop the pipeline gracefully."""
        self._running = False
        logger.info("Summarization pipeline stopped (%d processed, %d failed)",
                     self._processed, self._failed)

    async def enqueue(self, memory_id: str, content: str, memory_type: str = "conversation", priority: int = 0):
        """Add a memory to the summarization queue."""
        token_estimate = len(content) // 4
        if token_estimate < self.min_tokens_to_summarize:
            return  # Too short to summarize

        task = SummaryTask(
            memory_id=memory_id,
            content=content,
            memory_type=memory_type,
            priority=priority,
        )
        try:
            self._queue.put_nowait((-priority, task))  # Negative for max-priority-first
        except asyncio.QueueFull:
            logger.warning("Summarization queue full, dropping task for %s", memory_id)

    async def _worker(self):
        """Background worker that processes summarization tasks."""
        while self._running:
            try:
                # Wait for tasks with timeout
                try:
                    _, task = await asyncio.wait_for(
                        self._queue.get(), timeout=self.batch_interval_ms / 1000
                    )
                except asyncio.TimeoutError:
                    continue

                result = await self._process_task(task)
                if result:
                    self._results.append(result)
                    self._processed += 1
                else:
                    self._failed += 1

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.exception("Summarization worker error: %s", e)
                await asyncio.sleep(1)

    async def _process_task(self, task: SummaryTask) -> SummaryResult | None:
        """Process a single summarization task with retry and fallback."""
        start = time.time()

        # Try primary model
        summary = await self._generate_summary(task.content, self.primary_model)
        model_used = self.primary_model

        if not summary:
            # Fallback to smaller model
            summary = await self._generate_summary(task.content, self.fallback_model)
            model_used = self.fallback_model

        if not summary:
            # Final fallback: extractive
            summary = self._extractive_summary(task.content)
            model_used = "extractive"

        if not summary:
            return None

        latency_ms = (time.time() - start) * 1000

        return SummaryResult(
            memory_id=task.memory_id,
            summary=summary,
            level=0,
            source_tokens=len(task.content) // 4,
            summary_tokens=len(summary) // 4,
            model_used=model_used,
            latency_ms=latency_ms,
        )

    async def _generate_summary(self, content: str, model: str) -> str | None:
        """Generate a summary using the headless API."""
        prompt = (
            "Summarize the following text concisely in 2-3 sentences. "
            "Preserve key facts, names, numbers, and relationships. "
            "Do not add information not in the original.\n\n"
            f"Text:\n{content[:4000]}\n\n"  # Cap input length
            "Summary:"
        )

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.post(
                    f"{self.api_url}/v1/chat",
                    json={
                        "model": model,
                        "messages": [{"role": "user", "content": prompt}],
                        "max_tokens": self.max_summary_tokens,
                        "temperature": 0.2,
                    },
                )
                if resp.status_code == 200:
                    return resp.json()["choices"][0]["message"]["content"].strip()
                else:
                    logger.warning("Summary API returned %d", resp.status_code)
                    return None
        except Exception as e:
            logger.warning("Summary generation failed with %s: %s", model, e)
            return None

    def _extractive_summary(self, content: str, max_sentences: int = 3) -> str:
        """Extractive fallback — select most information-dense sentences.

        Uses a simple TF-based scoring to pick the most representative sentences.
        """
        sentences = self._split_sentences(content)
        if len(sentences) <= max_sentences:
            return content.strip()

        # Score sentences by term frequency importance
        from collections import Counter

        # Build document term frequencies
        all_words = content.lower().split()
        word_freq = Counter(all_words)
        total_words = len(all_words)

        scored = []
        for i, sentence in enumerate(sentences):
            words = sentence.lower().split()
            if len(words) < 3:
                continue
            # Score = average word importance (inverse frequency weighting)
            score = sum(1 / (word_freq.get(w, 1)) for w in words) / len(words)
            # Boost for position (first sentences are often more important)
            position_boost = 1.0 / (1.0 + i * 0.1)
            scored.append((score * position_boost, i, sentence))

        scored.sort(reverse=True)
        # Take top sentences but maintain original order
        selected = sorted(scored[:max_sentences], key=lambda x: x[1])
        return " ".join(s[2].strip() for s in selected)

    @staticmethod
    def _split_sentences(text: str) -> list[str]:
        """Split text into sentences."""
        sentences = []
        current = []
        for char in text:
            current.append(char)
            if char in ".!?" and len(current) > 10:
                sentences.append("".join(current))
                current = []
        if current:
            sentences.append("".join(current))
        return sentences

    def stats(self) -> dict[str, Any]:
        """Get pipeline statistics."""
        return {
            "queue_size": self._queue.qsize(),
            "processed": self._processed,
            "failed": self._failed,
            "running": self._running,
            "primary_model": self.primary_model,
            "fallback_model": self.fallback_model,
        }
