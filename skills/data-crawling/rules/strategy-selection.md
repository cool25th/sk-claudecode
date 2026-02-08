# Strategy Selection Guide

## Decision Matrix

```
┌──────────────────────────────────────────────────────────────┐
│                   STRATEGY SELECTION                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Check for Public API                                     │
│     └─ docs page? /api/ endpoint? GraphQL?                   │
│     └─ YES → Use API client (templates/api-reverse.py)       │
│                                                              │
│  2. View Page Source (Ctrl+U)                                │
│     └─ Data visible in raw HTML?                             │
│     └─ YES → Static scraper (templates/basic-scraper.py)     │
│                                                              │
│  3. Inspect Network Tab (F12 → Network → XHR/Fetch)         │
│     └─ JSON responses from internal API?                     │
│     └─ YES → Reverse engineer API (templates/api-reverse.py) │
│                                                              │
│  4. Last Resort                                              │
│     └─ Content only after JS execution?                      │
│     └─ YES → Browser automation (templates/dynamic-scraper)  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Comparison

| Approach | Speed | Reliability | Complexity | When to Use |
|----------|-------|-------------|------------|-------------|
| **Public API** | ⚡⚡⚡ | ⚡⚡⚡ | Low | API docs available |
| **Static HTML** | ⚡⚡⚡ | ⚡⚡ | Low | Data in page source |
| **Reverse API** | ⚡⚡⚡ | ⚡⚡ | Medium | XHR/fetch in Network tab |
| **Playwright** | ⚡ | ⚡ | High | JS-only rendering |

## How to Detect

### Check for Public API
```bash
# Common API patterns
curl -s https://example.com/api/ | head
curl -s https://example.com/graphql -X POST -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { types { name } } }"}'
```

### Check if Static
```bash
# If data is in raw HTML, static scraping works
curl -s https://example.com/page | grep -c "data-you-want"
```

### Find Hidden APIs (Network Tab)
1. Open DevTools → Network tab → Filter by XHR/Fetch
2. Navigate the site, click through pages
3. Look for JSON responses containing the data you need
4. Copy as cURL → convert to Python httpx

### Converting cURL to Python
```python
# From: curl 'https://api.example.com/data?page=1' \
#   -H 'Accept: application/json' \
#   -H 'Cookie: session=abc123'

import httpx

resp = httpx.get(
    "https://api.example.com/data",
    params={"page": 1},
    headers={
        "Accept": "application/json",
        "Cookie": "session=abc123",
    },
)
```

## Site-Type Examples

| Site Type | Detection | Approach |
|-----------|-----------|----------|
| Blog / News | View Source has `<article>` | Static |
| E-commerce (SSR) | View Source has products | Static |
| React SPA | View Source is empty `<div id="root">` | Network tab → Reverse API |
| Government portal | Old HTML, tables | Static |
| Dashboard (auth) | Login required + SPA | Playwright + cookies |
| Infinite scroll | No page param, scroll loads more | Playwright scroll / API cursor |
