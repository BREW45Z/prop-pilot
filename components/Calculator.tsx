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
import {
  calculatorCard,
  calculatorContent,
  calculatorHeader,
  fieldGroup,
  fieldIcon,
  fieldLabel,
  iconBadge,
  inputGrid,
  mutedText,
  primaryResultCard,
  primaryResultValue,
  resultCard,
  resultGrid,
  resultLabel,
  resultValue,
  sectionLabel,
  titleRow,
} from "@/lib/design-system";
import {
  Calculator as CalculatorIcon,
  CircleDollarSign,
  Percent,
  Ruler,
  Wallet,
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

export default function Calculator() {
  // Input state.
  const [accountSize, setAccountSize] = useState("");
  const [riskPercent, setRiskPercent] = useState("1");
  const [stopLoss, setStopLoss] = useState("");
  const [pipValue, setPipValue] = useState("10");

  // Convert input strings into numbers for calculation helpers.
  const account = Number(accountSize) || 0;
  const risk = Number(riskPercent) || 0;
  const sl = Number(stopLoss) || 0;
  const pip = Number(pipValue) || 0;

  // Risk calculator results.
  const dollarRisk = calculateRiskAmount(account, risk);
  const positionSize = calculatePositionSizeLots(dollarRisk, sl, pip);

  // Calculator card layout.
  return (
    <Card className={calculatorCard}>
      <CardHeader className={calculatorHeader}>
        <div className={titleRow}>
          <span className={iconBadge}>
            <CalculatorIcon className="size-5" />
          </span>
          <CardTitle>Risk Calculator</CardTitle>
        </div>
        <CardDescription className="leading-5">
          Calculate your position size and risk before every trade.
        </CardDescription>
      </CardHeader>

      <CardContent className={calculatorContent}>
        {/* Input section */}
        <div className={inputGrid}>
          <div className={fieldGroup}>
            <Label className={fieldLabel} htmlFor="account-size">
              <Wallet className={fieldIcon} />
              Account Size ($)
            </Label>
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

          <div className={fieldGroup}>
            <Label className={fieldLabel} htmlFor="risk-percent">
              <Percent className={fieldIcon} />
              Risk (%)
            </Label>
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

          <div className={fieldGroup}>
            <Label className={fieldLabel} htmlFor="stop-loss">
              <Ruler className={fieldIcon} />
              Stop Loss (pips)
            </Label>
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

          <div className={fieldGroup}>
            <Label className={fieldLabel} htmlFor="pip-value">
              <CircleDollarSign className={fieldIcon} />
              Dollar Value per Pip
            </Label>
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

          <p className={`${mutedText} sm:col-span-2`}>
            Most USD-quoted forex pairs use $10 per pip for one standard lot.
          </p>
        </div>

        <Separator />

        {/* Results section */}
        <div className={resultGrid}>
          <h3 className={`${sectionLabel} sm:col-span-2`}>
            Results
          </h3>

          <Card className={resultCard}>
            <p className={resultLabel}>
              Risk Amount
            </p>
            <h2 className={resultValue}>
              ${dollarRisk.toFixed(2)}
            </h2>
          </Card>

          <Card className={primaryResultCard}>
            <p className={resultLabel}>
              Position Size
            </p>
            <h2 className={primaryResultValue}>
              {positionSize.toFixed(2)} Lots
            </h2>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
