#!/usr/bin/env python3
"""
API Reverse Engineering Template
==================================
Use when: The site loads data via XHR/Fetch calls visible in Network tab.
         This is 10-100× faster than browser automation.
Stack: httpx (async)

How to find the API:
1. Open DevTools → Network tab → Filter by XHR/Fetch
2. Navigate the site and interact with it
3. Find JSON responses containing the data you need
4. Right-click → Copy as cURL
5. Convert to Python httpx (see below)
"""

import asyncio
import json
import random
from pathlib import Path

import httpx


# ── Configuration ──────────────────────────────────────────────
API_BASE = "https://example.com/api/internal"
OUTPUT_FILE = "output.jsonl"
DELAY_RANGE = (0.5, 1.5)

# Headers copied from browser DevTools (right-click → Copy as cURL)
HEADERS = {
    "Accept": "application/json",
    "Accept-Language": "ko-KR,ko;q=0.9",
    "X-Requested-With": "XMLHttpRequest",
    "Referer": "https://example.com/",
    # Add cookies if needed:
    # "Cookie": "session=abc123; token=xyz789",
}


# ── Helpers ────────────────────────────────────────────────────
def save_jsonl(items: list[dict], path: str):
    with open(path, "a", encoding="utf-8") as f:
        for item in items:
            f.write(json.dumps(item, ensure_ascii=False, default=str) + "\n")


# ── API Client ─────────────────────────────────────────────────
async def fetch_page(client: httpx.AsyncClient, page: int = 1) -> dict:
    """Fetch one page from the internal API."""
    resp = await client.get(
        f"{API_BASE}/items",
        params={
            "page": page,
            "limit": 20,
            # Add other params from Network tab
            # "sort": "created_at",
            # "order": "desc",
        },
    )
    resp.raise_for_status()
    return resp.json()


async def fetch_with_cursor(client: httpx.AsyncClient, cursor: str | None = None) -> dict:
    """Alternative: cursor-based pagination."""
    params = {"limit": 20}
    if cursor:
        params["cursor"] = cursor
    resp = await client.get(f"{API_BASE}/items", params=params)
    resp.raise_for_status()
    return resp.json()


# ── Transform ─────────────────────────────────────────────────
def transform_item(raw: dict) -> dict:
    """Clean and normalize raw API response item."""
    return {
        "id": raw.get("id"),
        "title": raw.get("title", "").strip(),
        "url": raw.get("url", ""),
        "created_at": raw.get("created_at"),
        # Add more fields as needed
    }


# ── Scraper ────────────────────────────────────────────────────
async def scrape_all():
    Path(OUTPUT_FILE).unlink(missing_ok=True)
    all_items = []

    async with httpx.AsyncClient(
        headers=HEADERS,
        timeout=30.0,
        follow_redirects=True,
    ) as client:
        # ── Strategy A: Page-number pagination ──
        page = 1
        while True:
            print(f"[Page {page}] Fetching...")
            try:
                data = await fetch_page(client, page)
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 404:
                    break
                raise

            # Adjust based on actual API response structure
            items_raw = data.get("data", data.get("items", data.get("results", [])))
            if not items_raw:
                print("  No more items.")
                break

            items = [transform_item(r) for r in items_raw]
            save_jsonl(items, OUTPUT_FILE)
            all_items.extend(items)
            print(f"  Got {len(items)} items (total: {len(all_items)})")

            # Check if more pages exist
            total = data.get("total", data.get("totalCount"))
            if total and len(all_items) >= total:
                break

            page += 1
            await asyncio.sleep(random.uniform(*DELAY_RANGE))

        # ── Strategy B: Cursor-based pagination (uncomment to use) ──
        # cursor = None
        # while True:
        #     data = await fetch_with_cursor(client, cursor)
        #     items_raw = data.get("data", [])
        #     if not items_raw:
        #         break
        #     items = [transform_item(r) for r in items_raw]
        #     save_jsonl(items, OUTPUT_FILE)
        #     all_items.extend(items)
        #     cursor = data.get("next_cursor", data.get("nextPageToken"))
        #     if not cursor:
        #         break
        #     await asyncio.sleep(random.uniform(*DELAY_RANGE))

    print(f"\nDone! {len(all_items)} items saved to {OUTPUT_FILE}")
    return all_items


# ── Entry Point ────────────────────────────────────────────────
if __name__ == "__main__":
    asyncio.run(scrape_all())
