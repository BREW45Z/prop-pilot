export type ActiveTool = "risk" | "drawdown";
export type CopiedSummary = ActiveTool | null;
export type ThemeMode = "dark" | "light";

// Saved browser preference shapes.
export type RiskCalculatorStorage = {
  accountSize: string;
  riskPercent: string;
  stopLoss: string;
  dollarValuePerPip: string;
};

export type DailyDrawdownStorage = {
  startOfDayBalance: string;
  dailyLossPercent: string;
  currentDayPL: string;
  openTradeRisk: string;
};

export const storageKeys = {
  lastTool: "propPilot.lastTool",
  riskCalculator: "propPilot.riskCalculator",
  dailyDrawdown: "propPilot.dailyDrawdown",
  theme: "propPilot.theme",
};

export const brandAssets = {
  logoMarkDark:
    "/brand/prop_pilot_approved_dual_mode_asset_pack/logo-mark-dark-transparent.png",
  logoMarkLight:
    "/brand/prop_pilot_approved_dual_mode_asset_pack/logo-mark-light.png",
  wordmarkDark:
    "/brand/transparent-prop_pilot_transparent_logo_pack/prop-pilot-horizontal-dark-transparent.png",
  wordmarkLight:
    "/brand/transparent-prop_pilot_transparent_logo_pack/prop-pilot-horizontal-light-black-text-transparent.png",
  landingHorizontalDark:
    "/brand/transparent-prop_pilot_transparent_logo_pack/prop-pilot-horizontal-dark-transparent.png",
  landingHorizontalLight:
    "/brand/transparent-prop_pilot_transparent_logo_pack/prop-pilot-horizontal-light-black-text-transparent.png",
  socialAvatarDark:
    "/brand/prop_pilot_approved_dual_mode_asset_pack/social-avatar-dark.png",
  socialAvatarLight:
    "/brand/prop_pilot_approved_dual_mode_asset_pack/social-avatar-light.png",
};

// Wizard step labels.
export const riskSteps = ["Account", "Risk", "Trade Setup", "Results"];
export const drawdownSteps = ["Balance", "Limit", "Day Risk", "Results"];

// Shared UI class names used across the wizard.
export const inputClass =
  "h-9 rounded-lg border border-[var(--border-soft)] bg-[var(--surface-strong)] px-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-faint)] hover:border-[var(--border-strong)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]";
export const labelClass =
  "grid gap-1.5 text-xs font-semibold text-[var(--text-soft)]";
export const metricCard =
  "h-full rounded-xl border border-[var(--border-soft)] bg-[var(--surface-strong)] p-3 shadow-sm shadow-black/10 transition hover:border-[var(--border-strong)]";
export const metricLabel =
  "text-[11px] font-bold uppercase tracking-wide text-[var(--text-faint)]";
export const wizardStepPanel =
  "grid min-h-[14rem] items-center gap-4 lg:h-56 lg:grid-cols-[17rem_minmax(0,1fr)]";
export const wizardInputArea =
  "grid min-h-[8.5rem] items-stretch gap-3 rounded-xl border border-[var(--border-soft)] bg-[var(--surface-muted)] p-3 sm:grid-cols-2";

export const drawdownInsightMessages = {
  Healthy: [
    "Plenty of room remains. Stay disciplined and keep your planned risk unchanged.",
    "Capital is protected. There is no need to increase risk just because you have room left.",
    "Your account still has breathing room. Trade the plan, not the emotion.",
    "Good position. Protect the day and avoid unnecessary risk.",
  ],
  "Close to Breach": [
    "Today's objective is account preservation. Waiting for tomorrow is better than forcing another trade.",
    "You are trading with limited margin for error. Only take an A+ setup.",
    "Protect the account first. Missing one trade costs less than losing the challenge.",
    "This is not the time to chase. Protect your remaining room.",
    "One unnecessary trade can turn a bad day into a failed account.",
  ],
  Breached: [
    "Your daily loss limit has been breached. Before your next prop account, set your limits in Prop Pilot before placing the first trade.",
    "The daily rule has been broken. Use this result as a reset point, not a reason to chase.",
    "Stop here. On the next account, calculate daily risk before the first trade-not after the damage.",
    "A prop challenge is protected one decision at a time. Build the risk plan before the next session.",
  ],
};

export type DrawdownInsightStatus = keyof typeof drawdownInsightMessages;
