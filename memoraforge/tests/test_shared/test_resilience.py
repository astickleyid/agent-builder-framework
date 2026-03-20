"""Tests for resilience patterns — retry, circuit breaker, bulkhead."""

import asyncio
import pytest
import time
from memoraforge.shared.resilience import (
    RetryConfig, retry,
    CircuitBreaker, CircuitState, CircuitOpenError,
    Bulkhead, BulkheadFullError,
    timeout,
)


class TestRetry:
    @pytest.mark.asyncio
    async def test_retry_succeeds_on_third_attempt(self):
        attempts = 0

        @retry(RetryConfig(max_attempts=3, base_delay=0.01))
        async def flaky():
            nonlocal attempts
            attempts += 1
            if attempts < 3:
                raise ValueError("not yet")
            return "success"

        result = await flaky()
        assert result == "success"
        assert attempts == 3

    @pytest.mark.asyncio
    async def test_retry_exhausts_attempts(self):
        @retry(RetryConfig(max_attempts=2, base_delay=0.01))
        async def always_fails():
            raise RuntimeError("always fails")

        with pytest.raises(RuntimeError, match="always fails"):
            await always_fails()

    @pytest.mark.asyncio
    async def test_retry_succeeds_immediately(self):
        @retry(RetryConfig(max_attempts=3))
        async def works_fine():
            return 42

        assert await works_fine() == 42


class TestCircuitBreaker:
    def test_starts_closed(self):
        cb = CircuitBreaker(name="test")
        assert cb.state == CircuitState.CLOSED

    @pytest.mark.asyncio
    async def test_opens_after_threshold(self):
        cb = CircuitBreaker(name="test", failure_threshold=2)

        @cb.protect
        async def failing():
            raise RuntimeError("fail")

        for _ in range(2):
            with pytest.raises(RuntimeError):
                await failing()

        assert cb.state == CircuitState.OPEN

        with pytest.raises(CircuitOpenError):
            await failing()

    @pytest.mark.asyncio
    async def test_recovery(self):
        cb = CircuitBreaker(name="test", failure_threshold=1, recovery_timeout=0.1)

        call_count = 0

        @cb.protect
        async def maybe_fail():
            nonlocal call_count
            call_count += 1
            if call_count <= 1:
                raise RuntimeError("fail")
            return "recovered"

        with pytest.raises(RuntimeError):
            await maybe_fail()

        assert cb.state == CircuitState.OPEN
        await asyncio.sleep(0.15)  # Wait for recovery timeout

        result = await maybe_fail()
        assert result == "recovered"
        assert cb.state == CircuitState.CLOSED

    def test_status_report(self):
        cb = CircuitBreaker(name="my-service", failure_threshold=3)
        status = cb.status()
        assert status["name"] == "my-service"
        assert status["state"] == "closed"


class TestBulkhead:
    @pytest.mark.asyncio
    async def test_limits_concurrency(self):
        bh = Bulkhead(name="test", max_concurrent=2)
        running = 0
        max_running = 0

        @bh.protect
        async def limited():
            nonlocal running, max_running
            running += 1
            max_running = max(max_running, running)
            await asyncio.sleep(0.05)
            running -= 1

        await asyncio.gather(*[limited() for _ in range(5)])
        assert max_running <= 2


class TestTimeout:
    @pytest.mark.asyncio
    async def test_timeout_raises(self):
        @timeout(0.05)
        async def slow():
            await asyncio.sleep(1.0)

        with pytest.raises(TimeoutError):
            await slow()

    @pytest.mark.asyncio
    async def test_timeout_passes(self):
        @timeout(1.0)
        async def fast():
            return "done"

        assert await fast() == "done"
