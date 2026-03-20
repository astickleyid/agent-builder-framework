"""Auto-summarization service — uses smaller models for memory compression."""

from __future__ import annotations

import logging
import time
from typing import Any

logger = logging.getLogger(__name__)


class SummarizerService:
    """Auto-summarize memories using smaller, faster models.

    Runs Phi-3 or Mistral-7B via the headless API to generate summaries
    at multiple hierarchy levels (chunk → section → document).
    """

    def __init__(
        self,
        api_url: str = "http://api-server:8000",
        model: str = "mistral:7b",
        max_summary_tokens: int = 256,
    ):
        self.api_url = api_url
        self.model = model
        self.max_summary_tokens = max_summary_tokens

    async def summarize(self, content: str, context: str = "") -> str:
        """Generate a concise summary of the given content."""
        if len(content) < 200:
            return content  # Too short to summarize

        prompt = self._build_prompt(content, context)

        try:
            return await self._call_llm(prompt)
        except Exception as e:
            logger.warning("Summarization failed: %s, using extractive fallback", e)
            return self._extractive_fallback(content)

    async def hierarchical_summarize(
        self,
        chunks: list[str],
        level: int = 0,
    ) -> list[dict[str, Any]]:
        """Generate hierarchical summaries.

        Level 0: Individual chunk summaries
        Level 1: Group summaries (every 5 chunks)
        Level 2: Document-level summary
        """
        results = []

        # Level 0: Summarize each chunk
        chunk_summaries = []
        for i, chunk in enumerate(chunks):
            summary = await self.summarize(chunk)
            chunk_summaries.append(summary)
            results.append({
                "level": 0,
                "index": i,
                "summary": summary,
                "source_tokens": len(chunk) // 4,
                "summary_tokens": len(summary) // 4,
            })

        if level >= 1 and len(chunk_summaries) > 3:
            # Level 1: Group summaries
            group_size = 5
            for i in range(0, len(chunk_summaries), group_size):
                group = chunk_summaries[i:i + group_size]
                combined = "\n\n".join(group)
                group_summary = await self.summarize(
                    combined,
                    context="Summarize these related sections into a cohesive overview."
                )
                results.append({
                    "level": 1,
                    "index": i // group_size,
                    "summary": group_summary,
                    "source_chunks": len(group),
                })

        if level >= 2 and len(chunk_summaries) > 1:
            # Level 2: Document summary
            all_summaries = "\n\n".join(chunk_summaries)
            doc_summary = await self.summarize(
                all_summaries,
                context="Create a comprehensive document-level summary."
            )
            results.append({
                "level": 2,
                "index": 0,
                "summary": doc_summary,
                "source_chunks": len(chunk_summaries),
            })

        return results

    async def _call_llm(self, prompt: str) -> str:
        """Call the headless API for summarization."""
        import httpx
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{self.api_url}/v1/chat",
                json={
                    "model": self.model,
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": self.max_summary_tokens,
                    "temperature": 0.3,
                },
            )
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"]

    def _build_prompt(self, content: str, context: str) -> str:
        """Build the summarization prompt."""
        base = (
            "Summarize the following content concisely. "
            "Preserve key facts, entities, and relationships. "
            "Keep the summary under 100 words.\n\n"
        )
        if context:
            base = f"{context}\n\n"
        return f"{base}Content:\n{content}\n\nSummary:"

    def _extractive_fallback(self, content: str, num_sentences: int = 3) -> str:
        """Extractive summarization fallback — pick first N sentences."""
        sentences = []
        current = []
        for char in content:
            current.append(char)
            if char in ".!?" and len(current) > 10:
                sentences.append("".join(current).strip())
                current = []
                if len(sentences) >= num_sentences:
                    break
        if current and len(sentences) < num_sentences:
            sentences.append("".join(current).strip())
        return " ".join(sentences)
