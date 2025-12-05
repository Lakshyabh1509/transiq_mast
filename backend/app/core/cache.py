import json
import hashlib
from functools import wraps
from typing import Any, Callable
import redis
from app.core.config import settings

# Redis client
redis_client: redis.Redis | None = None


def get_redis() -> redis.Redis | None:
    """Get Redis client, returns None if connection fails."""
    global redis_client
    if redis_client is None:
        try:
            redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
            redis_client.ping()
        except redis.ConnectionError:
            return None
    return redis_client


def cache(expire: int = 300, prefix: str = "cache"):
    """
    Caching decorator for expensive operations.
    
    Args:
        expire: TTL in seconds (default 5 minutes)
        prefix: Cache key prefix
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs) -> Any:
            client = get_redis()
            if client is None:
                # Redis unavailable, execute without cache
                return await func(*args, **kwargs)
            
            # Create cache key from function name and arguments
            key_data = f"{func.__name__}:{str(args)}:{str(sorted(kwargs.items()))}"
            cache_key = f"{prefix}:{hashlib.md5(key_data.encode()).hexdigest()}"
            
            # Try to get from cache
            cached = client.get(cache_key)
            if cached:
                return json.loads(cached)
            
            # Execute and cache result
            result = await func(*args, **kwargs)
            client.setex(cache_key, expire, json.dumps(result, default=str))
            return result
        
        return wrapper
    return decorator


def invalidate_cache(pattern: str = "cache:*") -> int:
    """Invalidate cache entries matching pattern."""
    client = get_redis()
    if client is None:
        return 0
    
    keys = client.keys(pattern)
    if keys:
        return client.delete(*keys)
    return 0
