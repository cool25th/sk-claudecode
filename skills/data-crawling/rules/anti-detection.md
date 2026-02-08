# Anti-Detection Patterns

> ⚠️ **Use responsibly.** These patterns are for legitimate data collection where
> the target site doesn't provide an API. Always respect `robots.txt` and ToS.

## Headers

### Realistic Browser Headers
```python
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}
```

### User-Agent Rotation
```python
import random

USER_AGENTS = [
    # Chrome on macOS
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    # Chrome on Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    # Firefox on macOS
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0",
    # Safari on macOS
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
]

def random_headers() -> dict:
    return {**HEADERS, "User-Agent": random.choice(USER_AGENTS)}
```

## Session Management

### Cookie Persistence
```python
import httpx

async def scrape_with_session(urls: list[str]):
    """Reuse session cookies across requests."""
    async with httpx.AsyncClient(
        headers=HEADERS,
        follow_redirects=True,
        timeout=30.0,
    ) as client:
        # First visit sets cookies
        await client.get(urls[0])

        # Subsequent requests carry cookies
        for url in urls[1:]:
            resp = await client.get(url)
            yield resp
```

### Login Flow
```python
async def login_and_scrape(login_url, data_url, credentials):
    async with httpx.AsyncClient(follow_redirects=True) as client:
        # Login
        login_resp = await client.post(login_url, data=credentials)
        if login_resp.status_code != 200:
            raise Exception("Login failed")

        # Session cookies are now set in client
        data_resp = await client.get(data_url)
        return data_resp.json()
```

## Playwright Stealth

```python
from playwright.async_api import async_playwright

async def stealth_scrape(url: str):
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
            ],
        )
        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            locale="ko-KR",
            timezone_id="Asia/Seoul",
            user_agent=random.choice(USER_AGENTS),
        )

        page = await context.new_page()

        # Remove webdriver flag
        await page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
        """)

        await page.goto(url, wait_until="networkidle")
        content = await page.content()

        await browser.close()
        return content
```

## Request Fingerprint Diversification

```python
# Vary request patterns to look organic
import random

async def organic_browse(client, urls):
    """Browse like a human — vary timing and order."""
    random.shuffle(urls)  # Don't follow predictable order

    for url in urls:
        await asyncio.sleep(random.uniform(2.0, 8.0))  # Variable timing
        resp = await client.get(url, headers=random_headers())
        yield resp
```

## What NOT to Do

| ❌ Don't | ✅ Do Instead |
|----------|---------------|
| Send 100 requests/second | Limit to 1-3 req/sec with delays |
| Use the same UA for all requests | Rotate User-Agents |
| Ignore `robots.txt` | Always check before crawling |
| Scrape while logged in to personal account | Use dedicated service account |
| Store scraped PII without consent | Anonymize or exclude personal data |
| Bypass CAPTCHAs | Find API alternative or use manual flow |
