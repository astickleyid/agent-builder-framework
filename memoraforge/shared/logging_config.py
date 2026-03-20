"""Structured logging — JSON-formatted, correlation-ID-aware logging for all services."""

from __future__ import annotations

import json
import logging
import os
import sys
import time
import uuid
from contextvars import ContextVar
from typing import Any

# Context variable for request-scoped correlation ID
correlation_id: ContextVar[str] = ContextVar("correlation_id", default="")

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
LOG_FORMAT = os.getenv("LOG_FORMAT", "json")  # "json" or "text"


class JsonFormatter(logging.Formatter):
    """Structured JSON log formatter with correlation ID support."""

    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime(record.created))
            + f".{int(record.msecs):03d}Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "service": getattr(record, "service", "memoraforge"),
        }

        # Add correlation ID if available
        cid = correlation_id.get("")
        if cid:
            log_entry["correlation_id"] = cid

        # Add extra fields
        if hasattr(record, "extra_fields"):
            log_entry.update(record.extra_fields)

        # Add exception info
        if record.exc_info and record.exc_info[1]:
            log_entry["exception"] = {
                "type": type(record.exc_info[1]).__name__,
                "message": str(record.exc_info[1]),
            }

        # Add source location for errors
        if record.levelno >= logging.WARNING:
            log_entry["source"] = {
                "file": record.pathname,
                "line": record.lineno,
                "function": record.funcName,
            }

        return json.dumps(log_entry, separators=(",", ":"))


class ServiceLogger(logging.LoggerAdapter):
    """Logger adapter that injects service name and extra fields."""

    def __init__(self, logger: logging.Logger, service: str):
        super().__init__(logger, {"service": service})
        self.service = service

    def process(self, msg, kwargs):
        extra = kwargs.get("extra", {})
        extra["service"] = self.service
        cid = correlation_id.get("")
        if cid:
            extra["correlation_id"] = cid
        kwargs["extra"] = extra
        return msg, kwargs

    def with_fields(self, **fields) -> FieldLogger:
        """Create a child logger with additional structured fields."""
        return FieldLogger(self, fields)


class FieldLogger:
    """Logger that carries additional structured fields."""

    def __init__(self, parent: ServiceLogger, fields: dict[str, Any]):
        self._parent = parent
        self._fields = fields

    def _log(self, level: str, msg: str, **kwargs):
        extra = kwargs.pop("extra", {})
        extra["extra_fields"] = self._fields
        getattr(self._parent, level)(msg, extra=extra, **kwargs)

    def info(self, msg, **kwargs): self._log("info", msg, **kwargs)
    def debug(self, msg, **kwargs): self._log("debug", msg, **kwargs)
    def warning(self, msg, **kwargs): self._log("warning", msg, **kwargs)
    def error(self, msg, **kwargs): self._log("error", msg, **kwargs)
    def exception(self, msg, **kwargs): self._log("exception", msg, **kwargs)


def setup_logging(service_name: str, level: str = LOG_LEVEL) -> ServiceLogger:
    """Configure structured logging for a service.

    Returns a ServiceLogger that should be used throughout the service.

    Usage:
        log = setup_logging("memory-hub")
        log.info("Starting service")
        log.with_fields(agent_id="abc", tokens=500).info("Stored memory")
    """
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, level, logging.INFO))

    # Remove existing handlers
    root_logger.handlers.clear()

    handler = logging.StreamHandler(sys.stdout)
    if LOG_FORMAT == "json":
        handler.setFormatter(JsonFormatter())
    else:
        handler.setFormatter(logging.Formatter(
            "%(asctime)s %(levelname)-8s [%(name)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        ))

    root_logger.addHandler(handler)

    # Silence noisy third-party loggers
    for noisy in ["uvicorn.access", "httpx", "httpcore", "hpack"]:
        logging.getLogger(noisy).setLevel(logging.WARNING)

    logger = logging.getLogger(service_name)
    return ServiceLogger(logger, service_name)


def new_correlation_id() -> str:
    """Generate a new correlation ID for request tracing."""
    cid = uuid.uuid4().hex[:12]
    correlation_id.set(cid)
    return cid
