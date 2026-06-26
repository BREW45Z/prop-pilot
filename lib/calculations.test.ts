import {
  calculateDailyLossLimit,
  calculateLossUsedToday,
  calculatePositionSizeLots,
  calculateRemainingDailyLossRoom,
  calculateRemainingRoomAfterOpenRisk,
  calculateRiskAmount,
  getDailyDrawdownAdvice,
  getDailyDrawdownStatus,
} from "./calculations";

function expectEqual(
  actual: number | string,
  expected: number | string,
  testName: string
) {
  if (actual !== expected) {
    throw new Error(`${testName} failed. Expected ${expected}, got ${actual}`);
  }
}

const riskAmount = calculateRiskAmount(2000, 1);

expectEqual(riskAmount, 20, "Risk amount calculation");

const lotSize = calculatePositionSizeLots(riskAmount, 20, 10);

expectEqual(lotSize, 0.1, "Lot size calculation");

const zeroStopLossLotSize = calculatePositionSizeLots(20, 0, 10);

expectEqual(zeroStopLossLotSize, 0, "Zero stop loss returns zero lots");

const dailyLossLimit = calculateDailyLossLimit(50000, 3);

expectEqual(dailyLossLimit, 1500, "Daily loss limit calculation");

const lossUsedToday = calculateLossUsedToday(-700);

expectEqual(lossUsedToday, 700, "Loss used today calculation");

const remainingRoom = calculateRemainingDailyLossRoom(dailyLossLimit, -700);

expectEqual(remainingRoom, 800, "Remaining daily loss room calculation");

const remainingRoomAfterOpenRisk = calculateRemainingRoomAfterOpenRisk(
  remainingRoom,
  300
);

expectEqual(
  remainingRoomAfterOpenRisk,
  500,
  "Remaining room after open risk calculation"
);

const healthyStatus = getDailyDrawdownStatus(800, dailyLossLimit);

expectEqual(healthyStatus, "Healthy", "Healthy drawdown status");

const closeToBreachStatus = getDailyDrawdownStatus(300, dailyLossLimit);

expectEqual(
  closeToBreachStatus,
  "Close to Breach",
  "Close to breach drawdown status"
);

const breachedStatus = getDailyDrawdownStatus(0, dailyLossLimit);

expectEqual(breachedStatus, "Breached", "Breached drawdown status");

const healthyAdvice = getDailyDrawdownAdvice("Healthy");

expectEqual(
  healthyAdvice,
  "You still have room, but keep risk controlled.",
  "Healthy drawdown advice"
);

const closeToBreachAdvice = getDailyDrawdownAdvice("Close to Breach");

expectEqual(
  closeToBreachAdvice,
  "Reduce size or stop trading.",
  "Close to breach drawdown advice"
);

const breachedAdvice = getDailyDrawdownAdvice("Breached");

expectEqual(
  breachedAdvice,
  "Stop trading. Daily loss limit is breached.",
  "Breached drawdown advice"
);


console.log("All calculation tests passed.");
