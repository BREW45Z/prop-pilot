# DESIGN

## Design Principles

- Build a desktop-style trading tool, not a calculator page.
- Keep calculators compact and scannable.
- Prioritize clarity over decoration.
- Make risk states visually obvious.
- Keep the interface calm and professional.

## Visual Direction

Prop Pilot should feel calm, premium, modern, and trustworthy.

It is a disciplined prop-trader tool, not a flashy crypto product, gaming interface, or overly futuristic dashboard.

The app should feel closer to compact tools such as ChatGPT, Linear, Raycast, Notion, and TradingView than a traditional form page.

The interface should be:

- Compact
- Dark by default
- Light-mode friendly
- High contrast where it matters
- Professional
- Minimal
- Easy to scan on laptop screens
- Centered
- Information-dense
- Calm and non-distracting

## Layout Principles

Current flow:

```txt
Landing Screen -> Start Calculating -> Dashboard with Sidebar -> Wizard -> Results
```

The landing screen should remain minimal and no-scroll when possible. It is not a full marketing site.

Desktop:

- Fixed left sidebar around 220-240px wide.
- Sidebar tools for MVP: Risk Calculator and Daily Drawdown.
- Main content uses the remaining width but stays centered.
- Reports should be wide horizontally and short vertically.
- Prefer compact metric grids over tall stacked cards.
- Avoid normal vertical scrolling on 13-15 inch laptop screens whenever possible.

Mobile:

- Sidebar and content can stack vertically
- Inputs remain readable
- No horizontal overflow
- Avoid tiny tap targets

## Color Direction

Dark mode:

- Default theme
- Deep navy / near-black atmosphere
- Dark slate cards and panels
- White and muted slate text
- Controlled blue and purple accents

Light mode:

- Bright gray / soft neutral background
- Light-gray card surfaces
- Charcoal text, icons, borders, and button edges
- Blue/purple should remain controlled accents, not the whole interface

Accent colors:

- Blue = normal or primary
- Green = safe
- Yellow/Orange = caution
- Red = breached or dangerous

## Typography Direction

- Geist is the global font.
- Use strong but compact headings.
- Keep labels small and readable.
- Use muted text for helper copy.
- Result values should be larger than labels.
- Avoid oversized hero text inside the app.

## Component Principles

- Calculator cards should share spacing and border styles.
- Inputs should have consistent height and focus states.
- Result cards should be compact.
- Status badges should be clear but not huge.
- Icons should be subtle and consistent.
- Card padding should stay small enough for dense dashboard layouts.
- Copy Summary and Share Card actions should feel like utility actions, not primary sales CTAs.
- Tooltips should provide lightweight in-context education without turning the UI into a dictionary.

## Animated Background

Prop Pilot uses a subtle live "atoms" background behind both the landing page and dashboard.

Rules:

- Background only, never foreground content.
- Must not reduce text readability.
- Must not block clicking, typing, scrolling, or modal interaction.
- Motion should feel calm and intelligent, not distracting.
- Must respect `prefers-reduced-motion`.
- Dark mode uses blue/purple atom accents.
- Light mode uses darker charcoal/gray atom accents.

## Active UI Goal

- Minimal
- Centered
- Compact
- Desktop-first
- No vertical scrolling on normal laptop screens when content allows
- Wide report layout instead of tall stacked cards
- Launch-ready polish without adding unnecessary features

## Future Navigation Direction

MVP sidebar tools:

- Risk Calculator
- Daily Drawdown

Future sidebar tools:

- Consistency Tracker
- Prop Health Score
- Journal
- Presets

## Mobile Rules

- Stack cards vertically.
- Keep content width fluid.
- Avoid horizontal scrolling.
- Keep inputs at usable touch size.
- Preserve clear spacing between sections.
