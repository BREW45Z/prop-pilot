# Distribution

## Purpose

This document defines the first practical distribution loop for Prop Pilot.

The goal is to help traders share useful calculator results naturally, without adding heavy product features, user accounts, tracking, ads, or backend systems.

---

## 1. Shareable Calculator Result

After a user calculates risk or daily drawdown, Prop Pilot makes the result easy to copy.

The copied text should be simple, readable, and useful inside trading communities such as Discord, Telegram, X, and prop firm groups.

Example Risk Calculator share text:

```txt
I'm risking $20 on a $2,000 account with a 20 pip stop. Position size: 0.10 lots. Calculated with Prop Pilot.
```

Example Daily Drawdown share text:

```txt
Daily loss limit: $1,500. Loss used today: $700. Remaining room: $800. Calculated with Prop Pilot.
```

The purpose is not to create spam. The purpose is to make useful trading context easy to share.

---

## 2. Growth Loop Logic

The first growth loop should be simple:

1. User calculates a risk or drawdown result.
2. User copies the result.
3. User shares it in a trading community.
4. Another trader sees the Prop Pilot mention.
5. That trader visits Prop Pilot.
6. The new trader uses the calculator.
7. The new trader shares their own result.

Loop:

```txt
User calculates -> copies result -> shares in trading community -> another trader sees Prop Pilot -> visits the app -> uses calculator -> shares their own result
```

This creates a lightweight distribution loop around useful output, not forced promotion.

---

## 3. MVP Implementation Plan

Current MVP implementation:

- Copy Summary is available from the result screen.
- Share Card modal is available from the result screen.
- PNG download is available for branded report cards.
- Result text stays simple.
- Plain text remains the first sharing format.
- Do not require a user account.
- Do not add a database.
- Do not add tracking yet.
- Do not add aggressive ads.
- Keep calculator logic unchanged.
- Make the copied result useful even without marketing language.

The first version supports both clipboard text and a downloadable branded PNG.

---

## 4. Technical Notes

Likely implementation areas:

- Current dashboard wizard: `components/PropPilotWizard.tsx`
- Legacy/simple Risk Calculator: `components/Calculator.tsx`
- Legacy/simple Daily Drawdown Calculator: `components/DailyDrawdownCalculator.tsx`
- Optional helper later: `lib/shareText.ts`

Possible future helper responsibility:

```txt
Input calculator values -> return clean shareable text
```

The helper should not calculate new values. It should only format values that already come from existing calculator logic.

---

## 5. Rules

- Do not change calculator formulas.
- Do not add signup.
- Do not add authentication.
- Do not add a backend.
- Do not add a database.
- Do not install packages.
- Do not edit app UI unless explicitly approved.
- Do not add tracking in the MVP.
- Only document the distribution loop before implementation.

---

## Current Status

- Copy Summary: implemented.
- Share Card modal: implemented.
- PNG download: implemented.
- Tracking: not implemented.
- Social sharing integrations: not implemented.
- User accounts: not implemented.

## Next Priority

After launch, observe whether traders actually use Copy Summary and Share Card.

Future distribution work should stay lightweight:

- Improve share text based on user feedback.
- Replace placeholder feedback email with a real address.
- Consider social integrations only after validating real sharing behavior.
- Avoid aggressive referral or spam mechanics in the MVP.

---

## 6. Technical Distribution Roadmap (Beyond Social Media)

Social posting brings traffic once. The technical work below makes Prop Pilot
**get discovered on its own and spread through its own output** — compounding
over time. All items below respect the MVP rules (no login, no database, no
backend, no heavy packages).

Ranked by impact and effort.

### 6.1 SEO Landing Pages (highest long-term lever)

Traders search for things like "prop firm drawdown calculator", "FTMO lot size
calculator", "daily loss limit calculator". Prop Pilot currently has one page
and ranks for almost nothing.

Plan:

- Add lightweight, static landing pages, one per real search intent, using the
  existing `publicRoutes` structure in `app/sitemap.ts`.
- Each page targets a specific search phrase, explains the concept plainly, and
  links into the matching calculator.
- No database needed — pages are static content.

Why it helps distribution: free, evergreen traffic from Google that grows while
you sleep, aimed at people already looking for exactly this tool.

### 6.2 Shareable Result URLs

Let a trader share a link that reopens the calculator pre-filled with their
exact numbers.

Plan:

- Encode calculator state into the URL (e.g. `apropilot.com/r/...`) — no
  database; the values live in the link itself.
- Recipient clicks and lands on a pre-filled result they can tweak.

Why it helps distribution: turns every calculation into a spreadable artifact.
The share carries the product, not just a screenshot.

#### 6.2.1 Implementation Plan (first version)

Smallest safe version. No new packages, no backend, no database, no formula
changes. Uses the browser's built-in `URLSearchParams`.

Target file: `components/PropPilotWizard.tsx`.

URL shape (query params on the homepage, so no new routes needed):

```txt
Risk:     /?tool=risk&account=50000&risk=1&sl=50&pip=10
Drawdown: /?tool=drawdown&balance=50000&limit=5&pl=-200&open=100
```

Two parts:

1. **Read on load.** A one-time effect checks the URL for these params. If
   present, it fills the matching inputs and selects the right tool. Runs
   alongside the existing localStorage load. URL values take priority over
   saved values when a share link is opened.

2. **Write ("Copy Link" button).** A helper builds the URL from the current
   inputs and copies it to the clipboard, placed next to the existing
   Copy Summary / Share Card actions. Reuses the same clipboard + "Copied!"
   feedback pattern already in the component.

Safety rules for this feature:

- Validate/parse every incoming param the same careful way saved values are
  parsed today (ignore anything malformed; never trust raw URL input).
- Do not change any calculation.
- Do not add packages.
- Keep the URL human-readable (plain query params, not encoded blobs) so links
  look trustworthy when shared.

Rollout: implement in small approved steps — read first, then the button,
type-check after each, review live, then commit.

### 6.3 Dynamic Share-Card / OG Images

Auto-generate a unique social-preview image that shows the trader's actual
result.

Plan:

- Use Next.js image generation to render a per-result Open Graph image.
- Ensure every Share Card and shared link carries a clear link back to the app
  (short URL or QR).

Why it helps distribution: a preview showing a real number is far more
clickable than a static logo. Every share becomes a click funnel.

### 6.4 PWA / Add to Home Screen

Make Prop Pilot installable like a native app.

Plan:

- Add a web app manifest and a minimal service worker.
- Enables "Add to Home Screen" on mobile.

Why it helps distribution: one-tap access means traders return daily, and
daily-use tools get recommended word-of-mouth.

### 6.5 Performance / Core Web Vitals

Google ranks faster sites higher; traders bounce from slow ones.

Plan:

- Optimize large brand PNG assets (compress / right-size).
- Lazy-load non-critical assets.
- Consider splitting the large `PropPilotWizard.tsx` for faster loads (later).

Why it helps distribution: speed lifts both SEO ranking and first-impression
trust.

### 6.6 Embeddable Widget (later)

A small calculator others can embed in blogs, Discord, or YouTube descriptions.

Why it helps distribution: earns backlinks and reach from other creators.
Mark as later — validate the simpler loops first.

---

## 7. Recommended Starting Point

Highest ROI while staying MVP-safe:

1. **SEO landing pages (6.1)** — compounding discovery, no backend.
2. **Shareable result URLs (6.2)** — every calc becomes spreadable, no backend.

Both fit the "no bloat, no backend" rules and reinforce the existing share loop
in sections 1–3.
