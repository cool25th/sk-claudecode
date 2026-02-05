---
name: docs
description: Documentation writing and technical writing
triggers:
  - "document"
  - "readme"
  - "docs"
  - "write"
---

# Documentation Skill

## Purpose
Create clear, comprehensive documentation for code, APIs, and projects.

## README Template

```markdown
# Project Name

Brief description.

## Features
- Feature 1
- Feature 2

## Quick Start

\`\`\`bash
npm install
npm start
\`\`\`

## Usage

...

## API Reference

...

## License

MIT
```

## API Documentation

### Endpoint Format
```markdown
## GET /api/users

Get all users.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| page | int | No | Page number |

**Response:**
\`\`\`json
{ "users": [...] }
\`\`\`
```

## Code Comments

### Good
```python
def calculate_vwap(prices, volumes):
    """
    Calculate Volume-Weighted Average Price.
    
    Args:
        prices: List of trade prices
        volumes: List of trade volumes
    
    Returns:
        float: VWAP value
    """
```

### Bad
```python
# Calculate VWAP
def calc(p, v):
    ...
```

## Best Practices
- Write for your audience
- Include examples
- Keep it up to date
- Use consistent formatting

## Related Agent
- `writer`
