"use client";

import {
  calculateDailyLossLimit,
  calculateLossUsedToday,
  calculatePositionSizeLots,
  calculateRemainingDailyLossRoom,
  calculateRemainingRoomAfterOpenRisk,
  calculateRiskAmount,
  getDailyDrawdownAdvice,
  getDailyDrawdownStatus,
} from "@/lib/calculations";
import {
  Activity,
  BarChart3,
  BookOpen,
  Calculator,
  ClipboardList,
  Settings,
  TrendingDown,
} from "lucide-react";
import { useState } from "react";

type ActiveTool = "risk" | "drawdown";

const riskSteps = ["Account", "Risk", "Trade Setup", "Results"];
const drawdownSteps = ["Balance", "Limit", "Day Risk", "Results"];

const inputClass =
  "h-8 rounded-md border border-neutral-800 bg-black px-2.5 text-sm text-white outline-none transition focus:border-violet-400";
const labelClass = "grid gap-1.5 text-xs font-medium text-neutral-300";
const metricCard =
  "rounded-lg border border-neutral-800 bg-black/70 p-3 shadow-sm shadow-black/20";
const metricLabel =
  "text-[11px] font-semibold uppercase tracking-wide text-neutral-500";
const wizardStepPanel =
  "grid min-h-[14rem] items-center gap-4 lg:h-56 lg:grid-cols-[17rem_minmax(0,1fr)]";
const wizardInputArea =
  "grid min-h-[7.5rem] items-center gap-3 rounded-xl border border-neutral-800 bg-black/40 p-3 sm:grid-cols-2";

const futureTools = [
  { label: "Consistency Tracker", Icon: ClipboardList },
  { label: "Prop Health Score", Icon: Activity },
  { label: "Journal", Icon: BookOpen },
  { label: "Presets", Icon: Settings },
];

export default function PropPilotWizard() {
  // Sidebar tool state.
  const [activeTool, setActiveTool] = useState<ActiveTool>("risk");

  // Each sidebar tool keeps its own wizard step.
  const [riskStep, setRiskStep] = useState(0);
  const [drawdownStep, setDrawdownStep] = useState(0);
  const [hasTriedToContinue, setHasTriedToContinue] = useState(false);

  // Risk Calculator form state.
  const [accountSize, setAccountSize] = useState("");
  const [riskPercent, setRiskPercent] = useState("1");
  const [stopLoss, setStopLoss] = useState("");
  const [dollarValuePerPip, setDollarValuePerPip] = useState("10");

  // Daily Drawdown form state.
  const [startOfDayBalance, setStartOfDayBalance] = useState("");
  const [dailyLossPercent, setDailyLossPercent] = useState("5");
  const [currentDayPL, setCurrentDayPL] = useState("");
  const [openTradeRisk, setOpenTradeRisk] = useState("");

  // Convert input strings into numbers before sending them to calculation helpers.
  const account = Number(accountSize) || 0;
  const risk = Number(riskPercent) || 0;
  const sl = Number(stopLoss) || 0;
  const pipValue = Number(dollarValuePerPip) || 0;
  const dayBalance = Number(startOfDayBalance) || 0;
  const dailyLoss = Number(dailyLossPercent) || 0;
  const dayPL = Number(currentDayPL) || 0;
  const tradeRisk = Number(openTradeRisk) || 0;

  // Risk Calculator results.
  const riskAmount = calculateRiskAmount(account, risk);
  const positionSize = calculatePositionSizeLots(riskAmount, sl, pipValue);

  // Daily Drawdown results.
  const dailyLossLimit = calculateDailyLossLimit(dayBalance, dailyLoss);
  const lossUsedToday = calculateLossUsedToday(dayPL);
  const remainingRoom = calculateRemainingDailyLossRoom(dailyLossLimit, dayPL);
  const remainingAfterOpenRisk = calculateRemainingRoomAfterOpenRisk(
    remainingRoom,
    tradeRisk
  );

  // Daily Drawdown status and advice.
  const drawdownStatus = getDailyDrawdownStatus(
    remainingRoom,
    dailyLossLimit
  );
  const drawdownAdvice = getDailyDrawdownAdvice(drawdownStatus);
  const statusColorClass =
    drawdownStatus === "Healthy"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
      : drawdownStatus === "Close to Breach"
        ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
        : "border-red-500/40 bg-red-500/10 text-red-300";
  const remainingRoomColor =
    remainingRoom <= 0 ? "text-red-300" : "text-emerald-300";
  const remainingAfterRiskColor =
    remainingAfterOpenRisk <= 0 ? "text-red-300" : "text-emerald-300";

  // Active wizard values.
  const steps = activeTool === "risk" ? riskSteps : drawdownSteps;
  const currentStep = activeTool === "risk" ? riskStep : drawdownStep;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const pageTitle =
    activeTool === "risk" ? "Risk Calculator" : "Daily Drawdown";
  const pageSubtitle =
    activeTool === "risk"
      ? "Walk through account risk, trade setup, and lot size."
      : "Walk through daily balance, loss limit, and remaining room.";

  // Validation stays local to the selected tool and selected step.
  const isCurrentStepValid =
    activeTool === "risk"
      ? currentStep === 0
        ? account > 0
        : currentStep === 1
          ? risk > 0
          : currentStep === 2
            ? sl > 0 && pipValue > 0
            : true
      : currentStep === 0
        ? dayBalance > 0
        : currentStep === 1
          ? dailyLoss > 0
          : currentStep === 2
            ? currentDayPL.trim() !== ""
            : true;
  const validationMessage =
    activeTool === "risk"
      ? currentStep === 0
        ? "Enter account size to continue."
        : currentStep === 1
          ? "Enter risk percentage to continue."
          : "Enter stop loss and pip value to continue."
      : currentStep === 0
        ? "Enter start of day balance to continue."
        : currentStep === 1
          ? "Enter daily loss limit percentage to continue."
          : "Enter current day P/L to continue.";

  // Navigation helpers.
  function setActiveStep(nextStep: number) {
    if (activeTool === "risk") {
      setRiskStep(nextStep);
    } else {
      setDrawdownStep(nextStep);
    }
  }

  function changeTool(tool: ActiveTool) {
    setHasTriedToContinue(false);
    setActiveTool(tool);
  }

  function goBack() {
    if (!isFirstStep) {
      setHasTriedToContinue(false);
      setActiveStep(currentStep - 1);
    }
  }

  function goNext() {
    if (!isCurrentStepValid) {
      setHasTriedToContinue(true);
      return;
    }

    if (!isLastStep) {
      setHasTriedToContinue(false);
      setActiveStep(currentStep + 1);
    }
  }

  function startOver() {
    setHasTriedToContinue(false);
    setActiveStep(0);
  }

  // Input helpers.
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

  function formatCurrency(value: number) {
    return `$${value.toFixed(2)}`;
  }

  // Compact desktop app shell with tool-specific wizard panels.
  return (
    <section className="min-h-screen bg-black text-white lg:h-screen lg:overflow-hidden">
      <div className="min-h-screen lg:h-screen">
        <aside className="flex border-b border-neutral-900 bg-neutral-950/80 p-4 lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:h-screen lg:w-60 lg:flex-col lg:border-b-0 lg:border-r">
          <div className="w-full">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-violet-500/15 text-sm font-black text-violet-300">
                <BarChart3 className="size-6" />
              </div>
              <div>
                <p className="text-base font-bold">Prop Pilot</p>
                <p className="text-xs text-neutral-500">Trader toolkit</p>
              </div>
            </div>

            <nav className="mt-6 grid gap-1.5">
              <p className="mb-1 px-2 text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                Tools
              </p>

              <button
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm font-semibold transition ${
                  activeTool === "risk"
                    ? "border-violet-500/30 bg-violet-500/15 text-white"
                    : "border-transparent text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`}
                type="button"
                onClick={() => changeTool("risk")}
              >
                <Calculator className="size-5" />
                Risk Calculator
              </button>

              <button
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm font-semibold transition ${
                  activeTool === "drawdown"
                    ? "border-violet-500/30 bg-violet-500/15 text-white"
                    : "border-transparent text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`}
                type="button"
                onClick={() => changeTool("drawdown")}
              >
                <TrendingDown className="size-5" />
                Daily Drawdown
              </button>
            </nav>

            <div className="mt-6 grid gap-1.5 border-t border-neutral-900 pt-5">
              <p className="mb-1 px-2 text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                Later
              </p>
              {futureTools.map(({ label, Icon }) => (
                  <p
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600"
                    key={label}
                  >
                    <Icon className="size-5" />
                    {label}
                  </p>
                ))}
            </div>
          </div>

          <div className="mt-auto hidden text-xs leading-5 text-neutral-500 lg:block">
            <p>© 2026 Prop Pilot</p>
            <p>Built for traders, not gamblers.</p>
          </div>
        </aside>

        <main className="min-h-0 px-4 pb-8 pt-16 lg:h-screen lg:overflow-hidden lg:pl-[17rem] lg:pr-8 lg:pt-28">
          <div className="mx-auto grid h-full w-full max-w-5xl content-start gap-3">
            <header className="border-b border-neutral-900 pb-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Active Tool
              </p>
              <h1 className="mt-1 text-2xl font-bold">{pageTitle}</h1>
              <p className="mt-1 text-sm text-neutral-400">{pageSubtitle}</p>
            </header>

            <div className="grid min-h-0 justify-items-center pt-1">
            <section className="mx-auto grid w-full max-w-5xl gap-4 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4 shadow-2xl shadow-black/30">
              <div className="grid gap-3 sm:flex sm:items-center sm:justify-center">
                {steps.map((step, index) => {
                  const isActive = currentStep === index;
                  const isComplete = currentStep > index;

                  return (
                    <div
                      className="grid gap-2 sm:flex sm:flex-1 sm:items-center"
                      key={step}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`grid size-8 shrink-0 place-items-center rounded-full border text-xs font-bold ${
                            isActive
                              ? "border-violet-400 bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                              : isComplete
                                ? "border-violet-500/40 bg-violet-500/15 text-violet-200"
                                : "border-neutral-700 bg-black text-neutral-500"
                          }`}
                        >
                          {index + 1}
                        </span>

                        <div>
                          <p
                            className={`text-sm font-semibold leading-4 ${
                              isActive ? "text-white" : "text-neutral-500"
                            }`}
                          >
                            {step}
                          </p>
                          <p className="text-xs text-neutral-600">
                            {index === steps.length - 1
                              ? "Risk report"
                              : "Required step"}
                          </p>
                        </div>
                      </div>

                      {index < steps.length - 1 && (
                        <div
                          className={`hidden h-px flex-1 sm:block ${
                            isComplete ? "bg-violet-500/50" : "bg-neutral-800"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {activeTool === "risk" && (
                <div className="grid gap-4">
                  {currentStep === 0 && (
                    <div className={wizardStepPanel}>
                      <div className={metricCard}>
                        <p className={metricLabel}>Step 1</p>
                        <h2 className="mt-1 text-lg font-bold">
                          Account details
                        </h2>
                        <p className="mt-1 text-sm leading-5 text-neutral-400">
                          Start with the account size you want to risk from.
                        </p>
                      </div>

                      <div className={wizardInputArea}>
                        <label className={labelClass}>
                          Account Size
                          <input
                            className={inputClass}
                            min="0"
                            placeholder="5000"
                            type="number"
                            value={accountSize}
                            onChange={(event) =>
                              setAccountSize(
                                keepPositiveNumber(event.target.value)
                              )
                            }
                          />
                        </label>

                        <div className={metricCard}>
                          <p className={metricLabel}>Current Value</p>
                          <p className="mt-1 text-xl font-bold text-white">
                            {formatCurrency(account)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className={wizardStepPanel}>
                      <div className={metricCard}>
                        <p className={metricLabel}>Step 2</p>
                        <h2 className="mt-1 text-lg font-bold">Risk setting</h2>
                        <p className="mt-1 text-sm leading-5 text-neutral-400">
                          Choose how much of the account to risk on this trade.
                        </p>
                      </div>

                      <div className={wizardInputArea}>
                        <label className={labelClass}>
                          Risk (%)
                          <input
                            className={inputClass}
                            min="0"
                            placeholder="1"
                            step="0.1"
                            type="number"
                            value={riskPercent}
                            onChange={(event) =>
                              setRiskPercent(
                                keepPositiveNumber(event.target.value)
                              )
                            }
                          />
                        </label>

                        <div className={metricCard}>
                          <p className={metricLabel}>Estimated Risk</p>
                          <p className="mt-1 text-xl font-bold text-white">
                            {formatCurrency(riskAmount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className={wizardStepPanel}>
                      <div className={metricCard}>
                        <p className={metricLabel}>Step 3</p>
                        <h2 className="mt-1 text-lg font-bold">Trade setup</h2>
                        <p className="mt-1 text-sm leading-5 text-neutral-400">
                          Add stop distance and pip value to calculate lots.
                        </p>
                      </div>

                      <div className={wizardInputArea}>
                        <label className={labelClass}>
                          Stop Loss (pips)
                          <input
                            className={inputClass}
                            min="0"
                            placeholder="20"
                            step="0.1"
                            type="number"
                            value={stopLoss}
                            onChange={(event) =>
                              setStopLoss(
                                keepPositiveNumber(event.target.value)
                              )
                            }
                          />
                        </label>

                        <label className={labelClass}>
                          Dollar Value per Pip
                          <input
                            className={inputClass}
                            min="0"
                            placeholder="10"
                            step="0.01"
                            type="number"
                            value={dollarValuePerPip}
                            onChange={(event) =>
                              setDollarValuePerPip(
                                keepPositiveNumber(event.target.value)
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="grid gap-3">
                      <div className="grid gap-3 rounded-xl border border-white/10 bg-white p-3 text-black sm:grid-cols-[1fr_0.75fr] sm:items-center">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-neutral-600">
                            Risk Report Ready
                          </p>
                          <h2 className="mt-1 text-lg font-bold">
                            Confirm position size before entry.
                          </h2>
                          <p className="mt-1 text-xs leading-5 text-neutral-600">
                            This report turns account risk, stop loss, and pip
                            value into a clear lot size.
                          </p>
                        </div>

                        <div className="rounded-lg border border-neutral-200 bg-neutral-100 p-3">
                          <p className={metricLabel}>Position Size</p>
                          <p className="mt-1 text-3xl font-bold leading-none text-violet-600">
                            {positionSize.toFixed(2)}
                          </p>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            Lots
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className={metricCard}>
                          <p className={metricLabel}>Risk Amount</p>
                          <p className="mt-1 text-xl font-bold text-white">
                            {formatCurrency(riskAmount)}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">
                            Amount at risk on this trade.
                          </p>
                        </div>

                        <div className={metricCard}>
                          <p className={metricLabel}>Risk Percent</p>
                          <p className="mt-1 text-xl font-bold text-white">
                            {risk.toFixed(2)}%
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">
                            Based on account size.
                          </p>
                        </div>

                        <div className={metricCard}>
                          <p className={metricLabel}>Stop Distance</p>
                          <p className="mt-1 text-xl font-bold text-white">
                            {sl.toFixed(1)}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">
                            Pips to stop loss.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTool === "drawdown" && (
                <div className="grid gap-4">
                  {currentStep === 0 && (
                    <div className={wizardStepPanel}>
                      <div className={metricCard}>
                        <p className={metricLabel}>Step 1</p>
                        <h2 className="mt-1 text-lg font-bold">
                          Start balance
                        </h2>
                        <p className="mt-1 text-sm leading-5 text-neutral-400">
                          Use the balance your daily drawdown rule starts from.
                        </p>
                      </div>

                      <div className={wizardInputArea}>
                        <label className={labelClass}>
                          Start of Day Balance
                          <input
                            className={inputClass}
                            min="0"
                            placeholder="100000"
                            type="number"
                            value={startOfDayBalance}
                            onChange={(event) =>
                              setStartOfDayBalance(
                                keepPositiveNumber(event.target.value)
                              )
                            }
                          />
                        </label>

                        <div className={metricCard}>
                          <p className={metricLabel}>Current Value</p>
                          <p className="mt-1 text-xl font-bold text-white">
                            {formatCurrency(dayBalance)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className={wizardStepPanel}>
                      <div className={metricCard}>
                        <p className={metricLabel}>Step 2</p>
                        <h2 className="mt-1 text-lg font-bold">Daily limit</h2>
                        <p className="mt-1 text-sm leading-5 text-neutral-400">
                          Add the daily loss limit percentage from your prop
                          firm rules.
                        </p>
                      </div>

                      <div className={wizardInputArea}>
                        <label className={labelClass}>
                          Daily Loss Limit (%)
                          <input
                            className={inputClass}
                            max="100"
                            min="0"
                            placeholder="5"
                            step="0.1"
                            type="number"
                            value={dailyLossPercent}
                            onChange={(event) =>
                              setDailyLossPercent(
                                keepPercentBetweenZeroAndHundred(
                                  event.target.value
                                )
                              )
                            }
                          />
                        </label>

                        <div className={metricCard}>
                          <p className={metricLabel}>Max Daily Loss</p>
                          <p className="mt-1 text-xl font-bold text-white">
                            {formatCurrency(dailyLossLimit)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className={wizardStepPanel}>
                      <div className={metricCard}>
                        <p className={metricLabel}>Step 3</p>
                        <h2 className="mt-1 text-lg font-bold">
                          Day risk check
                        </h2>
                        <p className="mt-1 text-sm leading-5 text-neutral-400">
                          Enter today&apos;s P/L. Open trade risk is optional.
                        </p>
                      </div>

                      <div className={wizardInputArea}>
                        <label className={labelClass}>
                          Current Day P/L
                          <input
                            className={inputClass}
                            placeholder="-700"
                            step="1"
                            type="number"
                            value={currentDayPL}
                            onChange={(event) =>
                              setCurrentDayPL(event.target.value)
                            }
                          />
                        </label>

                        <label className={labelClass}>
                          Open Trade Risk
                          <input
                            className={inputClass}
                            min="0"
                            placeholder="300"
                            step="1"
                            type="number"
                            value={openTradeRisk}
                            onChange={(event) =>
                              setOpenTradeRisk(
                                keepPositiveNumber(event.target.value)
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="grid gap-3">
                      <div className="grid gap-3 rounded-xl border border-white/10 bg-white p-3 text-black sm:grid-cols-[1fr_0.75fr] sm:items-center">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-neutral-600">
                            Drawdown Report Ready
                          </p>
                          <h2 className="mt-1 text-lg font-bold">
                            Check your daily rule pressure.
                          </h2>
                          <p className="mt-1 text-xs leading-5 text-neutral-600">
                            This report shows how much daily loss room remains
                            before and after open risk.
                          </p>
                        </div>

                        <div className="rounded-lg border border-neutral-200 bg-neutral-100 p-3">
                          <p className={metricLabel}>Remaining Room</p>
                          <p
                            className={`mt-1 text-3xl font-bold leading-none ${remainingRoomColor}`}
                          >
                            {remainingRoom <= 0
                              ? "Breached"
                              : formatCurrency(remainingRoom)}
                          </p>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            Before new risk
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className={metricCard}>
                          <p className={metricLabel}>Daily Loss Limit</p>
                          <p className="mt-1 text-xl font-bold text-white">
                            {formatCurrency(dailyLossLimit)}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">
                            Max loss allowed today.
                          </p>
                        </div>

                        <div className={metricCard}>
                          <p className={metricLabel}>Loss Used Today</p>
                          <p className="mt-1 text-xl font-bold text-red-300">
                            {formatCurrency(lossUsedToday)}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">
                            Positive P/L does not count as loss used.
                          </p>
                        </div>

                        <div className={metricCard}>
                          <p className={metricLabel}>After Open Risk</p>
                          <p
                            className={`mt-1 text-xl font-bold ${remainingAfterRiskColor}`}
                          >
                            {formatCurrency(remainingAfterOpenRisk)}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">
                            Remaining after active exposure.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-[0.7fr_1.3fr]">
                        <div className={metricCard}>
                          <p className={metricLabel}>Status</p>
                          <p
                            className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusColorClass}`}
                          >
                            {drawdownStatus}
                          </p>
                        </div>

                        <div className={metricCard}>
                          <p className={metricLabel}>Final Message</p>
                          <p className="mt-1 text-sm leading-5 text-neutral-300">
                            {remainingRoom <= 0
                              ? "Stop trading. Daily loss limit is breached."
                              : `${drawdownAdvice} Remaining room is ${formatCurrency(
                                  remainingRoom
                                )}.`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-900 pt-3">
                <button
                  className="rounded-lg border border-neutral-800 px-3 py-1.5 text-sm font-semibold text-neutral-300 hover:border-neutral-600 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={isFirstStep}
                  type="button"
                  onClick={goBack}
                >
                  Back
                </button>

                {!isCurrentStepValid && hasTriedToContinue && (
                  <p className="text-sm text-amber-300">{validationMessage}</p>
                )}

                {isLastStep ? (
                  <button
                    className="rounded-lg border border-neutral-800 px-3 py-1.5 text-sm font-semibold text-neutral-300 hover:border-neutral-600"
                    type="button"
                    onClick={startOver}
                  >
                    Start Over
                  </button>
                ) : (
                  <button
                    className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-black hover:bg-neutral-200"
                    type="button"
                    onClick={goNext}
                  >
                    {currentStep === steps.length - 2
                      ? "View Results"
                      : "Next"}
                  </button>
                )}
              </footer>
            </section>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
