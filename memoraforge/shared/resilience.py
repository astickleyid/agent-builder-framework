"""Resilience patterns — retry, circuit breaker, and timeout wrappers."""

from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import dataclass, field
from enum import Enum
from functools import wraps
from typing import Any, Callable, TypeVar

logger = logging.getLogger(__name__)
T = TypeVar("T")


# ─── Retry ───────────────────────────────────────────────────────


@dataclass
class RetryConfig:
    max_attempts: int = 3
    base_delay: float = 0.5      # seconds
    max_delay: float = 30.0
    exponential_base: float = 2.0
    retryable_exceptions: tuple = (Exception,)


def retry(config: RetryConfig | None = None):
    """Async retry decorator with exponential backoff.

    Usage:
        @retry(RetryConfig(max_attempts=3))
        async def flaky_call():
            ...
    """
    cfg = config or RetryConfig()

    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(1, cfg.max_attempts + 1):
                try:
                    return await func(*args, **kwargs)
                except cfg.retryable_exceptions as e:
                    last_exception = e
                    if attempt == cfg.max_attempts:
                        break
                    delay = min(
                        cfg.base_delay * (cfg.exponential_base ** (attempt - 1)),
                        cfg.max_delay,
                    )
                    logger.warning(
                        "Retry %d/%d for %s after %.1fs: %s",
                        attempt, cfg.max_attempts, func.__name__, delay, e,
                    )
                    await asyncio.sleep(delay)
            raise last_exception
        return wrapper
    return decorator


# ─── Circuit Breaker ─────────────────────────────────────────────


class CircuitState(str, Enum):
    CLOSED = "closed"       # Normal operation
    OPEN = "open"           # Failing, reject requests
    HALF_OPEN = "half_open" # Testing if service recovered


@dataclass
class CircuitBreaker:
    """Circuit breaker for external service calls.

    Transitions:
    - CLOSED → OPEN: After `failure_threshold` consecutive failures
    - OPEN → HALF_OPEN: After `recovery_timeout` seconds
    - HALF_OPEN → CLOSED: On first success
    - HALF_OPEN → OPEN: On first failure

    Usage:
        weaviate_breaker = CircuitBreaker(name="weaviate")

        @weaviate_breaker.protect
        async def search_vectors(query):
            ...
    """

    name: str = "default"
    failure_threshold: int = 3
    recovery_timeout: float = 30.0
    state: CircuitState = CircuitState.CLOSED
    failure_count: int = 0
    last_failure_time: float = 0.0
    success_count: int = 0
    total_calls: int = 0

    def _check_state(self):
        """Transition from OPEN → HALF_OPEN if recovery timeout elapsed."""
        if self.state == CircuitState.OPEN:
            if time.time() - self.last_failure_time >= self.recovery_timeout:
                self.state = CircuitState.HALF_OPEN
                logger.info("Circuit %s: OPEN → HALF_OPEN", self.name)

    def _record_success(self):
        self.failure_count = 0
        self.success_count += 1
        self.total_calls += 1
        if self.state == CircuitState.HALF_OPEN:
            self.state = CircuitState.CLOSED
            logger.info("Circuit %s: HALF_OPEN → CLOSED", self.name)

    def _record_failure(self):
        self.failure_count += 1
        self.total_calls += 1
        self.last_failure_time = time.time()
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN
            logger.warning(
                "Circuit %s: → OPEN after %d failures",
                self.name, self.failure_count,
            )

    @property
    def is_open(self) -> bool:
        self._check_state()
        return self.state == CircuitState.OPEN

    def protect(self, func: Callable):
        """Decorator to protect a function with this circuit breaker."""
        @wraps(func)
        async def wrapper(*args, **kwargs):
            if self.is_open:
                raise CircuitOpenError(
                    f"Circuit '{self.name}' is OPEN — call rejected. "
                    f"Recovery in {self.recovery_timeout - (time.time() - self.last_failure_time):.0f}s"
                )
            try:
                result = await func(*args, **kwargs)
                self._record_success()
                return result
            except Exception as e:
                self._record_failure()
                raise
        return wrapper

    def status(self) -> dict[str, Any]:
        self._check_state()
        return {
            "name": self.name,
            "state": self.state.value,
            "failure_count": self.failure_count,
            "success_count": self.success_count,
            "total_calls": self.total_calls,
        }


class CircuitOpenError(Exception):
    """Raised when a circuit breaker is open."""
    pass


# ─── Timeout ─────────────────────────────────────────────────────


def timeout(seconds: float):
    """Async timeout decorator.

    Usage:
        @timeout(5.0)
        async def slow_operation():
            ...
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                return await asyncio.wait_for(func(*args, **kwargs), timeout=seconds)
            except asyncio.TimeoutError:
                raise TimeoutError(
                    f"{func.__name__} timed out after {seconds}s"
                )
        return wrapper
    return decorator


# ─── Bulkhead (concurrency limiter) ─────────────────────────────


@dataclass
class Bulkhead:
    """Limits concurrent executions to prevent resource exhaustion.

    Usage:
        llm_bulkhead = Bulkhead(name="llm", max_concurrent=10)

        @llm_bulkhead.protect
        async def call_llm(prompt):
            ...
    """

    name: str = "default"
    max_concurrent: int = 10
    _semaphore: asyncio.Semaphore = field(default=None, repr=False)

    def __post_init__(self):
        self._semaphore = asyncio.Semaphore(self.max_concurrent)

    def protect(self, func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                await asyncio.wait_for(self._semaphore.acquire(), timeout=30.0)
            except asyncio.TimeoutError:
                raise BulkheadFullError(
                    f"Bulkhead '{self.name}' full ({self.max_concurrent} concurrent)"
                )
            try:
                return await func(*args, **kwargs)
            finally:
                self._semaphore.release()
        return wrapper

    @property
    def available(self) -> int:
        return self._semaphore._value


class BulkheadFullError(Exception):
    """Raised when a bulkhead's concurrency limit is reached."""
    pass


# ─── Fallback ────────────────────────────────────────────────────


def fallback(fallback_func: Callable):
    """Decorator that calls a fallback function on any exception.

    Usage:
        async def cached_search(query):
            return cache.get(query)

        @fallback(cached_search)
        async def vector_search(query):
            return await weaviate.search(query)
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                return await func(*args, **kwargs)
            except Exception as e:
                logger.warning(
                    "%s failed (%s), using fallback %s",
                    func.__name__, e, fallback_func.__name__,
                )
                if asyncio.iscoroutinefunction(fallback_func):
                    return await fallback_func(*args, **kwargs)
                return fallback_func(*args, **kwargs)
        return wrapper
    return decorator
