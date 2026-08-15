import { DatabaseZap } from "lucide-react";

export function DbNotConfigured() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 bg-white px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <DatabaseZap className="h-6 w-6 text-red-700" strokeWidth={1.75} />
      </div>
      <p className="font-display text-lg uppercase tracking-wide text-ink">Database Not Connected</p>
      <p className="max-w-md text-sm leading-relaxed text-ink/60">
        Set <code className="rounded bg-paper-dim px-1.5 py-0.5 text-xs">DATABASE_URL</code> to a
        Postgres connection string (and run <code className="rounded bg-paper-dim px-1.5 py-0.5 text-xs">src/lib/schema.sql</code>{" "}
        once) to start collecting submissions here. See the README for setup steps.
      </p>
    </div>
  );
}
