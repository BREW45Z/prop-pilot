# FEATURES

## Risk Calculator

Purpose:
Help traders calculate risk amount and position size before taking a trade.

Inputs:

- Account Size
- Risk %
- Stop Loss in pips
- Dollar Value per Pip

Outputs:

- Risk Amount
- Position Size
- Copy Summary text
- Share Card PNG

Formula/Logic:

```txt
riskAmount = accountSize * (riskPercent / 100)
positionSizeLots = riskAmount / (stopLossPips * dollarValuePerPip)
```

MVP Status:
Built.

Current implementation includes:

- Guided wizard flow
- Local input persistence
- Helpful term explanations/tooltips
- Copy Summary
- Share Card modal
- PNG download
- Responsive dashboard placement

## Daily Drawdown Calculator

Purpose:
Help traders understand daily loss room before breaching a prop firm daily drawdown rule.

Inputs:

- Start of Day Balance
- Daily Loss Limit %
- Current Day P/L
- Open Trade Risk

Outputs:

- Max Daily Loss Allowed
- Loss Already Used Today
- Remaining Loss Room
- After Open Risk
- Status
- Trading Insight
- Copy Summary text
- Share Card PNG

Formula/Logic:

```txt
dailyLossLimit = startOfDayBalance * (dailyLossPercent / 100)
lossUsedToday = currentDayPL < 0 ? abs(currentDayPL) : 0
remainingRoom = dailyLossLimit + currentDayPL
remainingRoomAfterOpenRisk = remainingRoom - openTradeRisk
```

MVP Status:
Built.

Current implementation includes:

- Guided wizard flow
- Local input persistence
- Helpful term explanations/tooltips
- Status-based Trading Insight messages
- Randomized insight selection when the user reaches results
- Stable insight text while the user is reading
- Copy Summary
- Share Card modal
- PNG download

Trading Insights focus on discipline, risk control, and avoiding rule breaches. They do not provide market predictions, trade signals, or buy/sell instructions.

### Before You Trade Checklist

Purpose:
Turn the Daily Drawdown result into a fast go/no-go check a trader can glance
at before entering a trade. Supports the discipline brand and gives traders a
reason to open Prop Pilot before every session (stickiness).

Placement:
On the Daily Drawdown results step, near the Status card.

The checklist shows three checks. Each is a pass (ok) or a warning, based only
on values the calculator already produces. No new calculation is introduced.

Checks:

```txt
1. Within daily loss limit
   ok if remainingRoom > 0
   warn otherwise ("Daily loss limit is breached")

2. Room after open risk
   ok if remainingAfterOpenRisk > 0
   warn otherwise ("Your open trade risk would breach the limit")

3. Buffer health
   ok if status is "Healthy"
   warn if status is "Close to Breach" or "Breached"
```

Display:

- A small "Before You Trade" heading.
- Each row: a check or warning icon, plus short plain-English text.
- Ok rows use the existing emerald color, warn rows use amber, matching the
  status colors already in the app.

Rules:

- Display only. Reuse existing values (remainingRoom, remainingAfterOpenRisk,
  drawdownStatus). Do not change any formula.
- No new dependencies.
- Keep copy human and plain (no em dashes).

MVP Status:
Planned, building now.

## Current MVP Product Features

The launch-polished MVP also includes:

- Minimal landing screen
- Start Calculating action
- Sidebar dashboard
- Dark mode and light mode
- Theme preference persistence
- Geist global typography
- Live animated atoms background
- Feedback button
- Responsive landing and dashboard experience

## Lightweight Education

Key terms now include concise helper explanations/tooltips:

- Account Size
- Risk %
- Stop Loss
- Dollar Value per Pip
- Position Size
- Start of Day Balance
- Daily Loss Limit
- Current Day P/L
- Open Trade Risk
- Remaining Room
- Remaining Room After Open Risk

This is lightweight in-context education, not yet a full glossary or learning center.

## Prop Health Score

Purpose:
Become Prop Pilot's future signature feature by summarizing a trader's account safety, rule pressure, and risk behavior into one clear score.

Inputs:

- Account metrics
- Daily drawdown room
- Max loss room
- Recent risk behavior
- Consistency data

Outputs:

- Prop Health Score
- Risk state
- Suggested action
- Rule pressure summary

Formula/Logic:
Placeholder. Must be researched, documented, and validated before coding.

MVP Status:
Future signature feature.

## Consistency Calculator

Purpose:
Help traders check whether one trading day is too large compared with total profits.

Inputs:

- Total Profit
- Largest Winning Day
- Consistency Limit %

Outputs:

- Largest Day %
- Pass/Fail Status
- Allowed Maximum Winning Day

Formula/Logic:
Placeholder. Must be documented before coding.

MVP Status:
Not built.

## Presets

Purpose:
Help traders quickly load common prop firm rules without retyping values.

Inputs:

- Firm name
- Challenge size
- Daily loss rule
- Max loss rule
- Profit target

Outputs:

- Loaded calculator defaults
- Rule summary

Formula/Logic:
Placeholder. Presets should not be added until core calculators are stable.

MVP Status:
Future.

## Challenge Planner

Purpose:
Help traders plan target profit, risk per trade, and estimated trades needed to pass a challenge.

Inputs:

- Starting Balance
- Profit Target %
- Risk Per Trade %
- Expected Average R Multiple

Outputs:

- Profit Target Amount
- Estimated Trades Needed
- Suggested Risk Plan

Formula/Logic:
Placeholder. Must be documented before coding.

MVP Status:
Not built.

## Scaling Calculator

Purpose:
Help funded traders understand possible account scaling milestones.

Inputs:

- Current Account Size
- Scaling Target
- Required Profit %
- Time Period

Outputs:

- Required Profit Amount
- Projected Scaled Balance
- Progress Status

Formula/Logic:
Placeholder. Must be documented before coding.

MVP Status:
Not built.

## Trading Journal

Purpose:
Help traders record trades, review behavior, and track rule discipline.

Inputs:

- Trade Pair/Symbol
- Entry
- Stop Loss
- Take Profit
- Risk
- Result
- Notes

Outputs:

- Trade History
- Win/Loss Summary
- Risk Review

Formula/Logic:
Placeholder. Journal data model must be documented before coding.

MVP Status:
Not built.
