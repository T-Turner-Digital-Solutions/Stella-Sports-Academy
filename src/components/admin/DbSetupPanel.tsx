"use client";

import { useState } from "react";
import { DatabaseZap, CheckCircle2, XCircle } from "lucide-react";

type Status = {
  connected: boolean;
  adminUserCount?: number | null;
  titleColumnExists?: boolean | null;
  message?: string;
};

/** Owner-only. Applies the site's database schema (src/lib/schema.sql) using
 * the signed-in owner's own session — no shared secrets. The schema is
 * additive and idempotent: it only creates missing tables/columns, never
 * drops or rewrites existing data, so it's always safe to run again. */
export function DbSetupPanel() {
  const [status, setStatus] = useState<Status | null>(null);
  const [pending, setPending] = useState<"check" | "apply" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(method: "GET" | "POST") {
    setPending(method === "GET" ? "check" : "apply");
    setError(null);
    try {
      const res = await fetch("/api/admin/db-setup", { method });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Request failed.");
        setStatus(null);
      } else {
        setStatus(data);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
          <DatabaseZap className="h-4 w-4 text-red-700" />
        </span>
        <h2 className="font-display text-lg uppercase tracking-wide text-ink">Database Update</h2>
      </div>
      <p className="text-sm text-ink/60">
        Adds the new &quot;Position&quot; field to board member accounts. This only adds what&apos;s missing — it
        never deletes or changes existing accounts, passwords, or roles. Safe to run more than once.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => run("GET")}
          disabled={pending !== null}
          className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-paper disabled:opacity-50"
        >
          {pending === "check" ? "Checking…" : "Check Current Status"}
        </button>
        <button
          type="button"
          onClick={() => run("POST")}
          disabled={pending !== null}
          className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-50"
        >
          {pending === "apply" ? "Applying…" : "Apply Database Update"}
        </button>
      </div>

      {error && <p className="text-sm font-medium text-red-700">{error}</p>}

      {status && (
        <div className="flex flex-col gap-2 rounded-xl border border-ink/10 bg-paper p-4 text-sm">
          <StatusRow ok={status.connected} label="Database connected" />
          {status.adminUserCount !== null && status.adminUserCount !== undefined && (
            <p className="text-ink/70">Board member accounts found: <span className="font-semibold text-ink">{status.adminUserCount}</span></p>
          )}
          {status.titleColumnExists !== null && status.titleColumnExists !== undefined && (
            <StatusRow ok={status.titleColumnExists} label="Position field ready" />
          )}
        </div>
      )}
    </div>
  );
}

function StatusRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <p className="flex items-center gap-2">
      {ok ? <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600" /> : <XCircle className="h-4 w-4 flex-shrink-0 text-red-700" />}
      <span className={ok ? "text-ink/70" : "font-semibold text-red-700"}>{label}: {ok ? "Yes" : "Not yet"}</span>
    </p>
  );
}
