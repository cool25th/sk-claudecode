# Data Extraction Patterns

> For CSS/XPath selector syntax, see `references/selector-patterns.md`.

## Extraction Helpers
```python
def safe_text(node, selector: str, default: str = "") -> str:
    """Safely extract text from a CSS selector."""
    el = node.css_first(selector)
    return el.text(strip=True) if el else default

def safe_attr(node, selector: str, attr: str, default: str = "") -> str:
    """Safely extract an attribute value."""
    el = node.css_first(selector)
    return el.attrs.get(attr, default) if el else default

def safe_list(node, selector: str) -> list[str]:
    """Extract text from all matching elements."""
    return [el.text(strip=True) for el in node.css(selector)]
```

### Table Extraction
```python
def extract_table(node) -> list[dict]:
    """Extract HTML table to list of dicts."""
    headers = [th.text(strip=True) for th in node.css("thead th")]
    rows = []
    for tr in node.css("tbody tr"):
        cells = [td.text(strip=True) for td in tr.css("td")]
        rows.append(dict(zip(headers, cells)))
    return rows
```

## Data Cleaning

```python
import re
from datetime import datetime

def clean_text(text: str) -> str:
    """Normalize whitespace and strip."""
    return re.sub(r'\s+', ' ', text).strip()

def clean_number(text: str) -> float | None:
    """Extract number from text like '$1,234.56' or '1.2K'."""
    text = text.replace(",", "").strip()
    multipliers = {"K": 1_000, "M": 1_000_000, "B": 1_000_000_000}
    for suffix, mult in multipliers.items():
        if text.upper().endswith(suffix):
            return float(text[:-1]) * mult
    try:
        return float(re.sub(r'[^\d.\-]', '', text))
    except ValueError:
        return None

def parse_date(text: str, formats: list[str] = None) -> datetime | None:
    """Try multiple date formats."""
    formats = formats or [
        "%Y-%m-%d", "%Y.%m.%d", "%d/%m/%Y",
        "%B %d, %Y", "%b %d, %Y", "%Y년 %m월 %d일",
    ]
    for fmt in formats:
        try:
            return datetime.strptime(text.strip(), fmt)
        except ValueError:
            continue
    return None

def normalize_url(url: str, base_url: str) -> str:
    """Convert relative URL to absolute."""
    from urllib.parse import urljoin
    return urljoin(base_url, url)
```

## Output Formats

### JSON Lines (Recommended for streaming)
```python
import json

def save_jsonl(items: list[dict], path: str, mode: str = "a"):
    with open(path, mode) as f:
        for item in items:
            f.write(json.dumps(item, ensure_ascii=False, default=str) + "\n")

def load_jsonl(path: str) -> list[dict]:
    with open(path) as f:
        return [json.loads(line) for line in f if line.strip()]
```

### CSV
```python
import csv

def save_csv(items: list[dict], path: str):
    if not items:
        return
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=items[0].keys())
        writer.writeheader()
        writer.writerows(items)
```

## Validation

```python
def validate_item(item: dict, required_fields: list[str]) -> bool:
    """Check that required fields are present and non-empty."""
    for field in required_fields:
        if not item.get(field):
            return False
    return True

# Usage
items = [item for item in raw_items if validate_item(item, ["title", "url"])]
```
