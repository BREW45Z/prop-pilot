import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lot Size Calculator | Prop Pilot",
  description:
    "Free lot size calculator for prop traders. Turn your account size, risk percentage, and stop loss into the exact position size for your trade.",
  alternates: {
    canonical: "https://apropilot.com/lot-size-calculator",
  },
};

export default function LotSizeCalculatorPage() {
  return (
    <main className="prop-app relative min-h-screen w-full bg-[var(--app-bg)] text-[var(--text-primary)]">
      <div className="mx-auto grid w-full max-w-3xl gap-10 px-5 py-16 sm:px-8">
        {/* Hero */}
        <header className="grid gap-4 text-center">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Lot Size <span className="text-cyan-300">Calculator</span>
          </h1>
          <p className="mx-auto max-w-xl text-base leading-7 text-[var(--text-muted)]">
            Turn your account size, risk percentage, and stop loss into the
            exact lot size for your next trade.
          </p>
          <Link
            href="/"
            className="mx-auto inline-flex min-w-60 items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-2xl shadow-cyan-500/20 transition hover:bg-cyan-300"
          >
            Open the Calculator
            <span className="ml-3 text-lg leading-none">→</span>
          </Link>
        </header>

        {/* Explainer sections. This is the text Google ranks. */}
        <section className="grid gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-6 backdrop-blur">
          <h2 className="text-xl font-bold">What is lot size?</h2>
          <p className="text-sm leading-7 text-[var(--text-muted)]">
            Lot size is how big your trade is. It decides how much money you
            gain or lose per pip of movement. Trade too big and one bad move can
            blow your risk limit. The right lot size keeps every trade inside
            your plan.
          </p>
        </section>

        <section className="grid gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-6 backdrop-blur">
          <h2 className="text-xl font-bold">How position sizing works</h2>
          <p className="text-sm leading-7 text-[var(--text-muted)]">
            First you decide how much money you are willing to risk, usually a
            small percentage of your account. Then you divide that risk by your
            stop loss distance and the value of each pip. The result is your lot
            size. Prop Pilot does the math for you in one step.
          </p>
        </section>

        <section className="grid gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-6 backdrop-blur">
          <h2 className="text-xl font-bold">Why it matters for prop traders</h2>
          <p className="text-sm leading-7 text-[var(--text-muted)]">
            Consistent position sizing is what keeps a prop account alive. When
            every trade risks the same small amount, one loss cannot end your
            challenge. Size each trade on purpose, not by guesswork.
          </p>
        </section>

        {/* Repeat CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="mx-auto inline-flex min-w-60 items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-2xl shadow-cyan-500/20 transition hover:bg-cyan-300"
          >
            Open the Calculator
            <span className="ml-3 text-lg leading-none">→</span>
          </Link>
        </div>

        <footer className="border-t border-[var(--border-soft)] pt-6 text-center text-xs text-[var(--text-muted)]">
          © 2026 Prop Pilot · Built for disciplined prop traders.
        </footer>
      </div>
    </main>
  );
}
