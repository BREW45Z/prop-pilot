"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  calculateDailyLossLimit,
  calculateLossUsedToday,
  calculateRemainingDailyLossRoom,
  calculateRemainingRoomAfterOpenRisk,
  getDailyDrawdownAdvice,
  getDailyDrawdownStatus,
} from "@/lib/calculations";
import {
  calculatorCard,
  calculatorContent,
  calculatorHeader,
  drawdownResultGrid,
  fieldGroup,
  fieldIcon,
  fieldLabel,
  iconBadgePurple,
  inputGrid,
  resultCard,
  resultLabel,
  safeResultCard,
  safeResultValue,
  sectionLabel,
  statusBadge,
  titleRow,
} from "@/lib/design-system";
import {
  Activity,
  BadgeAlert,
  BarChart3,
  CircleDollarSign,
  Landmark,
  Percent,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";

// Keeps positive-only inputs from accepting negative values.
function keepPositiveNumber(value: string) {
  const numberValue = Number(value);

  if (numberValue < 0) {
    return "0";
  }

  return value;
}

// Daily loss percentage should stay within a realistic 0-100 range.
function keepPercentBetweenZeroAndHundred(value: string) {
  const numberValue = Number(value);

  if (numberValue < 0) {
    return "0";
  }

  if (numberValue > 100) {
    return "100";
  }

  return value;
}

export default function DailyDrawdownCalculator() {
  // Input state.
  const [accountBalance, setAccountBalance] = useState("");
  const [dailyLossPercent, setDailyLossPercent] = useState("3");
  const [currentDayPL, setCurrentDayPL] = useState("");
  const [openTradeRisk, setOpenTradeRisk] = useState("");

  // Convert input strings into numbers for calculation helpers.
  const balance = Number(accountBalance) || 0;
  const lossPercent = Number(dailyLossPercent) || 0;
  const dayPL = Number(currentDayPL) || 0;
  const tradeRisk = Number(openTradeRisk) || 0;

  // Daily drawdown results.
  const dailyLossLimit = calculateDailyLossLimit(balance, lossPercent);
  const lossUsedToday = calculateLossUsedToday(dayPL);
  const remainingRoom = calculateRemainingDailyLossRoom(dailyLossLimit, dayPL);
  const remainingRoomAfterOpenRisk = calculateRemainingRoomAfterOpenRisk(
    remainingRoom,
    tradeRisk
  );

  // Status and advice display values.
  const status = getDailyDrawdownStatus(remainingRoom, dailyLossLimit);
  const statusLabel = status === "Close to Breach" ? "Caution" : status;
  const statusBadgeClass =
    status === "Healthy"
      ? statusBadge.healthy
      : status === "Close to Breach"
        ? statusBadge.caution
        : statusBadge.breached;
  const baseAdvice = getDailyDrawdownAdvice(status);
  const advice =
    remainingRoom <= 0
      ? "Daily Loss Limit Breached. Stop trading."
      : `${baseAdvice} You have $${remainingRoom.toFixed(
          2
        )} remaining before the daily loss limit.`;

  return (
    <Card className={calculatorCard}>
      <CardHeader className={calculatorHeader}>
        <div className={titleRow}>
          <span className={iconBadgePurple}>
            <BarChart3 className="size-5" />
          </span>
          <CardTitle>Daily Drawdown Calculator</CardTitle>
        </div>
        <CardDescription className="leading-5">
          Track your daily loss limit before taking the next trade.
        </CardDescription>
      </CardHeader>

      <CardContent className={calculatorContent}>
        {/* Input section */}
        <div className={inputGrid}>
          <div className={fieldGroup}>
            <Label className={fieldLabel} htmlFor="account-balance">
              <Landmark className={fieldIcon} />
              Start of Day Balance ($)
            </Label>
            <Input
              id="account-balance"
              min="0"
              step="100"
              type="number"
              placeholder="50000"
              value={accountBalance}
              onChange={(e) =>
                setAccountBalance(keepPositiveNumber(e.target.value))
              }
            />
          </div>

          <div className={fieldGroup}>
            <Label className={fieldLabel} htmlFor="daily-loss-percent">
              <Percent className={fieldIcon} />
              Daily Loss Limit (%)
            </Label>
            <Input
              id="daily-loss-percent"
              min="0"
              max="100"
              step="0.1"
              type="number"
              placeholder="5"
              value={dailyLossPercent}
              onChange={(e) =>
                setDailyLossPercent(
                  keepPercentBetweenZeroAndHundred(e.target.value)
                )
              }
            />
          </div>

          <div className={fieldGroup}>
            <Label className={fieldLabel} htmlFor="current-day-pl">
              <Activity className={fieldIcon} />
              Current Day P/L
            </Label>
            <Input
              id="current-day-pl"
              step="1"
              type="number"
              placeholder="-700"
              value={currentDayPL}
              onChange={(e) => setCurrentDayPL(e.target.value)}
            />
          </div>

          <div className={fieldGroup}>
            <Label className={fieldLabel} htmlFor="open-trade-risk">
              <ShieldAlert className={fieldIcon} />
              Open Trade Risk ($)
            </Label>
            <Input
              id="open-trade-risk"
              min="0"
              step="1"
              type="number"
              placeholder="300"
              value={openTradeRisk}
              onChange={(e) =>
                setOpenTradeRisk(keepPositiveNumber(e.target.value))
              }
            />
          </div>
        </div>

        <Separator />

        {/* Results, status, and advice section */}
        <div className={drawdownResultGrid}>
          <h3 className={`${sectionLabel} sm:col-span-2 xl:col-span-4`}>
            Results
          </h3>

          <Card className={resultCard}>
            <p className={resultLabel}>
              Maximum Daily Loss Allowed
            </p>
            <h2 className="text-xl font-bold leading-none text-violet-300">
              ${dailyLossLimit.toFixed(2)}
            </h2>
          </Card>

          <Card className={resultCard}>
            <p className={resultLabel}>
              Loss Already Used Today
            </p>
            <h2 className="text-xl font-bold leading-none text-red-300">
              ${lossUsedToday.toFixed(2)}
            </h2>
          </Card>

          <Card className={safeResultCard}>
            <p className={resultLabel}>
              Remaining Loss Room
            </p>
            <h2 className={safeResultValue}>
              {remainingRoom <= 0
                ? "Daily Loss Limit Breached"
                : `$${remainingRoom.toFixed(2)}`}
            </h2>
          </Card>

          <Card className={safeResultCard}>
            <p className={resultLabel}>
              Remaining Room After Open Risk
            </p>
            <h2 className={safeResultValue}>
              ${remainingRoomAfterOpenRisk.toFixed(2)}
            </h2>
          </Card>

          <Card className={`${resultCard} xl:col-span-2`}>
            <p className={resultLabel}>Status</p>
            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-sm font-bold ${statusBadgeClass}`}
            >
              <BadgeAlert className="size-4" />
              {statusLabel}
            </span>
          </Card>

          <Card className={`${resultCard} sm:col-span-2 xl:col-span-2`}>
            <p className={resultLabel}>Advice</p>
            <p className="text-sm font-semibold leading-5 text-slate-100">
              <CircleDollarSign className="mr-1 inline size-4 text-slate-500" />
              {advice}
            </p>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
