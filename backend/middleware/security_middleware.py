"""
backend/middleware/security_middleware.py - Security Headers, Rate Limiting & Input Sanitization
"""
import time
import html
from collections import defaultdict
from typing import Dict, List, Tuple
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, Response, HTTPException

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        # Security Hardening Response Headers
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:;"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        return response

class RateLimiter:
    def __init__(self, requests_per_window: int = 20, window_seconds: int = 60):
        self.requests_per_window = requests_per_window
        self.window_seconds = window_seconds
        self.history: Dict[str, List[float]] = defaultdict(list)

    def is_rate_limited(self, ip_address: str) -> bool:
        now = time.time()
        window_start = now - self.window_seconds
        # Clean timestamps older than window
        self.history[ip_address] = [t for t in self.history[ip_address] if t > window_start]
        
        if len(self.history[ip_address]) >= self.requests_per_window:
            return True
        
        self.history[ip_address].append(now)
        return False

def sanitize_input_text(text: str) -> str:
    """Escapes HTML entities to prevent Cross-Site Scripting (XSS)."""
    if not text:
        return ""
    return html.escape(text.strip())
