#!/usr/bin/env python3
"""
Dynamic SPA Scraper Template
==============================
Use when: Content is only visible after JavaScript execution
Stack: Playwright (async)
Install: pip install playwright && playwright install chromium
"""

import asyncio
import json
import random
from pathlib import Path

from playwright.async_api import async_playwright, Page


# ── Configuration ──────────────────────────────────────────────
BASE_URL = "https://example.com"
OUTPUT_FILE = "output.jsonl"
DELAY_RANGE = (2.0, 5.0)
HEADLESS = True


# ── Helpers ────────────────────────────────────────────────────
def save_jsonl(items: list[dict], path: str):
    with open(path, "a", encoding="utf-8") as f:
        for item in items:
            f.write(json.dumps(item, ensure_ascii=False, default=str) + "\n")


# ── Extraction (runs in browser context) ──────────────────────
EXTRACT_SCRIPT = """
() => {
    // ← Customize selectors for your target
    return Array.from(document.querySelectorAll('.item')).map(el => ({
        title: el.querySelector('h2')?.textContent?.trim() || '',
        url: el.querySelector('a')?.href || '',
        description: el.querySelector('p')?.textContent?.trim() || '',
    }));
}
"""


# ── Infinite Scroll Handler ───────────────────────────────────
async def scroll_to_bottom(page: Page, max_scrolls: int = 20):
    """Scroll down until no more content loads."""
    prev_height = 0
    for i in range(max_scrolls):
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.wait_for_timeout(2000)  # Wait for content to load
        curr_height = await page.evaluate("document.body.scrollHeight")
        if curr_height == prev_height:
            print(f"  No more content after {i + 1} scrolls")
            break
        prev_height = curr_height


# ── Click-based Pagination Handler ────────────────────────────
async def click_next_page(page: Page) -> bool:
    """Click 'Next' button. Returns False if no more pages."""
    next_btn = page.locator("button.next, a.next-page, [aria-label='Next']")
    if await next_btn.count() > 0 and await next_btn.is_enabled():
        await next_btn.click()
        await page.wait_for_load_state("networkidle")
        return True
    return False


# ── Scraper ────────────────────────────────────────────────────
async def scrape_all():
    Path(OUTPUT_FILE).unlink(missing_ok=True)
    all_items = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=HEADLESS,
            args=["--disable-blink-features=AutomationControlled"],
        )
        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            locale="ko-KR",
            timezone_id="Asia/Seoul",
        )
        page = await context.new_page()

        # Remove webdriver detection
        await page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
        """)

        print(f"Navigating to {BASE_URL}")
        await page.goto(BASE_URL, wait_until="networkidle")

        # ── Choose ONE pagination strategy ──

        # Strategy A: Infinite scroll
        # await scroll_to_bottom(page)
        # items = await page.evaluate(EXTRACT_SCRIPT)
        # save_jsonl(items, OUTPUT_FILE)
        # all_items.extend(items)

        # Strategy B: Click-based pagination
        page_num = 1
        while True:
            print(f"[Page {page_num}] Extracting...")

            # Wait for items to be present
            await page.wait_for_selector(".item", timeout=10000)

            items = await page.evaluate(EXTRACT_SCRIPT)
            if not items:
                break

            save_jsonl(items, OUTPUT_FILE)
            all_items.extend(items)
            print(f"  Found {len(items)} items (total: {len(all_items)})")

            # Try next page
            has_next = await click_next_page(page)
            if not has_next:
                print("  No more pages.")
                break

            page_num += 1
            await asyncio.sleep(random.uniform(*DELAY_RANGE))

        # Optional: Take a debug screenshot
        await page.screenshot(path="debug-final.png")
        await browser.close()

    print(f"\nDone! {len(all_items)} items saved to {OUTPUT_FILE}")
    return all_items


# ── Entry Point ────────────────────────────────────────────────
if __name__ == "__main__":
    asyncio.run(scrape_all())
