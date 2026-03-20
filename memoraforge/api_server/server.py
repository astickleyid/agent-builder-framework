"""Headless API Server — FastAPI gateway for LLM inference.

Supports both vLLM (GPU) and Ollama (CPU/edge) backends.
OpenAI-compatible API endpoints for drop-in replacement.
Stateless, horizontally scalable via K8s HPA.
"""

from __future__ import annotations

import asyncio
import logging
import os
import time
import uuid
from enum import Enum
from typing import Any

import httpx
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

BACKEND = os.getenv("LLM_BACKEND", "ollama")  # "vllm" or "ollama"
VLLM_URL = os.getenv("VLLM_URL", "http://localhost:8001")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "llama3.1:8b")
MAX_CONCURRENT = int(os.getenv("MAX_CONCURRENT_REQUESTS", "32"))

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(title="MemoraForge Headless API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Concurrency semaphore
_semaphore = asyncio.Semaphore(MAX_CONCURRENT)

# Request tracking
_request_count = 0
_total_tokens_generated = 0


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    model: str = DEFAULT_MODEL
    messages: list[ChatMessage]
    max_tokens: int = 2048
    temperature: float = 0.7
    top_p: float = 0.9
    stream: bool = False
    stop: list[str] | None = None


class CompletionRequest(BaseModel):
    model: str = DEFAULT_MODEL
    prompt: str
    max_tokens: int = 2048
    temperature: float = 0.7
    stream: bool = False


class EmbeddingRequest(BaseModel):
    model: str = "all-MiniLM-L6-v2"
    input: str | list[str]


class ChatChoice(BaseModel):
    index: int = 0
    message: ChatMessage
    finish_reason: str = "stop"


class ChatResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int
    model: str
    choices: list[ChatChoice]
    usage: dict[str, int]


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.get("/health")
async def health():
    backend_healthy = await _check_backend()
    return {
        "status": "healthy" if backend_healthy else "degraded",
        "backend": BACKEND,
        "model": DEFAULT_MODEL,
        "requests_served": _request_count,
        "total_tokens": _total_tokens_generated,
        "concurrent_limit": MAX_CONCURRENT,
    }


@app.get("/v1/models")
async def list_models():
    """List available models (OpenAI-compatible)."""
    if BACKEND == "ollama":
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(f"{OLLAMA_URL}/api/tags", timeout=5.0)
                models = resp.json().get("models", [])
                return {
                    "object": "list",
                    "data": [
                        {"id": m["name"], "object": "model", "owned_by": "local"}
                        for m in models
                    ],
                }
        except Exception:
            pass
    return {
        "object": "list",
        "data": [{"id": DEFAULT_MODEL, "object": "model", "owned_by": "local"}],
    }


@app.post("/v1/chat", response_model=ChatResponse)
async def chat_completion(req: ChatRequest):
    """Chat completion endpoint (OpenAI-compatible)."""
    global _request_count, _total_tokens_generated

    async with _semaphore:
        _request_count += 1
        start = time.time()

        if BACKEND == "vllm":
            result = await _vllm_chat(req)
        else:
            result = await _ollama_chat(req)

        elapsed_ms = (time.time() - start) * 1000
        _total_tokens_generated += result.usage.get("completion_tokens", 0)

        logger.info(
            "Chat: model=%s, tokens=%d, time=%.0fms",
            req.model, result.usage.get("total_tokens", 0), elapsed_ms,
        )
        return result


@app.post("/v1/completions")
async def completion(req: CompletionRequest):
    """Text completion endpoint."""
    chat_req = ChatRequest(
        model=req.model,
        messages=[ChatMessage(role="user", content=req.prompt)],
        max_tokens=req.max_tokens,
        temperature=req.temperature,
        stream=req.stream,
    )
    result = await chat_completion(chat_req)
    return {
        "id": result.id,
        "object": "text_completion",
        "choices": [{"text": result.choices[0].message.content, "finish_reason": "stop"}],
        "usage": result.usage,
    }


@app.post("/v1/embeddings")
async def embeddings(req: EmbeddingRequest):
    """Embedding generation endpoint."""
    texts = [req.input] if isinstance(req.input, str) else req.input

    if BACKEND == "ollama":
        embeddings_list = await _ollama_embeddings(texts, req.model)
    else:
        # Fallback: use sentence-transformers
        embeddings_list = _local_embeddings(texts)

    return {
        "object": "list",
        "data": [
            {"object": "embedding", "index": i, "embedding": emb}
            for i, emb in enumerate(embeddings_list)
        ],
        "model": req.model,
        "usage": {"prompt_tokens": sum(len(t.split()) for t in texts), "total_tokens": sum(len(t.split()) for t in texts)},
    }


# ---------------------------------------------------------------------------
# Backend implementations
# ---------------------------------------------------------------------------


async def _ollama_chat(req: ChatRequest) -> ChatResponse:
    """Forward chat request to Ollama."""
    messages = [{"role": m.role, "content": m.content} for m in req.messages]

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(
                f"{OLLAMA_URL}/api/chat",
                json={
                    "model": req.model,
                    "messages": messages,
                    "options": {
                        "temperature": req.temperature,
                        "top_p": req.top_p,
                        "num_predict": req.max_tokens,
                    },
                    "stream": False,
                },
            )
            resp.raise_for_status()
            data = resp.json()

        content = data.get("message", {}).get("content", "")
        prompt_tokens = data.get("prompt_eval_count", len(str(messages)) // 4)
        completion_tokens = data.get("eval_count", len(content) // 4)

    except httpx.ConnectError:
        raise HTTPException(503, f"Ollama not available at {OLLAMA_URL}")
    except Exception as e:
        raise HTTPException(500, f"Ollama error: {e}")

    return ChatResponse(
        id=f"chatcmpl-{uuid.uuid4().hex[:12]}",
        created=int(time.time()),
        model=req.model,
        choices=[ChatChoice(message=ChatMessage(role="assistant", content=content))],
        usage={
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "total_tokens": prompt_tokens + completion_tokens,
        },
    )


async def _vllm_chat(req: ChatRequest) -> ChatResponse:
    """Forward chat request to vLLM (OpenAI-compatible API)."""
    messages = [{"role": m.role, "content": m.content} for m in req.messages]

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(
                f"{VLLM_URL}/v1/chat/completions",
                json={
                    "model": req.model,
                    "messages": messages,
                    "max_tokens": req.max_tokens,
                    "temperature": req.temperature,
                    "top_p": req.top_p,
                },
            )
            resp.raise_for_status()
            data = resp.json()

    except httpx.ConnectError:
        raise HTTPException(503, f"vLLM not available at {VLLM_URL}")
    except Exception as e:
        raise HTTPException(500, f"vLLM error: {e}")

    choice = data["choices"][0]
    return ChatResponse(
        id=data.get("id", f"chatcmpl-{uuid.uuid4().hex[:12]}"),
        created=data.get("created", int(time.time())),
        model=data.get("model", req.model),
        choices=[ChatChoice(
            message=ChatMessage(
                role=choice["message"]["role"],
                content=choice["message"]["content"],
            ),
            finish_reason=choice.get("finish_reason", "stop"),
        )],
        usage=data.get("usage", {}),
    )


async def _ollama_embeddings(texts: list[str], model: str) -> list[list[float]]:
    """Generate embeddings via Ollama."""
    results = []
    async with httpx.AsyncClient(timeout=30.0) as client:
        for text in texts:
            try:
                resp = await client.post(
                    f"{OLLAMA_URL}/api/embeddings",
                    json={"model": model, "prompt": text},
                )
                resp.raise_for_status()
                results.append(resp.json().get("embedding", []))
            except Exception:
                results.append(_local_embed_single(text))
    return results


def _local_embeddings(texts: list[str]) -> list[list[float]]:
    """Local embedding fallback using sentence-transformers."""
    try:
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer("all-MiniLM-L6-v2")
        return model.encode(texts).tolist()
    except ImportError:
        return [_local_embed_single(t) for t in texts]


def _local_embed_single(text: str) -> list[float]:
    """Hash-based embedding fallback for dev."""
    import hashlib
    h = hashlib.sha256(text.encode()).digest()
    return [(h[i % len(h)] / 255.0) * 2 - 1 for i in range(384)]


async def _check_backend() -> bool:
    """Health check the LLM backend."""
    url = VLLM_URL if BACKEND == "vllm" else OLLAMA_URL
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(url)
            return resp.status_code < 500
    except Exception:
        return False


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
