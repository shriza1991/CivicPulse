"""
Redis Cache Manager & In-Memory Fallback Client.
"""
import time
import json
import logging
from typing import Optional, Any
from app.config import settings

logger = logging.getLogger("nivaran")

class InMemoryCacheStore:
    def __init__(self):
        self._store: dict[str, tuple[str, float]] = {}

    def get(self, key: str) -> Optional[str]:
        if key in self._store:
            val, expires_at = self._store[key]
            if expires_at == 0 or time.time() < expires_at:
                return val
            else:
                del self._store[key]
        return None

    def set(self, key: str, value: str, ex: Optional[int] = None) -> bool:
        expires_at = time.time() + ex if ex else 0
        self._store[key] = (value, expires_at)
        return True

    def delete(self, key: str) -> bool:
        if key in self._store:
            del self._store[key]
            return True
        return False

class RedisCacheManager:
    def __init__(self):
        self._fallback_store = InMemoryCacheStore()
        self._redis_client = None
        self._is_redis_available = False
        self._connect()

    def _connect(self):
        if settings.REDIS_URL:
            try:
                import redis
                self._redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True, socket_connect_timeout=1)
                self._redis_client.ping()
                self._is_redis_available = True
                logger.info("Connected to production Redis cache successfully.")
            except Exception as e:
                logger.warning(f"Redis unavailable ({e}). Using in-memory fallback cache store.")
                self._is_redis_available = False

    def get(self, key: str) -> Optional[str]:
        if self._is_redis_available and self._redis_client:
            try:
                return self._redis_client.get(key)
            except Exception:
                pass
        return self._fallback_store.get(key)

    def set(self, key: str, value: str, ttl_seconds: int = 300) -> bool:
        if self._is_redis_available and self._redis_client:
            try:
                self._redis_client.set(key, value, ex=ttl_seconds)
                return True
            except Exception:
                pass
        return self._fallback_store.set(key, value, ex=ttl_seconds)

    def delete(self, key: str) -> bool:
        if self._is_redis_available and self._redis_client:
            try:
                self._redis_client.delete(key)
                return True
            except Exception:
                pass
        return self._fallback_store.delete(key)

cache_manager = RedisCacheManager()
