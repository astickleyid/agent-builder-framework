"""FastAPI middleware — request ID injection, error handling, security headers."""

from __future__ import annotations

import json
import logging
import time
import traceback
import uuid

from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from .logging_config import correlation_id, new_correlation_id

logger = logging.getLogger(__name__)


class RequestIdMiddleware(BaseHTTPMiddleware):
    """Inject a unique request/correlation ID into every request.

    - Reads X-Request-ID header if present (for distributed tracing)
    - Generates one if absent
    - Sets it as a response header
    - Makes it available via context variable for structured logging
    """

    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", uuid.uuid4().hex[:12])
        correlation_id.set(request_id)

        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response


class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    """Catch unhandled exceptions and return structured error responses.

    Prevents stack traces from leaking to clients in production.
    """

    async def dispatch(self, request: Request, call_next):
        try:
            return await call_next(request)
        except Exception as e:
            request_id = correlation_id.get("")
            logger.exception("Unhandled error on %s %s", request.method, request.url.path)

            return JSONResponse(
                status_code=500,
                content={
                    "error": {
                        "code": -32603,
                        "message": "Internal server error",
                        "request_id": request_id,
                    },
                },
                headers={"X-Request-ID": request_id},
            )


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Cache-Control"] = "no-store"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log every request with timing information."""

    def __init__(self, app: FastAPI, service_name: str = "memoraforge"):
        super().__init__(app)
        self.service_name = service_name

    async def dispatch(self, request: Request, call_next):
        start = time.time()
        response = await call_next(request)
        elapsed_ms = (time.time() - start) * 1000

        # Skip health checks and metrics from access logs
        if request.url.path not in ("/health", "/metrics"):
            logger.info(
                "%s %s %d %.1fms",
                request.method,
                request.url.path,
                response.status_code,
                elapsed_ms,
            )

        return response


def setup_middleware(app: FastAPI, service_name: str = "memoraforge"):
    """Apply all standard middleware to a FastAPI app.

    Call this in your service's app setup. Order matters — they execute
    in reverse order (last added = first executed).
    """
    # These are applied bottom-to-top, so RequestId runs first
    app.add_middleware(RequestLoggingMiddleware, service_name=service_name)
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(ErrorHandlerMiddleware)
    app.add_middleware(RequestIdMiddleware)
