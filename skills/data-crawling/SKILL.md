---
name: data-crawling
description: Web data crawling, scraping, and extraction patterns. API reverse engineering and MCP server wrapping. Triggers on crawl, scrape, extract, web data, or spider tasks.
---

# Data Crawling & Scraping Skill

Systematic data extraction from websites — from static HTML scraping to dynamic SPA crawling, API reverse engineering, and MCP server wrapping.

## Strategy Selection

Pick the lightest approach that works:

```
1. Public API exists?      → Use API directly (fastest, most reliable)
2. Static HTML?            → httpx + selectolax/BeautifulSoup
3. JS-rendered SPA?        → agent-browser CLI (AI-optimized) or Playwright (async)
4. Hidden API in Network?  → Reverse engineer the XHR/fetch calls
```

> **Rule**: Always prefer API > Static > Reverse-engineered API > Dynamic browser.
> Browser automation is the last resort — it's 10-100× slower and more fragile.
> For browser-heavy tasks, use the `agent-browser` skill which provides snapshot-based element selection, session management, and AI-optimized interaction patterns.

## Quick Start Patterns

### 1. Static HTML Scraper (Most Common)

```python
import httpx
from selectolax.parser import HTMLParser

async def scrape(url: str) -> list[dict]:
    async with httpx.AsyncClient(
        headers={"User-Agent": "Mozilla/5.0 (compatible; DataBot/1.0)"},
        timeout=30.0,
        follow_redirects=True,
    ) as client:
        resp = await client.get(url)
        resp.raise_for_status()

    tree = HTMLParser(resp.text)
    items = []
    for node in tree.css("div.item"):
        items.append({
            "title": node.css_first("h2").text(strip=True),
            "link": node.css_first("a").attrs.get("href", ""),
        })
    return items
```

### 2. Dynamic SPA Scraper (JS-rendered)

```python
from playwright.async_api import async_playwright

async def scrape_spa(url: str) -> list[dict]:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url, wait_until="networkidle")

        items = await page.evaluate("""
            () => Array.from(document.querySelectorAll('.item')).map(el => ({
                title: el.querySelector('h2')?.textContent?.trim(),
                link: el.querySelector('a')?.href,
            }))
        """)

        await browser.close()
    return items
```

### 3. API Reverse Engineering

```python
import httpx

async def fetch_api(page: int = 1) -> dict:
    """Call the hidden API found via browser DevTools Network tab."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://example.com/api/internal/items",
            params={"page": page, "limit": 20},
            headers={
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
        )
        resp.raise_for_status()
        return resp.json()
```

### 4. MCP Server Wrapping

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("my-data-source")

@mcp.tool()
async def search_items(query: str, page: int = 1) -> str:
    """Search items from the data source."""
    results = await scrape_with_query(query, page)
    return format_results(results)

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

## Core Rules

### CRITICAL: Strategy Selection
- Always check for public API first (docs, `/api/`, GraphQL endpoint)
- Inspect Network tab before writing a scraper — many SPAs have clean JSON APIs
- Static scraping (`httpx`) is **10-100× faster** than browser automation
- → See `rules/strategy-selection.md` for decision flowchart and site-type examples

### HIGH: Error Handling & Resilience
- Always use retry with exponential backoff (`2^attempt` seconds)
- Catch `httpx.HTTPStatusError` and `httpx.ConnectError` separately
- Max 3 retries for transient errors; fail fast on 4xx client errors
- → See `templates/basic-scraper.py` → `fetch_page()` for implementation

### HIGH: Rate Limiting & Politeness
- Check `robots.txt` before crawling
- Add 1-3 second random delay between requests
- Use `asyncio.Semaphore(3)` for concurrent connection limits
- Handle HTTP 429 with `Retry-After` header
- → See `rules/rate-limiting.md` for delay patterns and concurrency control

### MEDIUM: Data Extraction
- CSS selectors preferred over XPath (`node.css_first("h2.title")`)
- Use `safe_text()` / `safe_attr()` helpers for graceful extraction
- Clean data: normalize whitespace, parse numbers/dates, resolve relative URLs
- → See `rules/data-extraction.md` for helpers, table parsing, cleaning utilities
- → See `references/selector-patterns.md` for CSS/XPath cheat sheet

### MEDIUM: Incremental Save
- Save data as JSON Lines (`.jsonl`) — append after each page, not at end
- Use `ensure_ascii=False` for Korean text
- → See `rules/data-extraction.md` → Output Formats for `save_jsonl` / `save_csv`

### MEDIUM: Anti-Detection (When Necessary)
- Rotate User-Agent strings across requests
- Send realistic browser headers (Accept, Accept-Language, etc.)
- For Playwright: disable `webdriver` flag, set viewport/locale
- → See `rules/anti-detection.md` for full header sets, session management, stealth

## Pagination Patterns

```python
# Pattern 1: Page number
async def paginate_by_page(client, base_url):
    page = 1
    while True:
        resp = await client.get(f"{base_url}?page={page}")
        data = resp.json()
        if not data["items"]:
            break
        yield data["items"]
        page += 1

# Pattern 2: Cursor / next_token
async def paginate_by_cursor(client, base_url):
    cursor = None
    while True:
        params = {"cursor": cursor} if cursor else {}
        resp = await client.get(base_url, params=params)
        data = resp.json()
        yield data["items"]
        cursor = data.get("next_cursor")
        if not cursor:
            break

# Pattern 3: Infinite scroll (Playwright)
async def scroll_to_bottom(page):
    prev_height = 0
    while True:
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.wait_for_timeout(2000)
        curr_height = await page.evaluate("document.body.scrollHeight")
        if curr_height == prev_height:
            break
        prev_height = curr_height
```

## Library Quick Reference

| Purpose | Python | Node.js |
|---------|--------|---------|
| HTTP Client | `httpx` (async) | `undici` / `got` |
| HTML Parsing | `selectolax` (fast) / `bs4` | `cheerio` |
| Browser Automation | `playwright` | `playwright` |
| CSS Selectors | `selectolax` CSS | `cheerio` CSS |
| XPath | `lxml.etree` | `xpath` |
| JSON-Lines | `json` (stdlib) | `fs.createWriteStream` |
| Rate Limit | `asyncio.Semaphore` | `p-limit` |
| MCP Server | `fastmcp` | `@modelcontextprotocol/sdk` |

## Detailed Rules

For comprehensive guides, see:
- `rules/strategy-selection.md` — Decision flowchart with examples
- `rules/rate-limiting.md` — Politeness, robots.txt, concurrency
- `rules/data-extraction.md` — Selectors, normalization, validation
- `rules/anti-detection.md` — Headers, proxies, session management

## Pre-Delivery Checklist

- [ ] Strategy chosen (API > Static > Reverse > Dynamic)
- [ ] `robots.txt` checked
- [ ] Rate limiting in place (delays + semaphore)
- [ ] Retry with exponential backoff
- [ ] Data saved incrementally (not just at end)
- [ ] Error handling for network failures
- [ ] Output format validated (JSON/CSV)
- [ ] No hardcoded credentials in code

---

## Related Agents

- `executor` - General task execution (Sonnet)
- `researcher` - Research specialist (Sonnet)
- `executor-low` - Simple scraping tasks (Haiku)
