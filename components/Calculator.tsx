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
  calculatePositionSizeLots,
  calculateRiskAmount,
} from "@/lib/calculations";
import { useState } from "react";

function keepPositiveNumber(value: string) {
  const numberValue = Number(value);

  if (numberValue < 0) {
    return "0";
  }

  return value;
}

export default function Calculator() {
  const [accountSize, setAccountSize] = useState("");
  const [riskPercent, setRiskPercent] = useState("1");
  const [stopLoss, setStopLoss] = useState("");
  const [pipValue, setPipValue] = useState("10");

  const account = Number(accountSize) || 0;
  const risk = Number(riskPercent) || 0;
  const sl = Number(stopLoss) || 0;
  const pip = Number(pipValue) || 0;

  const dollarRisk = calculateRiskAmount(account, risk);
  const positionSize = calculatePositionSizeLots(dollarRisk, sl, pip);

  return (
   <Card className="w-full max-w-[520px] px-6 py-8 sm:px-10 sm:py-10">
      <CardHeader>
        <CardTitle>Prop Pilot</CardTitle>
        <CardDescription className="text-lg font-medium text-slate-300">
          Risk Calculator
        </CardDescription>
        <CardDescription className="leading-6">
          Calculate your position size and risk before every trade.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-10">
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="account-size">Account Size ($)</Label>
            <Input
              id="account-size"
              min="0"
              step="100"
              type="number"
              placeholder="100000"
              value={accountSize}
              onChange={(e) =>
                setAccountSize(keepPositiveNumber(e.target.value))
              }
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="risk-percent">Risk (%)</Label>
            <Input
              id="risk-percent"
              min="0"
              step="0.1"
              type="number"
              placeholder="Risk %"
              value={riskPercent}
              onChange={(e) =>
                setRiskPercent(keepPositiveNumber(e.target.value))
              }
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="stop-loss">Stop Loss (pips)</Label>
            <Input
              id="stop-loss"
              min="0"
              step="0.1"
              type="number"
              placeholder="20"
              value={stopLoss}
              onChange={(e) => setStopLoss(keepPositiveNumber(e.target.value))}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="pip-value">Dollar Value per Pip</Label>
            <Input
              id="pip-value"
              min="0"
              step="0.01"
              type="number"
              placeholder="10"
              value={pipValue}
              onChange={(e) => setPipValue(keepPositiveNumber(e.target.value))}
            />
          </div>

          <p className="text-sm leading-6 text-slate-400">
            Most USD-quoted forex pairs use $10 per pip for one standard lot.
          </p>
        </div>

        <Separator className="my-7" />

                <div className="grid gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
            Results
          </h3>

          <Card className="rounded-lg bg-slate-950 p-5 shadow-none">
            <p className="mb-2 text-sm font-medium text-slate-400">Risk Amount</p>
            <h2 className="text-3xl font-bold leading-none text-white">
              ${dollarRisk.toFixed(2)}
            </h2>
          </Card>

          <Card className="rounded-lg bg-slate-950 p-5 shadow-none">
            <p className="mb-2 text-sm font-medium text-slate-400">Position Size</p>
            <h2 className="text-3xl font-bold leading-none text-white">
              {positionSize.toFixed(2)} Lots
            </h2>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
