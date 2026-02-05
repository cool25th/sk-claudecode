---
name: market-us
description: US market trading rules and regulations
triggers:
  - "nyse"
  - "nasdaq"
  - "us market"
  - "sec"
---

# US Market Skill

## Purpose
Reference for US market (NYSE/NASDAQ) regulations, trading hours, and SEC rules.

## Trading Hours (Eastern Time)

| Session | Time (ET) |
|---------|-----------|
| Pre-Market | 04:00-09:30 |
| Regular | 09:30-16:00 |
| After-Hours | 16:00-20:00 |

## Key Rules

### PDT Rule
- 4+ day trades in 5 days = Pattern Day Trader
- Requires $25,000 minimum equity

### Circuit Breakers
| Level | Drop | Action |
|-------|------|--------|
| 1 | 7% | 15-min halt |
| 2 | 13% | 15-min halt |
| 3 | 20% | Market close |

### Settlement
- T+1 for equities (since May 2024)

### Wash Sale Rule
- 30-day window for tax purposes

## Related Agent
- `domain-expert-us`
