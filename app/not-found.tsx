import Link from "next/link";

// Shown for any URL that does not exist (404). Branded to match the app.
export default function NotFound() {
  return (
    <main className="prop-app relative flex min-h-screen w-full items-center justify-center bg-[var(--app-bg)] px-5 text-[var(--text-primary)]">
      <div className="grid max-w-md gap-4 text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-cyan-300/80">
          Page not found
        </p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          <span className="text-cyan-300">404</span>
        </h1>
        <p className="text-sm leading-7 text-[var(--text-muted)]">
          This page does not exist. Head back to Prop Pilot to calculate your
          risk before the next trade.
        </p>
        <Link
          href="/"
          className="mx-auto inline-flex min-w-48 items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-2xl shadow-cyan-500/20 transition hover:bg-cyan-300"
        >
          Open Prop Pilot
        </Link>
      </div>
    </main>
  );
}
