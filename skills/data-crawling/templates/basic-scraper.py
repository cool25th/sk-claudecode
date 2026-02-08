#!/usr/bin/env python3
"""
Basic Static HTML Scraper Template
===================================
Use when: Page data is visible in View Source (Ctrl+U)
Stack: httpx + selectolax
"""

import asyncio
import json
import random
from pathlib import Path

import httpx
from selectolax.parser import HTMLParser


# ── Configuration ──────────────────────────────────────────────
BASE_URL = "https://example.com"
OUTPUT_FILE = "output.jsonl"
DELAY_RANGE = (1.0, 3.0)
MAX_PAGES = 50
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
}


# ── Helpers ────────────────────────────────────────────────────
def safe_text(node, selector: str, default: str = "") -> str:
    el = node.css_first(selector)
    return el.text(strip=True) if el else default


def safe_attr(node, selector: str, attr: str, default: str = "") -> str:
    el = node.css_first(selector)
    return el.attrs.get(attr, default) if el else default


def save_jsonl(items: list[dict], path: str):
    with open(path, "a", encoding="utf-8") as f:
        for item in items:
            f.write(json.dumps(item, ensure_ascii=False, default=str) + "\n")


# ── Scraper ────────────────────────────────────────────────────
async def fetch_page(client: httpx.AsyncClient, url: str) -> str:
    """Fetch a page with retry logic."""
    for attempt in range(3):
        try:
            resp = await client.get(url)
            resp.raise_for_status()
            return resp.text
        except (httpx.HTTPStatusError, httpx.ConnectError) as e:
            if attempt == 2:
                raise
            wait = 2 ** attempt
            print(f"  Retry {attempt + 1}/3 after {wait}s: {e}")
            await asyncio.sleep(wait)


def parse_page(html: str) -> list[dict]:
    """Extract items from HTML. Customize selectors for your target."""
    tree = HTMLParser(html)
    items = []

    for node in tree.css("div.item"):  # ← Change selector
        item = {
            "title": safe_text(node, "h2.title"),
            "url": safe_attr(node, "a", "href"),
            "description": safe_text(node, "p.description"),
        }
        if item["title"]:  # Skip empty items
            items.append(item)

    return items


async def scrape_all():
    """Main scraper loop with pagination."""
    all_items = []
    Path(OUTPUT_FILE).unlink(missing_ok=True)  # Clear previous output

    async with httpx.AsyncClient(
        headers=HEADERS,
        timeout=30.0,
        follow_redirects=True,
    ) as client:
        for page in range(1, MAX_PAGES + 1):
            url = f"{BASE_URL}/list?page={page}"  # ← Change URL pattern
            print(f"[{page}/{MAX_PAGES}] {url}")

            html = await fetch_page(client, url)
            items = parse_page(html)

            if not items:
                print("  No more items. Done.")
                break

            save_jsonl(items, OUTPUT_FILE)
            all_items.extend(items)
            print(f"  Found {len(items)} items (total: {len(all_items)})")

            await asyncio.sleep(random.uniform(*DELAY_RANGE))

    print(f"\nDone! {len(all_items)} items saved to {OUTPUT_FILE}")
    return all_items


# ── Entry Point ────────────────────────────────────────────────
if __name__ == "__main__":
    asyncio.run(scrape_all())
