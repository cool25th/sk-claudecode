---
name: trading-execution
description: Trade execution and order management
triggers:
  - "execute"
  - "order"
  - "trade"
---

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
