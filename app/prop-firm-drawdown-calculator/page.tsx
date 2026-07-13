import type { Metadata } from "next";
import Link from "next/link";

// Per-page SEO metadata targeting the search phrase.
export const metadata: Metadata = {
  title: "Prop Firm Drawdown Calculator | Prop Pilot",
  description:
    "Free prop firm drawdown calculator. See how much daily loss room you have left before you breach your daily loss limit.",
  alternates: {
    canonical: "https://apropilot.com/prop-firm-drawdown-calculator",
  },
};

export default function PropFirmDrawdownCalculatorPage() {
  return (
    <main className="prop-app relative min-h-screen w-full bg-[var(--app-bg)] text-[var(--text-primary)]">
      <div className="mx-auto grid w-full max-w-3xl gap-10 px-5 py-16 sm:px-8">
        {/* Hero */}
        <header className="grid gap-4 text-center">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Prop Firm <span className="text-cyan-300">Drawdown</span> Calculator
          </h1>
          <p className="mx-auto max-w-xl text-base leading-7 text-[var(--text-muted)]">
            See how much room you have left before you breach your daily loss
            limit. Check it before you place the next trade.
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
          <h2 className="text-xl font-bold">What is a daily drawdown limit?</h2>
          <p className="text-sm leading-7 text-[var(--text-muted)]">
            Most prop firms cap how much you can lose in a single trading day.
            Cross that limit and the account is failed, no matter how well you
            traded before. The daily drawdown limit is the line you must not
            cross.
          </p>
        </section>

        <section className="grid gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-6 backdrop-blur">
          <h2 className="text-xl font-bold">How the calculation works</h2>
          <p className="text-sm leading-7 text-[var(--text-muted)]">
            Your daily loss limit is your start-of-day balance multiplied by the
            firm&rsquo;s daily loss percentage. Subtract the loss you&rsquo;ve
            already taken today, and what remains is your room left. Prop Pilot
            does this instantly and flags when you&rsquo;re close to a breach.
          </p>
        </section>

        <section className="grid gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-6 backdrop-blur">
          <h2 className="text-xl font-bold">Why it matters for prop traders</h2>
          <p className="text-sm leading-7 text-[var(--text-muted)]">
            Most prop accounts are lost to rule breaches, not bad analysis.
            Checking your remaining room before each trade keeps you disciplined
            and your account alive. Protect the account first, and profits
            follow.
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
