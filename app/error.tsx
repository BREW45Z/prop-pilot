"use client";

import Link from "next/link";

// Global error boundary. If any unexpected error is thrown while rendering,
// Next.js shows this instead of a blank white screen. The reset() callback
// lets the user try to recover without a full reload.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="prop-app relative flex min-h-screen w-full items-center justify-center bg-[var(--app-bg)] px-5 text-[var(--text-primary)]">
      <div className="grid max-w-md gap-4 text-center">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Something went <span className="text-cyan-300">wrong</span>
        </h1>
        <p className="text-sm leading-7 text-[var(--text-muted)]">
          Prop Pilot hit an unexpected error. Your saved inputs are safe. Try
          again, and if it keeps happening, refresh the page.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-w-40 items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-2xl shadow-cyan-500/20 transition hover:bg-cyan-300"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-w-40 items-center justify-center rounded-xl border border-[var(--border-soft)] px-5 py-3 text-sm font-semibold text-[var(--text-soft)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
