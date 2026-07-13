# Prop Pilot Development Log

This document records the evolution of Prop Pilot from the first MVP through public launch.

Each entry should include:

- Date
- Objective
- What was completed
- Technical decisions
- Verification performed
- Files affected
- Roadmap progress
- Next priorities

---

# Session 01 - Desktop Dashboard Architecture

**Date**
2026-06-28

## Objective

Move Prop Pilot from a simple calculator interface toward a professional desktop-style trading dashboard while preserving the existing calculator logic.

## Completed

- Converted the UI direction from a basic calculator page into a desktop-style app shell.
- Added a fixed left sidebar for primary navigation.
- Added MVP sidebar tools:
  - Risk Calculator
  - Daily Drawdown
- Added future sidebar placeholders:
  - Consistency Tracker
  - Prop Health Score
  - Journal
  - Presets
- Restored wizard behavior inside each active sidebar tool.
- Created separate wizard step flows for Risk Calculator and Daily Drawdown.
- Made each tool remember its own current wizard step.
- Centered the active wizard card in the main content area.
- Made Steps 1, 2, and 3 share a consistent visual card size.
- Allowed Step 4 Results to be larger because it displays report output.
- Improved the step indicator with numbered circles and connecting progress lines.
- Added sidebar icons and increased their size.
- Adjusted top spacing around the page heading and main wizard card.
- Updated product documentation to reflect the new desktop dashboard direction.

## Technical Decisions

- The sidebar should remain fixed on desktop so the app feels like a stable desktop tool.
- Risk Calculator and Daily Drawdown should be separate sidebar tools, not one giant combined wizard.
- Each tool should keep its own wizard state so switching tools does not reset progress.
- Calculation logic must stay in `lib/calculations.ts`.
- UI components can change freely, but formulas and helper function behavior should remain stable.
- Prop Health Score remains a future signature feature, not part of the current MVP implementation.
- The MVP layout should prioritize compact desktop usability while remaining responsive on mobile.

## Verification

The following checks were run during the session:

```bash
npm run lint
npx tsc --noEmit
npm run test:calculations
```

All checks passed after the final UI changes.

## Files Affected

- `trading-calc/components/PropPilotWizard.tsx`
- `docs/PRODUCT.md`
- `docs/DESIGN.md`
- `docs/FEATURES.md`
- `docs/ROADMAP.md`
- `docs/USER_FLOW.md`
- `docs/VISION.md`

## Roadmap Progress

- Phase 1 MVP Calculator: In progress.
- Risk Calculator: functional and connected to wizard UI.
- Daily Drawdown Calculator: functional and connected to wizard UI.
- Desktop dashboard shell: first pass completed.
- Prop Health Score: documented as a future signature feature.

## Next Priorities

- Visually test the dashboard across common laptop screen sizes.
- Polish spacing and alignment after browser review.
- Confirm mobile behavior for sidebar and wizard layout.
- Decide whether to extract repeated UI patterns into smaller components.
- Continue keeping calculation logic documented and tested before adding new tools.

---

# Session 02 - Launch Polish and Product Readiness

**Date**
2026-06-29

## Objective

Move Prop Pilot from a functional MVP dashboard toward a calmer, more premium, launch-ready product experience while preserving all calculator formulas.

## Completed

- Added a minimal landing screen before the dashboard.
- Added Start Calculating flow into the app dashboard.
- Added Geist as the global app font.
- Added dark and light theme support.
- Added theme preference persistence.
- Fixed hydration mismatch caused by early theme handling.
- Added a subtle animated "living atoms" background.
- Refined animated background speed and visibility.
- Added reduced-motion support for animation.
- Fixed dashboard layout and sidebar spacing issues.
- Added Back to Home from the dashboard.
- Refined light mode from white to bright gray / soft neutral surfaces.
- Improved light-mode borders, icons, and button clarity.
- Improved Daily Drawdown Trading Insight behavior.
- Added randomized Trading Insight messages by drawdown status.
- Added slide-in animation for Trading Insight.
- Added concise helper explanations/tooltips for key trading terms.
- Retained Copy Summary, Share Card modal, PNG download, and feedback button improvements.

## Technical Decisions

- Calculation formulas were deliberately not changed.
- Light/dark mode should be handled by the client UI without causing hydration mismatch.
- The animated background should remain CSS-based and lightweight instead of using a heavy animation dependency.
- The landing page should stay minimal and should not become a full marketing website during the MVP stage.
- Share Card preview should keep its dark branded appearance even when the app is in light mode.
- Light mode should use bright gray and charcoal details, not plain white or a simple inversion of dark mode.

## Verification

The following checks were run after the launch-polish work:

```bash
npm run lint
npx tsc --noEmit
npm run test:calculations
```

All checks passed.

## Files Affected

- `trading-calc/app/layout.tsx`
- `trading-calc/app/page.tsx`
- `trading-calc/app/globals.css`
- `trading-calc/components/PropPilotWizard.tsx`

## Roadmap Progress

- Phase 1 MVP Calculator: launch polish complete.
- Landing screen: added.
- Dashboard wizard: retained and visually refined.
- Dark/light themes: added and persisted.
- Growth loop foundations: Copy Summary, Share Card, and PNG download retained.
- Final QA and launch preparation: now the immediate next stage.

## Next Priorities

- Final manual QA across desktop, tablet, and mobile.
- Verify dark mode and light mode after refresh.
- Confirm calculator input persistence.
- Confirm Risk Calculator and Daily Drawdown known-output examples.
- Test Copy Summary, Share Card, and PNG download.
- Confirm tooltip readability.
- Replace placeholder feedback email with a real address.
- Check animated background performance and reduced-motion behavior.
- Remove any unfinished copy or placeholder UI before public launch.
