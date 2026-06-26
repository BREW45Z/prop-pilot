export function calculateRiskAmount(accountSize: number, riskPercent: number) {
  return accountSize * (riskPercent / 100);
}

export function calculatePositionSizeLots(
  riskAmount: number,
  stopLossPips: number,
  pipValuePerStandardLot = 10
) {
  if (stopLossPips <= 0 || pipValuePerStandardLot <= 0) {
    return 0;
  }

  return riskAmount / (stopLossPips * pipValuePerStandardLot);
}

export function calculateDailyLossLimit(
  accountBalance: number,
  dailyLossPercent: number
) {
  return accountBalance * (dailyLossPercent / 100);
}

export function calculateLossUsedToday(currentDayPL: number) {
  if (currentDayPL >= 0) {
    return 0;
  }

  return Math.abs(currentDayPL);
}

export function calculateRemainingDailyLossRoom(
  dailyLossLimit: number,
  currentDayPL: number
) {
  return dailyLossLimit + currentDayPL;
}

export function calculateRemainingRoomAfterOpenRisk(
  remainingRoom: number,
  openTradeRisk: number
) {
  return remainingRoom - openTradeRisk;
}

export function getDailyDrawdownStatus(
  remainingRoom: number,
  dailyLossLimit: number
) {
  if (remainingRoom <= 0) {
    return "Breached";
  }

  if (remainingRoom <= dailyLossLimit * 0.25) {
    return "Close to Breach";
  }

  return "Healthy";
}

export function getDailyDrawdownAdvice(status: string) {
  if (status === "Breached") {
    return "Stop trading. Daily loss limit is breached.";
  }

  if (status === "Close to Breach") {
    return "Reduce size or stop trading.";
  }

  return "You still have room, but keep risk controlled.";
}