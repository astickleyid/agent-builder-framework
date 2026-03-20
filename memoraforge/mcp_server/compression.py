"""Context compression — LZ4 real-time + semantic chunking."""

from __future__ import annotations

import hashlib
import json
import logging
from dataclasses import dataclass

import lz4.frame

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# LZ4 Compression
# ---------------------------------------------------------------------------


def compress_context(data: str | bytes) -> tuple[bytes, float]:
    """Compress context data with LZ4. Returns (compressed_bytes, ratio)."""
    if isinstance(data, str):
        data = data.encode("utf-8")
    original_size = len(data)
    compressed = lz4.frame.compress(
        data,
        compression_level=lz4.frame.COMPRESSIONLEVEL_MINHC,
        block_size=lz4.frame.BLOCKSIZE_MAX256KB,
    )
    ratio = len(compressed) / original_size if original_size > 0 else 1.0
    logger.debug(
        "Compressed %d → %d bytes (%.1f%%)",
        original_size, len(compressed), ratio * 100,
    )
    return compressed, ratio


def decompress_context(data: bytes) -> str:
    """Decompress LZ4 context back to string."""
    return lz4.frame.decompress(data).decode("utf-8")


# ---------------------------------------------------------------------------
# Semantic Chunking
# ---------------------------------------------------------------------------

CHUNK_TARGET_TOKENS = 512
SENTENCE_ENDINGS = {".", "!", "?", "\n\n"}


@dataclass
class SemanticChunk:
    text: str
    token_estimate: int
    chunk_hash: str


def estimate_tokens(text: str) -> int:
    """Fast token estimate: ~4 chars per token for English."""
    return max(1, len(text) // 4)


def semantic_chunk(text: str, target_tokens: int = CHUNK_TARGET_TOKENS) -> list[SemanticChunk]:
    """Split text into semantic chunks at sentence boundaries.

    Unlike naive fixed-size splitting, this respects sentence boundaries
    to preserve semantic coherence within each chunk.
    """
    if not text.strip():
        return []

    target_chars = target_tokens * 4
    chunks: list[SemanticChunk] = []
    current: list[str] = []
    current_len = 0

    sentences = _split_sentences(text)

    for sentence in sentences:
        sentence_len = len(sentence)

        if current_len + sentence_len > target_chars and current:
            chunk_text = "".join(current)
            chunks.append(SemanticChunk(
                text=chunk_text,
                token_estimate=estimate_tokens(chunk_text),
                chunk_hash=hashlib.md5(chunk_text.encode()).hexdigest()[:12],
            ))
            current = []
            current_len = 0

        current.append(sentence)
        current_len += sentence_len

    # Flush remainder
    if current:
        chunk_text = "".join(current)
        chunks.append(SemanticChunk(
            text=chunk_text,
            token_estimate=estimate_tokens(chunk_text),
            chunk_hash=hashlib.md5(chunk_text.encode()).hexdigest()[:12],
        ))

    return chunks


def _split_sentences(text: str) -> list[str]:
    """Split text into sentences, keeping delimiters attached."""
    sentences: list[str] = []
    current: list[str] = []

    for char in text:
        current.append(char)
        if char in ".!?" and len(current) > 1:
            sentences.append("".join(current))
            current = []
        elif char == "\n" and current and (len(current) >= 2 and current[-2] == "\n"):
            sentences.append("".join(current))
            current = []

    if current:
        sentences.append("".join(current))

    return sentences


# ---------------------------------------------------------------------------
# Batch compression for context bundles
# ---------------------------------------------------------------------------


def compress_context_bundle(chunks: list[dict]) -> bytes:
    """Compress a bundle of context chunks for transmission."""
    payload = json.dumps(chunks, separators=(",", ":")).encode("utf-8")
    compressed, _ = compress_context(payload)
    return compressed


def decompress_context_bundle(data: bytes) -> list[dict]:
    """Decompress a context bundle back to chunk dicts."""
    payload = decompress_context(data)
    return json.loads(payload)
