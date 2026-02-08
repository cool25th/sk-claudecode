# Rate Limiting & Politeness

## robots.txt

Always check before crawling:

```python
from urllib.robotparser import RobotFileParser

def can_crawl(url: str, user_agent: str = "*") -> bool:
    from urllib.parse import urlparse
    parsed = urlparse(url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"

    rp = RobotFileParser()
    rp.set_url(robots_url)
    rp.read()
    return rp.can_fetch(user_agent, url)
```

## Delay Patterns

### Fixed Delay
```python
await asyncio.sleep(2.0)  # 2 seconds between requests
```

### Random Delay (Recommended)
```python
import random
await asyncio.sleep(random.uniform(1.0, 3.0))  # 1-3 seconds
```

### Adaptive Delay
```python
async def adaptive_delay(resp: httpx.Response):
    """Slow down if server is stressed."""
    if resp.status_code == 429:
        retry_after = int(resp.headers.get("Retry-After", 60))
        await asyncio.sleep(retry_after)
    elif resp.elapsed.total_seconds() > 5.0:
        await asyncio.sleep(5.0)  # Server is slow, back off
    else:
        await asyncio.sleep(random.uniform(1.0, 2.0))
```

## Concurrency Control

```python
import asyncio

SEM = asyncio.Semaphore(3)  # Max 3 concurrent requests

async def limited_fetch(client, url):
    async with SEM:
        resp = await client.get(url)
        await asyncio.sleep(random.uniform(0.5, 1.5))
        return resp

# Usage
tasks = [limited_fetch(client, url) for url in urls]
results = await asyncio.gather(*tasks)
```

## HTTP 429 Handling

```python
async def fetch_with_429_retry(client, url, max_retries=5):
    for attempt in range(max_retries):
        resp = await client.get(url)
        if resp.status_code == 429:
            wait = int(resp.headers.get("Retry-After", 2 ** attempt))
            print(f"Rate limited. Waiting {wait}s...")
            await asyncio.sleep(wait)
            continue
        return resp
    raise Exception(f"Still rate-limited after {max_retries} retries")
```

## Guidelines

| Rule | Value |
|------|-------|
| Min delay between requests | 1 second |
| Max concurrent connections | 3-5 |
| Respect `Retry-After` header | Always |
| Check `robots.txt` | Before first request |
| Set `User-Agent` | Always (honest identifier) |
| Peak hours | Consider reducing rate further |
