"""ACP authentication — JWT + API key dual auth with rate limiting."""

from __future__ import annotations

import hashlib
import hmac
import logging
import secrets
import time
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# API Key management
# ---------------------------------------------------------------------------

# In production, these come from PostgreSQL / Vault
_api_keys: dict[str, dict] = {}  # key_hash → {agent_id, scopes, created_at}


def generate_api_key(agent_id: str, scopes: list[str] | None = None) -> str:
    """Generate a new API key for an agent."""
    raw_key = f"mf_{secrets.token_urlsafe(32)}"
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    _api_keys[key_hash] = {
        "agent_id": agent_id,
        "scopes": scopes or ["read", "write", "invoke"],
        "created_at": time.time(),
    }
    return raw_key


def validate_api_key(raw_key: str) -> dict | None:
    """Validate an API key. Returns agent info or None."""
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    return _api_keys.get(key_hash)


# ---------------------------------------------------------------------------
# JWT (simplified — use PyJWT in production)
# ---------------------------------------------------------------------------

_jwt_secret = secrets.token_hex(32)


@dataclass
class JWTClaims:
    agent_id: str
    scopes: list[str]
    issued_at: float = field(default_factory=time.time)
    expires_at: float = 0.0

    def __post_init__(self):
        if self.expires_at == 0.0:
            self.expires_at = self.issued_at + 3600  # 1h default


def issue_session_token(agent_id: str, scopes: list[str]) -> str:
    """Issue a session token (simplified JWT placeholder).

    In production, use PyJWT with RS256 signing.
    """
    claims = JWTClaims(agent_id=agent_id, scopes=scopes)
    # Simplified: in production, sign with RS256
    payload = f"{agent_id}:{','.join(scopes)}:{claims.expires_at}"
    signature = hmac.new(_jwt_secret.encode(), payload.encode(), hashlib.sha256).hexdigest()[:16]
    return f"{payload}:{signature}"


def validate_session_token(token: str) -> JWTClaims | None:
    """Validate a session token. Returns claims or None."""
    try:
        parts = token.rsplit(":", 1)
        if len(parts) != 2:
            return None
        payload, signature = parts
        expected = hmac.new(_jwt_secret.encode(), payload.encode(), hashlib.sha256).hexdigest()[:16]
        if not hmac.compare_digest(signature, expected):
            return None
        agent_id, scopes_str, expires_str = payload.split(":")
        expires_at = float(expires_str)
        if time.time() > expires_at:
            return None
        return JWTClaims(
            agent_id=agent_id,
            scopes=scopes_str.split(","),
            expires_at=expires_at,
        )
    except Exception:
        return None


# ---------------------------------------------------------------------------
# Rate Limiting (Token Bucket)
# ---------------------------------------------------------------------------


@dataclass
class TokenBucket:
    """Token bucket rate limiter per agent."""

    capacity: float = 100.0       # Max burst
    refill_rate: float = 10.0     # Tokens per second
    tokens: float = 100.0
    last_refill: float = field(default_factory=time.time)

    def consume(self, tokens: float = 1.0) -> bool:
        """Try to consume tokens. Returns True if allowed."""
        now = time.time()
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill = now

        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False


_rate_limiters: dict[str, TokenBucket] = {}


def check_rate_limit(agent_id: str, tokens: float = 1.0) -> bool:
    """Check if an agent is within rate limits."""
    if agent_id not in _rate_limiters:
        _rate_limiters[agent_id] = TokenBucket()
    return _rate_limiters[agent_id].consume(tokens)


def configure_rate_limit(agent_id: str, capacity: float, refill_rate: float):
    """Configure rate limits for a specific agent."""
    _rate_limiters[agent_id] = TokenBucket(capacity=capacity, refill_rate=refill_rate)
