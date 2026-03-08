---
name: finance
description: Finance domain guidance across market research, trading strategy, and quantitative workflow.
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
- `finance`

---

## Related Agents

- `finance` - Finance domain specialist (Opus)


## Merged from `market-us`


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
- `finance`

---

## Related Agents

- `finance` - Finance domain specialist (Opus)


## Merged from `quant`


# Quant Strategy Skill

## Purpose

Develop and validate quantitative trading strategies with proper backtesting.

## Workflow

### 1. Strategy Design
- Define entry/exit signals
- Select indicators and parameters
- Document hypothesis and rationale

### 2. Data Preparation
- Fetch historical data (point-in-time)
- Handle survivorship bias
- Adjust for splits/dividends

### 3. Backtesting
```python
# Example using vectorbt
import vectorbt as vbt
import pandas as pd

# Fetch data
price = vbt.YFData.download('SPY', start='2020-01-01').get('Close')

# Define signals
fast_ma = vbt.MA.run(price, window=10)
slow_ma = vbt.MA.run(price, window=50)

entries = fast_ma.ma_crossed_above(slow_ma)
exits = fast_ma.ma_crossed_below(slow_ma)

# Run backtest
portfolio = vbt.Portfolio.from_signals(price, entries, exits)
print(portfolio.stats())
```

### 4. Validation
- Walk-forward analysis
- Out-of-sample testing
- Parameter sensitivity

### 5. Performance Metrics
| Metric | Target |
|--------|--------|
| Sharpe Ratio | > 1.0 |
| Max Drawdown | < 20% |
| Win Rate | > 50% |
| Profit Factor | > 1.5 |

## Best Practices

- No look-ahead bias
- Include transaction costs
- Test multiple market regimes
- Document all assumptions

---

## Related Agents

- `finance` - Finance domain specialist (Opus)


## Merged from `trading`


# Trading Execution Skill

## Purpose

Execute trades efficiently with minimal market impact and proper order management.

## Workflow

### 1. Pre-Trade Checks
- [ ] Market is open
- [ ] Symbol is not halted
- [ ] Position limits OK
- [ ] Margin requirements met

### 2. Order Sizing
```python
def calculate_position_size(
    capital: float,
    risk_per_trade: float,  # e.g., 1%
    stop_loss_pct: float,   # e.g., 5%
) -> float:
    """Calculate position size based on risk."""
    risk_amount = capital * risk_per_trade
    position_value = risk_amount / stop_loss_pct
    return min(position_value, capital * 0.1)  # Max 10% per position
```

### 3. Execution Algorithms

| Algorithm | Use Case |
|-----------|----------|
| **Market** | Urgent, small orders |
| **Limit** | Price-sensitive |
| **TWAP** | Large orders, low urgency |
| **VWAP** | Match benchmark |
| **Iceberg** | Hide size |

### 4. Order Submission
```python
async def submit_order(order: Order) -> OrderResult:
    # Validate
    validate_order(order)
    
    # Check market status
    if not is_market_open():
        raise MarketClosedError()
    
    # Submit
    result = await broker.place_order(order)
    
    # Log
    logger.info(f"Order {result.order_id}: {result.status}")
    
    return result
```

### 5. Post-Trade
- Confirm fills
- Update positions
- Calculate slippage
- Log for analysis

## Risk Limits

| Limit | Value |
|-------|-------|
| Max position size | 10% of portfolio |
| Max daily trades | 50 |
| Max slippage alert | 0.5% |

## Error Handling

- Retry transient failures (3x)
- Alert on repeated failures
- Cancel on timeout
- Never retry duplicate orders

---

## Related Agents

- `finance` - Finance domain specialist (Opus)
