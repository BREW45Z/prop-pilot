import {
  getBeforeYouTradeChecks,
  getDrawdownInsightStatus,
  getRandomDrawdownInsight,
  isActiveTool,
  isDailyDrawdownStorage,
  isRiskCalculatorStorage,
  isThemeMode,
} from "./wizardHelpers";
import { drawdownInsightMessages } from "./wizardConstants";

function expectTrue(actual: boolean, testName: string) {
  if (actual !== true) {
    throw new Error(`${testName} failed. Expected true, got ${actual}`);
  }
}

function expectFalse(actual: boolean, testName: string) {
  if (actual !== false) {
    throw new Error(`${testName} failed. Expected false, got ${actual}`);
  }
}

function expectEqual(actual: string, expected: string, testName: string) {
  if (actual !== expected) {
    throw new Error(`${testName} failed. Expected ${expected}, got ${actual}`);
  }
}

// isActiveTool
expectTrue(isActiveTool("risk"), "isActiveTool accepts risk");
expectTrue(isActiveTool("drawdown"), "isActiveTool accepts drawdown");
expectFalse(isActiveTool("hack"), "isActiveTool rejects unknown");
expectFalse(isActiveTool(null), "isActiveTool rejects null");

// isThemeMode
expectTrue(isThemeMode("dark"), "isThemeMode accepts dark");
expectTrue(isThemeMode("light"), "isThemeMode accepts light");
expectFalse(isThemeMode("blue"), "isThemeMode rejects unknown");

// isRiskCalculatorStorage: valid shape passes.
const validRisk = {
  accountSize: "50000",
  riskPercent: "1",
  stopLoss: "50",
  dollarValuePerPip: "10",
};
expectTrue(
  isRiskCalculatorStorage(validRisk),
  "isRiskCalculatorStorage accepts valid shape",
);
// Missing a field fails.
expectFalse(
  isRiskCalculatorStorage({ accountSize: "50000" }),
  "isRiskCalculatorStorage rejects missing fields",
);
// Wrong types fail (numbers instead of strings).
expectFalse(
  isRiskCalculatorStorage({
    accountSize: 50000,
    riskPercent: 1,
    stopLoss: 50,
    dollarValuePerPip: 10,
  }),
  "isRiskCalculatorStorage rejects non-string values",
);
expectFalse(
  isRiskCalculatorStorage(null),
  "isRiskCalculatorStorage rejects null",
);

// isDailyDrawdownStorage: valid shape passes.
const validDrawdown = {
  startOfDayBalance: "50000",
  dailyLossPercent: "5",
  currentDayPL: "-200",
  openTradeRisk: "100",
};
expectTrue(
  isDailyDrawdownStorage(validDrawdown),
  "isDailyDrawdownStorage accepts valid shape",
);
expectFalse(
  isDailyDrawdownStorage({ startOfDayBalance: "50000" }),
  "isDailyDrawdownStorage rejects missing fields",
);

// getDrawdownInsightStatus maps unknown status to Healthy.
expectEqual(
  getDrawdownInsightStatus("Breached"),
  "Breached",
  "getDrawdownInsightStatus keeps Breached",
);
expectEqual(
  getDrawdownInsightStatus("anything else"),
  "Healthy",
  "getDrawdownInsightStatus defaults to Healthy",
);

// getRandomDrawdownInsight returns a message from the correct group.
const breachedInsight = getRandomDrawdownInsight("Breached");
expectTrue(
  drawdownInsightMessages.Breached.includes(breachedInsight),
  "getRandomDrawdownInsight returns a Breached message",
);
const healthyInsight = getRandomDrawdownInsight("unknown status");
expectTrue(
  drawdownInsightMessages.Healthy.includes(healthyInsight),
  "getRandomDrawdownInsight defaults to a Healthy message",
);

// getBeforeYouTradeChecks: situational tones per status.
// Breached -> every row fails (account blown).
const breachedChecks = getBeforeYouTradeChecks("Breached", -100, -200);
expectTrue(
  breachedChecks.every((check) => check.tone === "fail"),
  "Breached checklist is all fail",
);

// Close to Breach with open risk that still fits -> all warn.
const closeChecks = getBeforeYouTradeChecks("Close to Breach", 50, 20);
expectTrue(
  closeChecks.every((check) => check.tone === "warn"),
  "Close to Breach with fitting open risk is all warn",
);

// Close to Breach but open risk would blow it -> that row is fail.
const closeFailChecks = getBeforeYouTradeChecks("Close to Breach", 50, -10);
expectTrue(
  closeFailChecks.some((check) => check.tone === "fail"),
  "Close to Breach with breaching open risk has a fail row",
);

// Healthy with room after open risk -> all ok.
const healthyChecks = getBeforeYouTradeChecks("Healthy", 500, 400);
expectTrue(
  healthyChecks.every((check) => check.tone === "ok"),
  "Healthy with room is all ok",
);

// Healthy but open risk alone would blow the account -> that row is fail.
const healthyFailChecks = getBeforeYouTradeChecks("Healthy", 500, -50);
expectTrue(
  healthyFailChecks.some((check) => check.tone === "fail"),
  "Healthy with breaching open risk has a fail row",
);

console.log("All wizard helper tests passed.");
