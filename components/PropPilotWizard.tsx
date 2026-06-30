"use client";

import {
  calculateDailyLossLimit,
  calculateLossUsedToday,
  calculatePositionSizeLots,
  calculateRemainingDailyLossRoom,
  calculateRemainingRoomAfterOpenRisk,
  calculateRiskAmount,
  getDailyDrawdownStatus,
} from "@/lib/calculations";
import { toPng } from "html-to-image";
import {
  Activity,
  BarChart3,
  BookOpen,
  Calculator,
  ClipboardList,
  Moon,
  Settings,
  Sun,
  TrendingDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ActiveTool = "risk" | "drawdown";
type CopiedSummary = ActiveTool | null;
type ThemeMode = "dark" | "light";

// Saved browser preference shapes.
type RiskCalculatorStorage = {
  accountSize: string;
  riskPercent: string;
  stopLoss: string;
  dollarValuePerPip: string;
};

type DailyDrawdownStorage = {
  startOfDayBalance: string;
  dailyLossPercent: string;
  currentDayPL: string;
  openTradeRisk: string;
};

const storageKeys = {
  lastTool: "propPilot.lastTool",
  riskCalculator: "propPilot.riskCalculator",
  dailyDrawdown: "propPilot.dailyDrawdown",
  theme: "propPilot.theme",
};

// Wizard step labels.
const riskSteps = ["Account", "Risk", "Trade Setup", "Results"];
const drawdownSteps = ["Balance", "Limit", "Day Risk", "Results"];

// Shared UI class names used across the wizard.
const inputClass =
  "h-9 rounded-lg border border-[var(--border-soft)] bg-[var(--surface-strong)] px-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-faint)] hover:border-[var(--border-strong)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]";
const labelClass = "grid gap-1.5 text-xs font-semibold text-[var(--text-soft)]";
const metricCard =
  "h-full rounded-xl border border-[var(--border-soft)] bg-[var(--surface-strong)] p-3 shadow-sm shadow-black/10 transition hover:border-[var(--border-strong)]";
const metricLabel =
  "text-[11px] font-bold uppercase tracking-wide text-[var(--text-faint)]";
const wizardStepPanel =
  "grid min-h-[14rem] items-center gap-4 lg:h-56 lg:grid-cols-[17rem_minmax(0,1fr)]";
const wizardInputArea =
  "grid min-h-[8.5rem] items-stretch gap-3 rounded-xl border border-[var(--border-soft)] bg-[var(--surface-muted)] p-3 sm:grid-cols-2";

const futureTools = [
  { label: "Consistency Tracker", Icon: ClipboardList },
  { label: "Prop Health Score", Icon: Activity },
  { label: "Journal", Icon: BookOpen },
  { label: "Presets", Icon: Settings },
];

const drawdownInsightMessages = {
  Healthy: [
    "Plenty of room remains. Stay disciplined and keep your planned risk unchanged.",
    "Capital is protected. There is no need to increase risk just because you have room left.",
    "Your account still has breathing room. Trade the plan, not the emotion.",
    "Good position. Protect the day and avoid unnecessary risk.",
  ],
  "Close to Breach": [
    "Today's objective is account preservation. Waiting for tomorrow is better than forcing another trade.",
    "You are trading with limited margin for error. Only take an A+ setup.",
    "Protect the account first. Missing one trade costs less than losing the challenge.",
    "This is not the time to chase. Protect your remaining room.",
    "One unnecessary trade can turn a bad day into a failed account.",
  ],
  Breached: [
    "Your daily loss limit has been breached. Before your next prop account, set your limits in Prop Pilot before placing the first trade.",
    "The daily rule has been broken. Use this result as a reset point, not a reason to chase.",
    "Stop here. On the next account, calculate daily risk before the first trade-not after the damage.",
    "A prop challenge is protected one decision at a time. Build the risk plan before the next session.",
  ],
};

type DrawdownInsightStatus = keyof typeof drawdownInsightMessages;

function FieldLabel({ helpText, label }: { helpText: string; label: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative flex items-center gap-1.5">
      <span>{label}</span>
      <button
        className="inline-grid size-4 place-items-center rounded-full border border-[var(--border-soft)] text-[10px] font-bold text-[var(--text-muted)] outline-none transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] focus:border-[var(--accent)] focus:text-[var(--text-primary)]"
        type="button"
        aria-expanded={isOpen}
        aria-label={`${label}: ${helpText}`}
        onBlur={() => setIsOpen(false)}
        onClick={(event) => {
          event.preventDefault();
          setIsOpen((currentValue) => !currentValue);
        }}
      >
        ⓘ
      </button>
      {isOpen && (
        <span className="absolute left-0 top-6 z-50 w-64 max-w-[calc(100vw-2rem)] rounded-lg border border-[var(--border-soft)] bg-[var(--surface-strong)] px-3 py-2 text-left text-xs font-medium leading-5 text-[var(--text-primary)] shadow-2xl shadow-black/20">
          {helpText}
        </span>
      )}
    </span>
  );
}

// Runtime guards keep localStorage data safe before using it.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown) {
  return typeof value === "string";
}

function isActiveTool(value: unknown): value is ActiveTool {
  return value === "risk" || value === "drawdown";
}

function isThemeMode(value: unknown): value is ThemeMode {
  return value === "dark" || value === "light";
}

function isRiskCalculatorStorage(
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

function isDailyDrawdownStorage(value: unknown): value is DailyDrawdownStorage {
  return (
    isRecord(value) &&
    isString(value.startOfDayBalance) &&
    isString(value.dailyLossPercent) &&
    isString(value.currentDayPL) &&
    isString(value.openTradeRisk)
  );
}

function getDrawdownInsightStatus(status: string): DrawdownInsightStatus {
  if (status === "Close to Breach" || status === "Breached") {
    return status;
  }

  return "Healthy";
}

function getRandomDrawdownInsight(status: string) {
  const insightStatus = getDrawdownInsightStatus(status);
  const messages = drawdownInsightMessages[insightStatus];
  const randomIndex = Math.floor(Math.random() * messages.length);

  return messages[randomIndex];
}

function AtomBackground() {
  return (
    <div className="atom-field" aria-hidden="true">
      <span className="atom-line atom-line-a" />
      <span className="atom-line atom-line-b" />
      <span className="atom-line atom-line-c" />
      <span className="atom-dot atom-dot-a" />
      <span className="atom-dot atom-dot-b" />
      <span className="atom-dot atom-dot-c" />
      <span className="atom-dot atom-dot-d" />
    </div>
  );
}

function ThemeToggle({
  onToggle,
  theme,
}: {
  onToggle: () => void;
  theme: ThemeMode;
}) {
  const isDark = theme === "dark";

  return (
    <button
      className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface)] p-1 text-[var(--text-soft)] shadow-lg shadow-black/10 backdrop-blur transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={onToggle}
    >
      <span className="grid size-7 place-items-center rounded-full">
        <Sun className="size-4" />
      </span>
      <span
        className={`grid size-7 place-items-center rounded-full transition ${
          isDark
            ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30"
            : "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
        }`}
      >
        <Moon className="size-4" />
      </span>
    </button>
  );
}

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/10">
        <BarChart3 className="size-6" />
      </div>
      <div>
        <p className="text-sm font-black uppercase tracking-[0.28em] text-[var(--text-primary)]">
          Prop Pilot
        </p>
        <p className="text-xs text-[var(--text-muted)]">Trader toolkit</p>
      </div>
    </div>
  );
}

export default function PropPilotWizard() {
  // Sidebar tool state.
  const [activeTool, setActiveTool] = useState<ActiveTool>("risk");
  const [hasStarted, setHasStarted] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");

  // Each sidebar tool keeps its own wizard step.
  const [riskStep, setRiskStep] = useState(0);
  const [drawdownStep, setDrawdownStep] = useState(0);
  const [hasTriedToContinue, setHasTriedToContinue] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState<CopiedSummary>(null);
  const [copyFailedSummary, setCopyFailedSummary] =
    useState<CopiedSummary>(null);
  const [shareCardType, setShareCardType] = useState<ActiveTool | null>(null);
  const [downloadError, setDownloadError] = useState("");
  const [drawdownInsight, setDrawdownInsight] = useState(
    drawdownInsightMessages.Healthy[0],
  );
  const shareCardRef = useRef<HTMLDivElement | null>(null);
  const hasLoadedSavedValues = useRef(false);
  const hasLoadedTheme = useRef(false);

  // Risk Calculator form state.
  const [accountSize, setAccountSize] = useState("50000");
  const [riskPercent, setRiskPercent] = useState("1");
  const [stopLoss, setStopLoss] = useState("");
  const [dollarValuePerPip, setDollarValuePerPip] = useState("10");

  // Daily Drawdown form state.
  const [startOfDayBalance, setStartOfDayBalance] = useState("50000");
  const [dailyLossPercent, setDailyLossPercent] = useState("5");
  const [currentDayPL, setCurrentDayPL] = useState("");
  const [openTradeRisk, setOpenTradeRisk] = useState("");

  // Load saved theme or system preference once after the browser is ready.
  useEffect(() => {
    const loadTheme = window.setTimeout(() => {
      const savedTheme = localStorage.getItem(storageKeys.theme);
      const systemPrefersLight = window.matchMedia(
        "(prefers-color-scheme: light)",
      ).matches;
      const nextTheme = isThemeMode(savedTheme)
        ? savedTheme
        : systemPrefersLight
          ? "light"
          : "dark";

      document.documentElement.dataset.theme = nextTheme;
      hasLoadedTheme.current = true;
      setTheme(nextTheme);
    }, 0);

    return () => window.clearTimeout(loadTheme);
  }, []);

  // Persist explicit theme changes.
  useEffect(() => {
    if (!hasLoadedTheme.current) {
      return;
    }

    document.documentElement.dataset.theme = theme;
    localStorage.setItem(storageKeys.theme, theme);
  }, [theme]);

  // Load saved tool and input values once after the browser is ready.
  useEffect(() => {
    const loadSavedValues = window.setTimeout(() => {
      const savedTool = localStorage.getItem(storageKeys.lastTool);

      if (isActiveTool(savedTool)) {
        setActiveTool(savedTool);
      }

      const savedRiskCalculator = localStorage.getItem(
        storageKeys.riskCalculator,
      );

      if (savedRiskCalculator) {
        try {
          const parsedRiskCalculator = JSON.parse(savedRiskCalculator);

          if (isRiskCalculatorStorage(parsedRiskCalculator)) {
            setAccountSize(parsedRiskCalculator.accountSize);
            setRiskPercent(parsedRiskCalculator.riskPercent);
            setStopLoss(parsedRiskCalculator.stopLoss);
            setDollarValuePerPip(parsedRiskCalculator.dollarValuePerPip);
          }
        } catch {
          // Ignore invalid saved risk calculator data.
        }
      }

      const savedDailyDrawdown = localStorage.getItem(
        storageKeys.dailyDrawdown,
      );

      if (savedDailyDrawdown) {
        try {
          const parsedDailyDrawdown = JSON.parse(savedDailyDrawdown);

          if (isDailyDrawdownStorage(parsedDailyDrawdown)) {
            setStartOfDayBalance(parsedDailyDrawdown.startOfDayBalance);
            setDailyLossPercent(parsedDailyDrawdown.dailyLossPercent);
            setCurrentDayPL(parsedDailyDrawdown.currentDayPL);
            setOpenTradeRisk(parsedDailyDrawdown.openTradeRisk);
          }
        } catch {
          // Ignore invalid saved daily drawdown data.
        }
      }

      hasLoadedSavedValues.current = true;
    }, 0);

    return () => window.clearTimeout(loadSavedValues);
  }, []);

  // Save the selected sidebar tool after saved values have loaded.
  useEffect(() => {
    if (!hasLoadedSavedValues.current) {
      return;
    }

    localStorage.setItem(storageKeys.lastTool, activeTool);
  }, [activeTool]);

  // Save Risk Calculator inputs whenever the user edits them.
  useEffect(() => {
    if (!hasLoadedSavedValues.current) {
      return;
    }

    const riskCalculatorData: RiskCalculatorStorage = {
      accountSize,
      riskPercent,
      stopLoss,
      dollarValuePerPip,
    };

    localStorage.setItem(
      storageKeys.riskCalculator,
      JSON.stringify(riskCalculatorData),
    );
  }, [accountSize, riskPercent, stopLoss, dollarValuePerPip]);

  // Save Daily Drawdown inputs whenever the user edits them.
  useEffect(() => {
    if (!hasLoadedSavedValues.current) {
      return;
    }

    const dailyDrawdownData: DailyDrawdownStorage = {
      startOfDayBalance,
      dailyLossPercent,
      currentDayPL,
      openTradeRisk,
    };

    localStorage.setItem(
      storageKeys.dailyDrawdown,
      JSON.stringify(dailyDrawdownData),
    );
  }, [startOfDayBalance, dailyLossPercent, currentDayPL, openTradeRisk]);

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
    tradeRisk,
  );

  // Daily Drawdown status and insight.
  const drawdownStatus = getDailyDrawdownStatus(remainingRoom, dailyLossLimit);
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
      if (activeTool === "drawdown" && currentStep === steps.length - 2) {
        setDrawdownInsight(getRandomDrawdownInsight(drawdownStatus));
      }

      setHasTriedToContinue(false);
      setActiveStep(currentStep + 1);
    }
  }

  function startOver() {
    setHasTriedToContinue(false);
    setActiveStep(0);
  }

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
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

  function formatWholeCurrency(value: number) {
    return formatSummaryCurrency(value, 0);
  }

  function formatSummaryCurrency(value: number, fractionDigits = 2) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value);
  }

  // Plain-text summaries are used by the Copy Summary growth-loop action.
  function buildRiskSummaryText() {
    return `Prop Pilot Risk Summary
Account Size: ${formatSummaryCurrency(account, 0)}
Risk: ${risk.toString()}%
Stop Loss: ${sl.toString()} pips
Dollar Value per Pip: ${formatSummaryCurrency(pipValue, 0)}
Risk Amount: ${formatSummaryCurrency(riskAmount)}
Position Size: ${positionSize.toFixed(2)} lots

Calculated with Prop Pilot`;
  }

  function buildDailyDrawdownSummaryText() {
    const summaryStatus =
      drawdownStatus === "Healthy" ? "Safe" : drawdownStatus;

    return `Prop Pilot Daily Drawdown Summary
Account Balance: ${formatSummaryCurrency(dayBalance, 0)}
Daily Loss Limit: ${dailyLoss.toString()}%
Current Day P/L: ${formatSummaryCurrency(dayPL, 0)}
Open Trade Risk: ${formatSummaryCurrency(tradeRisk, 0)}
Maximum Daily Loss Allowed: ${formatSummaryCurrency(dailyLossLimit)}
Loss Used Today: ${formatSummaryCurrency(lossUsedToday)}
Remaining Loss Room: ${formatSummaryCurrency(remainingRoom)}
Remaining Room After Open Risk: ${formatSummaryCurrency(remainingAfterOpenRisk)}
Status: ${summaryStatus}

Calculated with Prop Pilot`;
  }

  async function copySummary(type: ActiveTool) {
    const summaryText =
      type === "risk"
        ? buildRiskSummaryText()
        : buildDailyDrawdownSummaryText();

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopyFailedSummary(null);
      setCopiedSummary(type);
      setTimeout(() => setCopiedSummary(null), 2000);
    } catch {
      setCopiedSummary(null);
      setCopyFailedSummary(type);
      setTimeout(() => setCopyFailedSummary(null), 2000);
    }
  }

  // Share Card modal state and PNG download helper.
  function openShareCard(type: ActiveTool) {
    setDownloadError("");
    setShareCardType(type);
  }

  function closeShareCard() {
    setDownloadError("");
    setShareCardType(null);
  }

  async function downloadShareCard() {
    if (!shareCardRef.current || !shareCardType) {
      return;
    }

    try {
      setDownloadError("");

      const dataUrl = await toPng(shareCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download =
        shareCardType === "risk"
          ? "prop-pilot-risk-report.png"
          : "prop-pilot-daily-drawdown-report.png";
      link.href = dataUrl;
      link.click();
    } catch {
      setDownloadError("Could not download PNG. Please try again.");
    }
  }

  // Compact desktop app shell with tool-specific wizard panels.
  return (
    <section className="prop-app relative min-h-screen w-full bg-[var(--app-bg)] text-[var(--text-primary)] transition-colors duration-300 lg:h-screen lg:overflow-hidden">
      <AtomBackground />

      {!hasStarted ? (
        <div className="relative z-10 grid min-h-screen content-between px-5 py-7 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between gap-4">
            <BrandMark />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </header>

          <div className="mx-auto grid w-full max-w-4xl justify-items-center gap-7 py-10 text-center">
            <div className="grid gap-4">
              <h1 className="mx-auto max-w-3xl text-4xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
                Know your risk{" "}
                <span className="text-violet-400">before</span> you place the
                trade.
              </h1>
              <p className="mx-auto max-w-xl text-base leading-7 text-[var(--text-muted)]">
                A simple tool for prop traders to manage risk, daily drawdown,
                and rule discipline.
              </p>
            </div>

            <button
              className="inline-flex min-w-60 items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 text-sm font-bold text-white shadow-2xl shadow-blue-500/20 transition hover:scale-[1.01] hover:from-violet-400 hover:to-blue-400"
              type="button"
              onClick={() => setHasStarted(true)}
            >
              Start Calculating
              <span className="ml-3 text-lg leading-none">→</span>
            </button>

            <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Risk Calculator",
                  text: "Size your trades with confidence.",
                  Icon: Calculator,
                },
                {
                  title: "Daily Drawdown",
                  text: "Stay within your daily loss limit.",
                  Icon: TrendingDown,
                },
                {
                  title: "Discipline First",
                  text: "Protect your account. Profits follow.",
                  Icon: Activity,
                },
              ].map(({ Icon, text, title }) => (
                <div
                  className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-5 text-left shadow-xl shadow-black/10 backdrop-blur"
                  key={title}
                >
                  <div className="mb-4 grid size-10 place-items-center rounded-full bg-violet-500/15 text-violet-300">
                    <Icon className="size-5" />
                  </div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">
                    {title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-sm text-[var(--text-muted)]">
              Free to use. No sign-up required.
            </p>
          </div>

          <footer className="text-center text-xs text-[var(--text-faint)]">
            Built for prop traders who want to avoid rule breaches.
          </footer>
        </div>
      ) : (
        <div className="relative z-10 min-h-screen md:grid md:h-screen md:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="flex border-b border-[var(--border-soft)] bg-[var(--surface)] p-4 shadow-2xl shadow-black/20 backdrop-blur md:h-screen md:flex-col md:border-b-0 md:border-r">
          <div className="w-full">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/10">
                <BarChart3 className="size-6" />
              </div>
              <div>
                <p className="text-base font-bold text-white">Prop Pilot</p>
                <p className="text-xs text-slate-500">Trader toolkit</p>
              </div>
            </div>

            <button
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-[var(--border-soft)] bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-soft)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              type="button"
              onClick={() => setHasStarted(false)}
            >
              Back to Home
            </button>

            <nav className="mt-7 grid gap-1.5">
              <p className="mb-1 px-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Tools
              </p>

              <button
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition ${
                  activeTool === "risk"
                    ? "border-cyan-400/30 bg-cyan-400/10 text-white shadow-lg shadow-cyan-500/10"
                    : "border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/80 hover:text-white"
                }`}
                type="button"
                onClick={() => changeTool("risk")}
              >
                <Calculator className="size-5 text-cyan-300" />
                Risk Calculator
              </button>

              <button
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition ${
                  activeTool === "drawdown"
                    ? "border-cyan-400/30 bg-cyan-400/10 text-white shadow-lg shadow-cyan-500/10"
                    : "border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/80 hover:text-white"
                }`}
                type="button"
                onClick={() => changeTool("drawdown")}
              >
                <TrendingDown className="size-5 text-cyan-300" />
                Daily Drawdown
              </button>
            </nav>

            <div className="mt-6 grid gap-1.5 border-t border-slate-800/70 pt-5">
              <p className="mb-1 px-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Coming Soon
              </p>
              {futureTools.map(({ label, Icon }) => (
                <p
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-900/50 hover:text-slate-400"
                  key={label}
                >
                  <Icon className="size-5" />
                  {label}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-auto hidden border-t border-slate-800/70 pt-4 text-xs leading-5 text-slate-500 md:block">
            <p>© 2026 Prop Pilot</p>
            <p>Built for prop traders who want to avoid rule breaches.</p>
            <a
              className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-blue-400/40 bg-blue-500/15 px-3 py-2 text-xs font-bold text-blue-200 shadow-lg shadow-blue-500/10 transition hover:border-blue-300/70 hover:bg-blue-500/25 hover:text-white"
              href="mailto:your-email@example.com"
            >
              Send feedback
            </a>
          </div>
        </aside>

        <main className="relative min-h-0 px-4 pb-8 pt-20 md:h-screen md:min-w-0 md:overflow-hidden md:px-8 md:pt-32">
          <div className="absolute right-4 top-4 md:right-8 md:top-8">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>

          <div className="mx-auto grid h-full w-full max-w-5xl content-start gap-3">
            <header className="border-b border-slate-800/70 pb-4">
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-300/80">
                Ask the Trade Wizard
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
                {pageTitle}
              </h1>
              <p className="mt-1 text-sm text-slate-400">{pageSubtitle}</p>
            </header>

            <div className="grid min-h-0 justify-items-center pt-2">
              <section className="mx-auto grid w-full max-w-5xl gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-2xl shadow-black/30 backdrop-blur">
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
                                ? "border-cyan-300 bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25"
                                : isComplete
                                  ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                                  : "border-slate-700 bg-slate-950 text-slate-500"
                            }`}
                          >
                            {index + 1}
                          </span>

                          <div>
                            <p
                              className={`text-sm font-semibold leading-4 ${
                                isActive ? "text-white" : "text-slate-500"
                              }`}
                            >
                              {step}
                            </p>
                            <p className="text-xs text-slate-600">
                              {index === steps.length - 1
                                ? "Risk report"
                                : "Required step"}
                            </p>
                          </div>
                        </div>

                        {index < steps.length - 1 && (
                          <div
                            className={`hidden h-px flex-1 sm:block ${
                              isComplete ? "bg-cyan-400/50" : "bg-slate-800"
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
                          <p className="mt-1 text-sm leading-5 text-slate-400">
                            Start with the account size you want to risk from.
                          </p>
                        </div>

                        <div className={wizardInputArea}>
                          <label className={labelClass}>
                            <FieldLabel
                              label="Account Size"
                              helpText="The account balance used to calculate risk."
                            />
                            <input
                              className={inputClass}
                              min="0"
                              placeholder="5000"
                              type="number"
                              value={accountSize}
                              onChange={(event) =>
                                setAccountSize(
                                  keepPositiveNumber(event.target.value),
                                )
                              }
                            />
                          </label>

                          <div className={metricCard}>
                            <p className={metricLabel}>Account Balance</p>
                            <p className="mt-1 text-xl font-bold text-white">
                              {formatWholeCurrency(account)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 1 && (
                      <div className={wizardStepPanel}>
                        <div className={metricCard}>
                          <p className={metricLabel}>Step 2</p>
                          <h2 className="mt-1 text-lg font-bold">
                            Risk setting
                          </h2>
                          <p className="mt-1 text-sm leading-5 text-slate-400">
                            Choose how much of the account to risk on this
                            trade.
                          </p>
                        </div>

                        <div className={wizardInputArea}>
                          <label className={labelClass}>
                            <FieldLabel
                              label="Risk (%)"
                              helpText="The percentage of your account you are willing to risk on one trade."
                            />
                            <input
                              className={inputClass}
                              min="0"
                              placeholder="1"
                              step="0.1"
                              type="number"
                              value={riskPercent}
                              onChange={(event) =>
                                setRiskPercent(
                                  keepPositiveNumber(event.target.value),
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
                          <h2 className="mt-1 text-lg font-bold">
                            Trade setup
                          </h2>
                          <p className="mt-1 text-sm leading-5 text-slate-400">
                            Add stop distance and pip value to calculate lots.
                          </p>
                        </div>

                        <div className={wizardInputArea}>
                          <label className={labelClass}>
                            <FieldLabel
                              label="Stop Loss (pips)"
                              helpText="The distance between your entry and stop loss."
                            />
                            <input
                              className={inputClass}
                              min="0"
                              placeholder="20"
                              step="0.1"
                              type="number"
                              value={stopLoss}
                              onChange={(event) =>
                                setStopLoss(
                                  keepPositiveNumber(event.target.value),
                                )
                              }
                            />
                          </label>

                          <label className={labelClass}>
                            <FieldLabel
                              label="Dollar Value per Pip"
                              helpText="How much one pip is worth for your position."
                            />
                            <input
                              className={inputClass}
                              min="0"
                              placeholder="10"
                              step="0.01"
                              type="number"
                              value={dollarValuePerPip}
                              onChange={(event) =>
                                setDollarValuePerPip(
                                  keepPositiveNumber(event.target.value),
                                )
                              }
                            />
                          </label>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="grid gap-3">
                        <div className="grid gap-3 rounded-xl border border-cyan-400/20 bg-slate-950/90 p-3 text-slate-100 sm:grid-cols-[1fr_0.75fr] sm:items-center">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-cyan-300">
                              Risk Report Ready
                            </p>
                            <h2 className="mt-1 text-lg font-bold">
                              Confirm position size before entry.
                            </h2>
                            <p className="mt-1 text-xs leading-5 text-slate-400">
                              This report turns account risk, stop loss, and pip
                              value into a clear lot size.
                            </p>

                            {/* Result actions: copy plain text or open the branded Share Card modal. */}
                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                className="inline-flex w-fit rounded-lg border border-slate-700/80 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-white"
                                type="button"
                                onClick={() => copySummary("risk")}
                              >
                                {copiedSummary === "risk"
                                  ? "Copied"
                                  : copyFailedSummary === "risk"
                                    ? "Copy failed"
                                    : "Copy Summary"}
                              </button>

                              <button
                                className="inline-flex w-fit rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
                                type="button"
                                onClick={() => openShareCard("risk")}
                              >
                                Share Card
                              </button>
                            </div>
                          </div>

                          <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-3">
                            <p className={metricLabel}>
                              <FieldLabel
                                label="Position Size"
                                helpText="The lot size calculated from your risk and stop loss."
                              />
                            </p>
                            <p className="mt-1 text-3xl font-bold leading-none text-cyan-300">
                              {positionSize.toFixed(2)}
                            </p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                            <p className="mt-1 text-xs text-slate-500">
                              Amount at risk on this trade.
                            </p>
                          </div>

                          <div className={metricCard}>
                            <p className={metricLabel}>Risk Percent</p>
                            <p className="mt-1 text-xl font-bold text-white">
                              {risk.toFixed(2)}%
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              Based on account size.
                            </p>
                          </div>

                          <div className={metricCard}>
                            <p className={metricLabel}>Stop Distance</p>
                            <p className="mt-1 text-xl font-bold text-white">
                              {sl.toFixed(1)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
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
                          <p className="mt-1 text-sm leading-5 text-slate-400">
                            Use the balance your daily drawdown rule starts
                            from.
                          </p>
                        </div>

                        <div className={wizardInputArea}>
                          <label className={labelClass}>
                            <FieldLabel
                              label="Start of Day Balance"
                              helpText="The balance your daily drawdown rule starts from."
                            />
                            <input
                              className={inputClass}
                              min="0"
                              placeholder="100000"
                              type="number"
                              value={startOfDayBalance}
                              onChange={(event) =>
                                setStartOfDayBalance(
                                  keepPositiveNumber(event.target.value),
                                )
                              }
                            />
                          </label>

                          <div className={metricCard}>
                            <p className={metricLabel}>Start-of-Day Balance</p>
                            <p className="mt-1 text-xl font-bold text-white">
                              {formatWholeCurrency(dayBalance)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 1 && (
                      <div className={wizardStepPanel}>
                        <div className={metricCard}>
                          <p className={metricLabel}>Step 2</p>
                          <h2 className="mt-1 text-lg font-bold">
                            Daily limit
                          </h2>
                          <p className="mt-1 text-sm leading-5 text-slate-400">
                            Add the daily loss limit percentage from your prop
                            firm rules.
                          </p>
                        </div>

                        <div className={wizardInputArea}>
                          <label className={labelClass}>
                            <FieldLabel
                              label="Daily Loss Limit (%)"
                              helpText="The maximum percentage your prop firm allows you to lose in one day."
                            />
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
                                    event.target.value,
                                  ),
                                )
                              }
                            />
                          </label>

                          <div className={metricCard}>
                            <p className={metricLabel}>Max Daily Loss</p>
                            <p className="drawdown-amount mt-1 text-xl font-bold text-white">
                              {formatCurrency(dailyLossLimit)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              Based on start balance and limit.
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
                          <p className="mt-1 text-sm leading-5 text-slate-400">
                            Enter today&apos;s P/L. Open trade risk is optional.
                          </p>
                        </div>

                        <div className={wizardInputArea}>
                          <label className={labelClass}>
                            <FieldLabel
                              label="Current Day P/L"
                              helpText="Your profit or loss for the current trading day."
                            />
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
                            <FieldLabel
                              label="Open Trade Risk"
                              helpText="The amount still at risk if open trades hit stop loss."
                            />
                            <input
                              className={inputClass}
                              min="0"
                              placeholder="300"
                              step="1"
                              type="number"
                              value={openTradeRisk}
                              onChange={(event) =>
                                setOpenTradeRisk(
                                  keepPositiveNumber(event.target.value),
                                )
                              }
                            />
                          </label>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="grid gap-3">
                        <div className="grid gap-3 rounded-xl border border-cyan-400/20 bg-slate-950/90 p-3 text-slate-100 sm:grid-cols-[1fr_0.75fr] sm:items-center">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-cyan-300">
                              Drawdown Report Ready
                            </p>
                            <h2 className="mt-1 text-lg font-bold">
                              Check your daily rule pressure.
                            </h2>
                            <p className="mt-1 text-xs leading-5 text-slate-400">
                              This report shows how much daily loss room remains
                              before and after open risk.
                            </p>

                            {/* Result actions: copy plain text or open the branded Share Card modal. */}
                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                className="inline-flex w-fit rounded-lg border border-slate-700/80 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-white"
                                type="button"
                                onClick={() => copySummary("drawdown")}
                              >
                                {copiedSummary === "drawdown"
                                  ? "Copied"
                                  : copyFailedSummary === "drawdown"
                                    ? "Copy failed"
                                    : "Copy Summary"}
                              </button>

                              <button
                                className="inline-flex w-fit rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
                                type="button"
                                onClick={() => openShareCard("drawdown")}
                              >
                                Share Card
                              </button>
                            </div>
                          </div>

                          <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-3">
                            <p className={metricLabel}>
                              <FieldLabel
                                label="Remaining Room"
                                helpText="How much more loss room remains before reaching the daily limit."
                              />
                            </p>
                            <p
                              className={`drawdown-amount mt-1 text-3xl font-bold leading-none ${remainingRoomColor}`}
                            >
                              {remainingRoom <= 0
                                ? "Breached"
                                : formatCurrency(remainingRoom)}
                            </p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Before new risk
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className={metricCard}>
                            <p className={metricLabel}>
                              <FieldLabel
                                label="Daily Loss Limit"
                                helpText="The maximum percentage your prop firm allows you to lose in one day."
                              />
                            </p>
                            <p className="mt-1 text-xl font-bold text-white">
                              {formatCurrency(dailyLossLimit)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              Max loss allowed today.
                            </p>
                          </div>

                          <div className={metricCard}>
                            <p className={metricLabel}>Loss Used Today</p>
                            <p className="drawdown-amount mt-1 text-xl font-bold text-red-300">
                              {formatCurrency(lossUsedToday)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              Positive P/L does not count as loss used.
                            </p>
                          </div>

                          <div className={metricCard}>
                            <p className={metricLabel}>
                              <FieldLabel
                                label="After Open Risk"
                                helpText="The remaining room after subtracting current open-trade risk."
                              />
                            </p>
                            <p
                              className={`drawdown-amount mt-1 text-xl font-bold ${remainingAfterRiskColor}`}
                            >
                              {formatCurrency(remainingAfterOpenRisk)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
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
                            <p className={metricLabel}>Trading Insight</p>
                            <p
                              className="trading-insight-slide mt-1 text-sm leading-5 text-slate-300"
                              key={drawdownInsight}
                            >
                              {drawdownInsight}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3">
                  <button
                    className="rounded-lg border border-slate-700/80 px-3 py-1.5 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={isFirstStep}
                    type="button"
                    onClick={goBack}
                  >
                    Back
                  </button>

                  {!isCurrentStepValid && hasTriedToContinue && (
                    <p className="text-sm text-amber-300">
                      {validationMessage}
                    </p>
                  )}

                  {isLastStep ? (
                    <button
                      className="rounded-lg border border-slate-700/80 px-3 py-1.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-white"
                      type="button"
                      onClick={startOver}
                    >
                      Start Over
                    </button>
                  ) : (
                    <button
                      className="rounded-lg bg-cyan-400 px-3 py-1.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
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
      )}

      {/* Share Card modal: preview and PNG download. */}
      {shareCardType && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Share card preview"
        >
          <button
            className="absolute inset-0 cursor-default"
            type="button"
            aria-label="Close share card preview"
            onClick={closeShareCard}
          />

          <div className="relative z-10 w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl shadow-black/60">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-white">Share Card</p>
                <p className="text-xs text-slate-500">
                  Download exactly this branded report preview.
                </p>
              </div>

              <button
                className="rounded-lg border border-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-400 transition hover:border-slate-600 hover:bg-slate-900 hover:text-white"
                type="button"
                onClick={closeShareCard}
              >
                Close
              </button>
            </div>

            <div
              ref={shareCardRef}
              className="share-card-preview relative overflow-hidden rounded-2xl border border-slate-800 bg-[#07111f] p-5 text-slate-100"
            >
              <p className="share-card-watermark pointer-events-none absolute right-4 top-4 text-4xl font-black uppercase tracking-widest text-white/[0.03]">
                PROP PILOT
              </p>

              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                  Prop Pilot
                </p>

                <h2 className="mt-4 text-xl font-bold text-white">
                  {shareCardType === "risk"
                    ? "Risk Summary"
                    : "Daily Drawdown Summary"}
                </h2>

                <div className="mt-5 grid gap-2 text-sm">
                  {shareCardType === "risk" ? (
                    <>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Account Size</span>
                        <span className="font-semibold text-white">
                          {formatSummaryCurrency(account, 0)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Risk</span>
                        <span className="font-semibold text-white">
                          {risk}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Stop Loss</span>
                        <span className="font-semibold text-white">
                          {sl} pips
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">
                          Dollar Value per Pip
                        </span>
                        <span className="font-semibold text-white">
                          {formatSummaryCurrency(pipValue, 0)}
                        </span>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                          <p className="text-xs text-slate-500">Risk Amount</p>
                          <p className="mt-1 text-lg font-bold text-white">
                            {formatCurrency(riskAmount)}
                          </p>
                        </div>

                        <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-3">
                          <p className="text-xs text-cyan-200">Position Size</p>
                          <p className="mt-1 text-lg font-bold text-cyan-300">
                            {positionSize.toFixed(2)} lots
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Account Balance</span>
                        <span className="font-semibold text-white">
                          {formatSummaryCurrency(dayBalance, 0)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Daily Loss Limit</span>
                        <span className="font-semibold text-white">
                          {dailyLoss}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Current Day P/L</span>
                        <span className="font-semibold text-white">
                          {formatSummaryCurrency(dayPL, 0)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Open Trade Risk</span>
                        <span className="font-semibold text-white">
                          {formatSummaryCurrency(tradeRisk, 0)}
                        </span>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                          <p className="text-xs text-slate-500">
                            Max Daily Loss
                          </p>
                          <p className="mt-1 text-lg font-bold text-white">
                            {formatCurrency(dailyLossLimit)}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                          <p className="text-xs text-slate-500">
                            Loss Used Today
                          </p>
                          <p className="mt-1 text-lg font-bold text-white">
                            {formatCurrency(lossUsedToday)}
                          </p>
                        </div>

                        <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-3">
                          <p className="text-xs text-cyan-200">
                            Remaining Room
                          </p>
                          <p
                            className={`share-card-value mt-1 text-lg font-bold ${remainingRoomColor}`}
                          >
                            {formatCurrency(remainingRoom)}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                          <p className="text-xs text-slate-500">
                            After Open Risk
                          </p>
                          <p
                            className={`share-card-value mt-1 text-lg font-bold ${remainingAfterRiskColor}`}
                          >
                            {formatCurrency(remainingAfterOpenRisk)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                        <span className="text-xs text-slate-500">Status</span>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${statusColorClass}`}
                        >
                          {drawdownStatus === "Healthy"
                            ? "Safe"
                            : drawdownStatus}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <p className="mt-5 text-xs text-slate-500">
                  Calculated with Prop Pilot.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">
                  Export a clean PNG for sharing.
                </p>
                {downloadError && (
                  <p className="mt-1 text-xs font-semibold text-red-300">
                    {downloadError}
                  </p>
                )}
              </div>

              <button
                className="ml-auto rounded-xl bg-blue-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
                type="button"
                onClick={downloadShareCard}
              >
                Download PNG
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
