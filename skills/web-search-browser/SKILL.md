---
name: web-search-browser
description: Browser-based web search using agent-browser CLI or Chrome. Use when built-in WebSearch is insufficient, when pages require JavaScript rendering, when you need full page text extraction, or when search results need interactive exploration. Preferred over WebSearch for JS-heavy sites, SPAs, and deep research tasks.
---

# Browser-Based Web Search

Use **agent-browser CLI** (or Chrome via CDP) for web searches that go beyond what the built-in `WebSearch` tool can provide.

## When to Use This Over WebSearch

| Scenario | WebSearch | agent-browser |
|----------|-----------|---------------|
| Quick factual lookup | ✅ Preferred | Overkill |
| JS-rendered page (SPA, React docs) | ❌ Often empty | ✅ Full render |
| Full page text extraction | ❌ Summary only | ✅ Complete text |
| Multi-page deep research | ❌ Single query | ✅ Navigate + extract |
| Login-required content | ❌ No auth | ✅ Session/cookie support |
| CAPTCHA / bot-protected sites | ❌ Blocked | ✅ Real Chrome fingerprint |

## Quick Start — Search & Extract

```bash
# 1. Search Google
agent-browser open "https://www.google.com/search?q=react+server+components+2026" \
  && agent-browser wait --load networkidle \
  && agent-browser snapshot -i

# 2. Click a result (use @ref from snapshot)
agent-browser click @e3

# 3. Wait for page load and extract text
agent-browser wait --load networkidle
agent-browser get text body
```

## Core Search Workflow

### Step 1: Search

```bash
# Google Search (most comprehensive)
agent-browser open "https://www.google.com/search?q=YOUR+QUERY+HERE" \
  && agent-browser wait --load networkidle \
  && agent-browser snapshot -i

# DuckDuckGo (no CAPTCHA, privacy-friendly — RECOMMENDED)
agent-browser open "https://duckduckgo.com/?q=YOUR+QUERY+HERE" \
  && agent-browser wait --load networkidle \
  && agent-browser snapshot -i

# Bing (good alternative)
agent-browser open "https://www.bing.com/search?q=YOUR+QUERY+HERE" \
  && agent-browser wait --load networkidle \
  && agent-browser snapshot -i
```

> **Recommendation**: Use DuckDuckGo as default search engine to avoid Google CAPTCHA issues.
> Fall back to Google only when DuckDuckGo results are insufficient.

### Step 2: Parse Results

After `snapshot -i`, you'll see interactive elements with refs:

```
@e1 [link] "React Server Components – Official Docs"
@e2 [link] "Understanding RSC in 2026 – Blog Post"
@e3 [link] "Next.js App Router with RSC – Tutorial"
```

### Step 3: Visit & Extract

```bash
# Click the most relevant result
agent-browser click @e1
agent-browser wait --load networkidle

# Extract full page text
agent-browser get text body > page_content.txt

# Or get structured snapshot
agent-browser snapshot -i
```

### Step 4: Multi-Page Research

```bash
# Go back and visit another result
agent-browser open "https://duckduckgo.com/?q=YOUR+QUERY+HERE"
agent-browser wait --load networkidle
agent-browser snapshot -i
agent-browser click @e2
agent-browser wait --load networkidle
agent-browser get text body > page2_content.txt
```

## Advanced Patterns

### Targeted Documentation Search

```bash
# Search within a specific site
agent-browser open "https://duckduckgo.com/?q=site%3Adocs.python.org+asyncio+gather"
agent-browser wait --load networkidle && agent-browser snapshot -i

# Navigate directly to docs (for known documentation sites)
agent-browser open "https://react.dev/reference/rsc/server-components"
agent-browser wait --load networkidle
agent-browser get text body
```

### GitHub Search

```bash
# Search GitHub repos
agent-browser open "https://github.com/search?q=agent-browser+language%3ATypeScript&type=repositories"
agent-browser wait --load networkidle && agent-browser snapshot -i

# Search GitHub code
agent-browser open "https://github.com/search?q=useServerAction+language%3ATypeScript&type=code"
agent-browser wait --load networkidle && agent-browser snapshot -i
```

### npm Package Research

```bash
# Search npm
agent-browser open "https://www.npmjs.com/search?q=mcp+server"
agent-browser wait --load networkidle && agent-browser snapshot -i

# View package details
agent-browser click @e1
agent-browser wait --load networkidle
agent-browser get text body
```

### Stack Overflow Search

```bash
agent-browser open "https://duckduckgo.com/?q=site%3Astackoverflow.com+playwright+wait+for+element"
agent-browser wait --load networkidle && agent-browser snapshot -i
```

## Batch Search (Multiple Queries)

```bash
# Use batch mode for multiple searches
echo '[
  ["open", "https://duckduckgo.com/?q=react+19+new+features"],
  ["wait", "--load", "networkidle"],
  ["screenshot", "search1.png"]
]' | agent-browser batch --json
```

## Fallback Strategy

If agent-browser is not installed or fails:

1. **Try WebSearch** (built-in Claude Code tool) for quick lookups
2. **Try WebFetch** for direct URL content retrieval
3. **Try curl** for API-based content (REST endpoints, JSON)

```bash
# Check if agent-browser is available
which agent-browser || echo "Not installed — falling back to WebSearch"

# Install if needed
npm i -g agent-browser && agent-browser install
```

## Tips

- **Always wait for networkidle** after navigation — pages often load data async
- **Use DuckDuckGo** as primary search engine to avoid CAPTCHA
- **Re-snapshot after navigation** — refs are invalidated on page change
- **Chain commands with `&&`** when you don't need intermediate output
- **Use `--session`** for parallel research across multiple topics
- **Close sessions when done**: `agent-browser close`

## Related Skills

- `agent-browser` — Full browser automation reference
- `data-crawling` — Systematic web data extraction
- `research` — Orchestrated parallel research workflows
- `deepsearch` — Deep codebase search (internal, not web)

## Related Agents

- `researcher` — External docs & reference research (uses this skill for browser-based search)
- `e2e-runner` — End-to-end browser testing
