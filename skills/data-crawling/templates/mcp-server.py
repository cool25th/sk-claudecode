#!/usr/bin/env python3
"""
MCP Server Wrapping Template
==============================
Use when: You want to expose a scraper as an MCP tool for AI agents.
Stack: fastmcp + httpx + selectolax (or playwright)
Install: pip install fastmcp httpx selectolax

Example usage with Claude Code:
  - Add to claude_desktop_config.json as an MCP server
  - The AI agent can then call search_items() and get_item_detail()
"""

import json
from datetime import datetime

import httpx
from mcp.server.fastmcp import FastMCP
from selectolax.parser import HTMLParser

# ── MCP Server ─────────────────────────────────────────────────
mcp = FastMCP(
    "my-data-source",
    version="0.1.0",
    description="Data source scraper exposed as MCP tools",
)

# ── Configuration ──────────────────────────────────────────────
BASE_URL = "https://example.com"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
}


# ── Scraper Functions ─────────────────────────────────────────
async def _fetch(path: str, params: dict = None) -> str:
    """Internal fetch with error handling."""
    async with httpx.AsyncClient(
        base_url=BASE_URL,
        headers=HEADERS,
        timeout=30.0,
        follow_redirects=True,
    ) as client:
        resp = await client.get(path, params=params)
        resp.raise_for_status()
        return resp.text


def _parse_list(html: str) -> list[dict]:
    """Parse list page into structured data."""
    tree = HTMLParser(html)
    items = []
    for node in tree.css("div.item"):  # ← Change selector
        title_el = node.css_first("h2")
        link_el = node.css_first("a")
        desc_el = node.css_first("p")
        items.append({
            "title": title_el.text(strip=True) if title_el else "",
            "url": link_el.attrs.get("href", "") if link_el else "",
            "description": desc_el.text(strip=True) if desc_el else "",
        })
    return items


def _parse_detail(html: str) -> dict:
    """Parse detail page into structured data."""
    tree = HTMLParser(html)
    return {
        "title": tree.css_first("h1").text(strip=True) if tree.css_first("h1") else "",
        "content": tree.css_first("article").text(strip=True) if tree.css_first("article") else "",
        "date": tree.css_first("time").attrs.get("datetime", "") if tree.css_first("time") else "",
    }


def _format_items(items: list[dict]) -> str:
    """Format items for LLM-friendly output."""
    if not items:
        return "No items found."
    lines = []
    for i, item in enumerate(items, 1):
        lines.append(f"{i}. **{item['title']}**")
        if item.get("description"):
            lines.append(f"   {item['description'][:100]}")
        if item.get("url"):
            lines.append(f"   URL: {item['url']}")
        lines.append("")
    return "\n".join(lines)


# ── MCP Tools ──────────────────────────────────────────────────
@mcp.tool()
async def search_items(query: str, page: int = 1) -> str:
    """Search items from the data source.

    Args:
        query: Search keyword.
        page: Page number (starts from 1).

    Returns:
        Formatted list of matching items.
    """
    html = await _fetch("/search", params={"q": query, "page": page})
    items = _parse_list(html)
    return _format_items(items)


@mcp.tool()
async def get_item_detail(item_id: str) -> str:
    """Get detailed information about a specific item.

    Args:
        item_id: The unique identifier of the item.

    Returns:
        Detailed item information.
    """
    html = await _fetch(f"/items/{item_id}")
    detail = _parse_detail(html)
    return json.dumps(detail, ensure_ascii=False, indent=2)


@mcp.tool()
async def list_recent_items(page: int = 1) -> str:
    """List the most recent items.

    Args:
        page: Page number (starts from 1).

    Returns:
        Formatted list of recent items.
    """
    html = await _fetch("/recent", params={"page": page})
    items = _parse_list(html)
    return _format_items(items)


# ── Server Info (optional) ─────────────────────────────────────
@mcp.tool()
async def server_info() -> str:
    """Get server status and metadata."""
    return json.dumps({
        "name": "my-data-source",
        "version": "0.1.0",
        "tools": 4,
        "status": "running",
        "last_check": datetime.now().isoformat(),
    }, indent=2)


# ── Entry Point ────────────────────────────────────────────────
if __name__ == "__main__":
    mcp.run(transport="stdio")
