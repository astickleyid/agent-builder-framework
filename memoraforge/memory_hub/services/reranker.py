"""Cross-encoder re-ranking service — accurate relevance scoring.

Replaces the simple keyword-overlap re-ranker with a cross-encoder model
that jointly encodes query-document pairs for more accurate scoring.

Falls back to BM25-boosted keyword scoring when the model is unavailable.
"""

from __future__ import annotations

import logging
import math
import time
from collections import Counter
from typing import Any

logger = logging.getLogger(__name__)


class RerankerService:
    """Cross-encoder re-ranking for retrieval results.

    Uses a lightweight cross-encoder model (e.g., ms-marco-MiniLM-L-6-v2)
    to score query-document pairs. This significantly improves retrieval
    accuracy compared to embedding-only similarity.

    Architecture:
    1. Initial retrieval returns top-100 from vector/graph/FTS
    2. Cross-encoder re-scores each (query, doc) pair
    3. Results re-sorted by cross-encoder score
    4. Top-K returned to the agent
    """

    def __init__(
        self,
        model_name: str = "cross-encoder/ms-marco-MiniLM-L-6-v2",
        api_url: str | None = None,
        batch_size: int = 32,
        score_threshold: float = 0.0,
    ):
        self.model_name = model_name
        self.api_url = api_url
        self.batch_size = batch_size
        self.score_threshold = score_threshold
        self._model = None

    async def initialize(self):
        """Load the cross-encoder model."""
        try:
            from sentence_transformers import CrossEncoder
            self._model = CrossEncoder(self.model_name, max_length=512)
            logger.info("Loaded cross-encoder: %s", self.model_name)
        except ImportError:
            logger.warning("sentence-transformers not installed — using BM25 fallback")
        except Exception as e:
            logger.warning("Cross-encoder unavailable (%s) — using BM25 fallback", e)

    async def rerank(
        self,
        query: str,
        results: list[dict[str, Any]],
        top_k: int | None = None,
    ) -> list[dict[str, Any]]:
        """Re-rank results using cross-encoder scoring.

        Args:
            query: The search query
            results: List of retrieval results with 'content' field
            top_k: Return only top K results (None = return all)

        Returns:
            Re-ranked results with updated relevance_score
        """
        if not results:
            return []

        start = time.time()

        if self._model:
            scored = await self._cross_encoder_rerank(query, results)
        else:
            scored = self._bm25_rerank(query, results)

        # Filter by threshold
        scored = [r for r in scored if r.get("relevance_score", 0) >= self.score_threshold]

        # Sort by score descending
        scored.sort(key=lambda r: r.get("relevance_score", 0), reverse=True)

        if top_k:
            scored = scored[:top_k]

        elapsed_ms = (time.time() - start) * 1000
        logger.debug(
            "Re-ranked %d → %d results in %.1fms (model=%s)",
            len(results), len(scored), elapsed_ms,
            "cross-encoder" if self._model else "bm25",
        )

        return scored

    async def _cross_encoder_rerank(
        self, query: str, results: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:
        """Re-rank using cross-encoder model."""
        # Build (query, document) pairs
        pairs = [(query, r.get("content", "")[:512]) for r in results]

        # Score in batches
        all_scores = []
        for i in range(0, len(pairs), self.batch_size):
            batch = pairs[i:i + self.batch_size]
            scores = self._model.predict(batch)
            all_scores.extend(scores.tolist() if hasattr(scores, "tolist") else list(scores))

        # Apply sigmoid to normalize scores to [0, 1]
        for i, score in enumerate(all_scores):
            normalized = 1 / (1 + math.exp(-score))  # sigmoid
            results[i]["relevance_score"] = round(normalized, 4)
            results[i]["rerank_raw_score"] = round(score, 4)

        return results

    def _bm25_rerank(
        self, query: str, results: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:
        """BM25-based re-ranking fallback.

        Implements Okapi BM25 scoring with the following parameters:
        - k1 = 1.5 (term frequency saturation)
        - b = 0.75 (document length normalization)
        """
        k1 = 1.5
        b = 0.75

        query_terms = self._tokenize(query)
        if not query_terms:
            return results

        # Calculate average document length
        doc_lengths = [len(self._tokenize(r.get("content", ""))) for r in results]
        avg_dl = sum(doc_lengths) / len(doc_lengths) if doc_lengths else 1

        # Document frequency for IDF
        df: Counter[str] = Counter()
        doc_term_freqs = []
        for r in results:
            terms = self._tokenize(r.get("content", ""))
            tf = Counter(terms)
            doc_term_freqs.append(tf)
            for term in set(terms):
                df[term] += 1

        n = len(results)

        for i, r in enumerate(results):
            dl = doc_lengths[i]
            tf = doc_term_freqs[i]
            score = 0.0

            for term in query_terms:
                if term not in tf:
                    continue

                # IDF component
                doc_freq = df.get(term, 0)
                idf = math.log((n - doc_freq + 0.5) / (doc_freq + 0.5) + 1)

                # TF component with length normalization
                term_freq = tf[term]
                tf_norm = (term_freq * (k1 + 1)) / (term_freq + k1 * (1 - b + b * dl / avg_dl))

                score += idf * tf_norm

            # Blend BM25 score with original similarity score
            original_score = r.get("relevance_score", 0.5)
            max_possible = len(query_terms) * math.log(n + 1)
            normalized_bm25 = score / max_possible if max_possible > 0 else 0

            r["relevance_score"] = round(0.4 * normalized_bm25 + 0.6 * original_score, 4)
            r["bm25_raw_score"] = round(score, 4)

        return results

    @staticmethod
    def _tokenize(text: str) -> list[str]:
        """Simple whitespace tokenizer with lowercasing and stopword removal."""
        stopwords = {
            "a", "an", "the", "is", "are", "was", "were", "be", "been",
            "being", "have", "has", "had", "do", "does", "did", "will",
            "would", "could", "should", "may", "might", "shall", "can",
            "to", "of", "in", "for", "on", "with", "at", "by", "from",
            "as", "into", "through", "during", "before", "after", "and",
            "but", "or", "nor", "not", "so", "yet", "both", "either",
            "neither", "each", "every", "all", "any", "few", "more",
            "most", "other", "some", "such", "no", "only", "own", "same",
            "than", "too", "very", "just", "because", "if", "when", "it",
            "its", "this", "that", "these", "those", "i", "me", "my",
            "we", "our", "you", "your", "he", "she", "they", "them",
        }
        words = text.lower().split()
        return [w.strip(".,!?;:\"'()[]{}") for w in words
                if w.strip(".,!?;:\"'()[]{}") and w.lower() not in stopwords]
