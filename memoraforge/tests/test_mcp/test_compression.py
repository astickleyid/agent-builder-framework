"""Tests for MCP compression and semantic chunking."""

import pytest
from memoraforge.mcp_server.compression import (
    compress_context,
    decompress_context,
    semantic_chunk,
    estimate_tokens,
    compress_context_bundle,
    decompress_context_bundle,
)


class TestLZ4Compression:
    def test_compress_and_decompress_roundtrip(self):
        original = "This is a test string for compression. " * 100
        compressed, ratio = compress_context(original)
        assert ratio < 1.0  # Should actually compress
        decompressed = decompress_context(compressed)
        assert decompressed == original

    def test_compress_empty_string(self):
        compressed, ratio = compress_context("")
        decompressed = decompress_context(compressed)
        assert decompressed == ""

    def test_compress_bytes_input(self):
        original = b"Binary data for compression test" * 50
        compressed, ratio = compress_context(original)
        assert len(compressed) < len(original)


class TestSemanticChunking:
    def test_basic_chunking(self):
        text = "First sentence. Second sentence. Third sentence. " * 50
        chunks = semantic_chunk(text, target_tokens=128)
        assert len(chunks) > 1
        # Verify all content is preserved
        reconstructed = "".join(c.text for c in chunks)
        assert reconstructed == text

    def test_empty_text(self):
        chunks = semantic_chunk("")
        assert chunks == []

    def test_short_text_single_chunk(self):
        text = "Short text."
        chunks = semantic_chunk(text, target_tokens=512)
        assert len(chunks) == 1
        assert chunks[0].text == text

    def test_chunks_have_hashes(self):
        text = "First sentence. Second sentence. Third sentence."
        chunks = semantic_chunk(text)
        for chunk in chunks:
            assert len(chunk.chunk_hash) == 12

    def test_token_estimates(self):
        assert estimate_tokens("hello world") > 0
        assert estimate_tokens("a" * 400) == 100  # ~4 chars per token


class TestContextBundles:
    def test_bundle_roundtrip(self):
        chunks = [
            {"id": "1", "content": "Hello world", "tokens": 3},
            {"id": "2", "content": "Another chunk", "tokens": 3},
        ]
        compressed = compress_context_bundle(chunks)
        decompressed = decompress_context_bundle(compressed)
        assert decompressed == chunks
