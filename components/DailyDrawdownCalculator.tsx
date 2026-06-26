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
import { useState } from "react";

function keepPositiveNumber(value: string) {
  const numberValue = Number(value);

  if (numberValue < 0) {
    return "0";
  }

  return value;
}

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
  const [accountBalance, setAccountBalance] = useState("");
  const [dailyLossPercent, setDailyLossPercent] = useState("3");
  const [currentDayPL, setCurrentDayPL] = useState("");
  const [openTradeRisk, setOpenTradeRisk] = useState("");

  const balance = Number(accountBalance) || 0;
  const lossPercent = Number(dailyLossPercent) || 0;
  const dayPL = Number(currentDayPL) || 0;
  const tradeRisk = Number(openTradeRisk) || 0;

  const dailyLossLimit = calculateDailyLossLimit(balance, lossPercent);
  const lossUsedToday = calculateLossUsedToday(dayPL);
  const remainingRoom = calculateRemainingDailyLossRoom(dailyLossLimit, dayPL);
  const remainingRoomAfterOpenRisk = calculateRemainingRoomAfterOpenRisk(
    remainingRoom,
    tradeRisk
  );
  const status = getDailyDrawdownStatus(remainingRoom, dailyLossLimit);
  const statusLabel = status === "Close to Breach" ? "Caution" : status;
  const statusBadgeClass =
    status === "Healthy"
      ? "border-green-500/30 bg-green-500/10 text-green-300"
      : status === "Close to Breach"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
        : "border-red-500/30 bg-red-500/10 text-red-300";
  const baseAdvice = getDailyDrawdownAdvice(status);
  const advice =
    remainingRoom <= 0
      ? "Daily Loss Limit Breached. Stop trading."
      : `${baseAdvice} You have $${remainingRoom.toFixed(
          2
        )} remaining before the daily loss limit.`;

  return (
    <Card className="w-full max-w-[520px] px-6 py-8 sm:px-10 sm:py-10">
      <CardHeader>
        <CardTitle>Daily Drawdown Calculator</CardTitle>
        <CardDescription className="leading-6">
          Track your daily loss limit before taking the next trade.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-10">
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="account-balance">Start of Day Balance ($)</Label>
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

          <div className="grid gap-3">
            <Label htmlFor="daily-loss-percent">Daily Loss Limit (%)</Label>
            <Input
              id="daily-loss-percent"
              min="0"
              max="100"
              step="0.1"
              type="number"
              placeholder="5"
              value={dailyLossPercent}
              onChange={(e) =>
                setDailyLossPercent(keepPercentBetweenZeroAndHundred(e.target.value))
              }
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="current-day-pl">Current Day P/L</Label>
            <Input
              id="current-day-pl"
              step="1"
              type="number"
              placeholder="-700"
              value={currentDayPL}
              onChange={(e) => setCurrentDayPL(e.target.value)}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="open-trade-risk">Open Trade Risk ($)</Label>
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

        <Separator className="my-7" />

        <div className="grid gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
            Results
          </h3>

          <Card className="rounded-lg bg-slate-950 p-5 shadow-none">
            <p className="mb-2 text-sm font-medium text-slate-400">
              Maximum Daily Loss Allowed
            </p>
            <h2 className="text-3xl font-bold leading-none text-white">
              ${dailyLossLimit.toFixed(2)}
            </h2>
          </Card>

          <Card className="rounded-lg bg-slate-950 p-5 shadow-none">
            <p className="mb-2 text-sm font-medium text-slate-400">
              Loss Already Used Today
            </p>
            <h2 className="text-3xl font-bold leading-none text-white">
              ${lossUsedToday.toFixed(2)}
            </h2>
          </Card>

          <Card className="rounded-lg border-slate-500 bg-slate-900 p-5 shadow-none">
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-300">
              Remaining Loss Room
            </p>
            <h2 className="text-4xl font-bold leading-tight text-white">
              {remainingRoom <= 0
                ? "Daily Loss Limit Breached"
                : `$${remainingRoom.toFixed(2)}`}
            </h2>
          </Card>

          <Card className="rounded-lg bg-slate-950 p-5 shadow-none">
            <p className="mb-2 text-sm font-medium text-slate-400">
              Remaining Room After Open Risk
            </p>
            <h2 className="text-3xl font-bold leading-none text-white">
              ${remainingRoomAfterOpenRisk.toFixed(2)}
            </h2>
          </Card>

          <Card className="rounded-lg bg-slate-950 p-5 shadow-none">
            <p className="mb-3 text-sm font-medium text-slate-400">Status</p>
            <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-sm font-bold ${statusBadgeClass}`}>
            {statusLabel}
            </span>
          </Card>

          <Card className="rounded-lg bg-slate-950 p-5 shadow-none">
            <p className="mb-2 text-sm font-medium text-slate-400">Advice</p>
            <p className="text-base font-semibold leading-6 text-white">
              {advice}
            </p>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
