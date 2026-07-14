import {
  drawdownInsightMessages,
  type ActiveTool,
  type DailyDrawdownStorage,
  type DrawdownInsightStatus,
  type RiskCalculatorStorage,
  type ThemeMode,
} from "./wizardConstants";

// Runtime guards keep localStorage data safe before using it.
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isString(value: unknown) {
  return typeof value === "string";
}

export function isActiveTool(value: unknown): value is ActiveTool {
  return value === "risk" || value === "drawdown";
}

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "dark" || value === "light";
}

export function isRiskCalculatorStorage(
  value: unknown,
): value is RiskCalculatorStorage {
  return (
    isRecord(value) &&
    isString(value.accountSize) &&
    isString(value.riskPercent) &&
    isString(value.stopLoss) &&
    isString(value.dollarValuePerPip)
  );
}

export function isDailyDrawdownStorage(
  value: unknown,
): value is DailyDrawdownStorage {
  return (
    isRecord(value) &&
    isString(value.startOfDayBalance) &&
    isString(value.dailyLossPercent) &&
    isString(value.currentDayPL) &&
    isString(value.openTradeRisk)
  );
}

export function getDrawdownInsightStatus(
  status: string,
): DrawdownInsightStatus {
  if (status === "Close to Breach" || status === "Breached") {
    return status;
  }

  return "Healthy";
}

export function getRandomDrawdownInsight(status: string) {
  const insightStatus = getDrawdownInsightStatus(status);
  const messages = drawdownInsightMessages[insightStatus];
  const randomIndex = Math.floor(Math.random() * messages.length);

  return messages[randomIndex];
}

// "Before You Trade" checklist. Situational: the wording escalates with the
// drawdown status so a breached account reads as failed, not just cautioned.
export type BeforeYouTradeTone = "ok" | "warn" | "fail";

export type BeforeYouTradeCheck = {
  tone: BeforeYouTradeTone;
  text: string;
};

export function getBeforeYouTradeChecks(
  status: string,
  remainingRoom: number,
  remainingAfterOpenRisk: number,
): BeforeYouTradeCheck[] {
  // Breached: the account is blown. Every row reports failure.
  if (status === "Breached") {
    return [
      { tone: "fail", text: "Daily loss limit breached" },
      { tone: "fail", text: "This prop account is blown" },
      { tone: "fail", text: "Stop now. Do not place another trade" },
    ];
  }

  // Close to Breach: serious caution, but the account is still alive.
  if (status === "Close to Breach") {
    return [
      { tone: "warn", text: "Very little room left before breach" },
      {
        tone: remainingAfterOpenRisk > 0 ? "warn" : "fail",
        text:
          remainingAfterOpenRisk > 0
            ? "Open risk fits, but barely"
            : "Your open trade risk would blow the account",
      },
      { tone: "warn", text: "Only take an A+ setup, or stop for the day" },
    ];
  }

  // Healthy: positive checks. Open-risk row still warns if it would breach.
  return [
    { tone: "ok", text: "Within your daily loss limit" },
    {
      tone: remainingAfterOpenRisk > 0 ? "ok" : "fail",
      text:
        remainingAfterOpenRisk > 0
          ? "Still have room after open risk"
          : "Your open trade risk would blow the account",
    },
    { tone: "ok", text: "Healthy buffer remaining" },
  ];
}
