# CALCULATIONS

Every calculation must be documented before coding.

## Risk Amount Formula

```txt
riskAmount = accountSize * (riskPercent / 100)
```

Example:

```txt
Account Size = 5000
Risk = 10%
Risk Amount = 500
```

## Position Size Formula

```txt
positionSizeLots = riskAmount / (stopLossPips * dollarValuePerPip)
```

Example:

```txt
Risk Amount = 500
Stop Loss = 100
Dollar Value per Pip = 10
Position Size = 0.50 lots
```

## Daily Drawdown Formula Placeholder

Current MVP formula:

```txt
dailyLossLimit = startOfDayBalance * (dailyLossPercent / 100)
lossUsedToday = currentDayPL < 0 ? abs(currentDayPL) : 0
remainingRoom = dailyLossLimit + currentDayPL
remainingRoomAfterOpenRisk = remainingRoom - openTradeRisk
```

Status logic:

```txt
if remainingRoom <= 0:
  Breached
else if remainingRoom <= dailyLossLimit * 0.25:
  Close to Breach
else:
  Healthy
```

## Consistency Formula Placeholder

Not coded yet.

Before coding, define:

- Total profit input
- Largest winning day input
- Allowed consistency %
- Pass/fail threshold

Possible formula:

```txt
largestDayPercent = largestWinningDay / totalProfit * 100
```

## Edge Cases

- Stop Loss must not be zero when calculating lot size.
- Dollar Value per Pip must not be zero.
- Negative account balances should be prevented in the UI.
- Positive Current Day P/L should not count as loss used.
- Daily Loss Limit % should be clamped between 0 and 100.
- Remaining room at or below zero means breached.

## Testing

Run calculation tests with:

```bash
npm run test:calculations
```
