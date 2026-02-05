---
name: market-kr
description: Korean market trading rules and regulations
triggers:
  - "kospi"
  - "kosdaq"
  - "korea"
  - "한국"
---

# Korean Market Skill

## Purpose
Reference for Korean market (KOSPI/KOSDAQ) regulations, trading hours, and rules.

## Trading Hours

| Session | Time (KST) |
|---------|------------|
| Pre-Market | 08:00-09:00 |
| Regular | 09:00-15:30 |
| After-Hours | 15:40-18:00 |

## Key Rules

### Price Limits
- Daily: ±30% from previous close

### VI (Volatility Interruption)
- Static: ±10% → 2-min auction
- Dynamic: ±3-6% in 1-min → 2-min pause

### Settlement
- T+2 for equities

### Tick Sizes
| Price | Tick |
|-------|------|
| < 1,000 | 1 |
| 1,000-5,000 | 5 |
| 5,000-10,000 | 10 |
| 10,000-50,000 | 50 |
| > 50,000 | 100+ |

## Related Agent
- `domain-expert`
