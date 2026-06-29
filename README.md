# Prop Pilot

Prop Pilot is a launch-focused web app for prop firm traders who want to check risk, daily drawdown, and rule pressure before placing trades.

The product is designed to feel calm, premium, modern, and trustworthy. It is a disciplined trading tool, not a flashy trading signal product.

## Current MVP

- Minimal landing screen
- Start Calculating flow
- Sidebar dashboard
- Risk Calculator
- Daily Drawdown Calculator
- Guided wizard flow
- Local storage for calculator inputs
- Copy Summary
- Share Card modal
- PNG download
- Feedback button
- Randomized Trading Insights
- Helpful term explanations/tooltips
- Dark mode and light mode
- Theme preference persistence
- Geist global typography
- Live animated atoms background
- Responsive landing and dashboard experience

## Product Flow

```txt
Landing Screen -> Start Calculating -> Dashboard with Sidebar -> Risk Calculator or Daily Drawdown Wizard -> Results -> Copy Summary or Share Card / PNG Download
```

The landing screen is intentionally minimal. It should not become a long marketing page during the MVP stage.

## Development

Run the development server:

```bash
npm run dev
```

Run verification:

```bash
npm run lint
npx tsc --noEmit
npm run test:calculations
```

## Launch QA Checklist

- Landing page flow
- Start Calculating action
- Desktop layout
- Tablet layout
- Mobile layout
- Dark mode
- Light mode
- Theme persistence after refresh
- Calculator input persistence
- Risk Calculator outputs
- Daily Drawdown outputs
- Copy Summary
- Share Card
- PNG download
- Tooltips
- Feedback button and real email address
- Animated background performance
- Reduced-motion behavior
- No placeholders, test copy, or unfinished UI

## Important Rule

Calculator formulas must remain documented and tested before changes are made.
