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
