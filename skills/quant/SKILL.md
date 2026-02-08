---
name: quant-strategy
description: Quantitative trading strategy development and backtesting
triggers:
  - "quant"
  - "strategy"
  - "backtest"
---

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

- `finance-developer` - Finance development (Sonnet)
- `finance-expert` - Financial analysis (Opus)
