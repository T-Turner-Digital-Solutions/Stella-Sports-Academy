"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { FormStatus } from "@/components/forms/FormStatus";
import type { SubmitState } from "@/lib/forms-client";
import { formatCurrency } from "@/lib/utils";
import type { YearGoals } from "@/lib/financial-goals";

type DollarRow = { year: number; contributions: string; grants: string; sponsorships: string; totalRevenue: string };

function toDollarRow(y: YearGoals): DollarRow {
  return {
    year: y.year,
    contributions: (y.contributions_cents / 100).toFixed(2),
    grants: (y.grants_cents / 100).toFixed(2),
    sponsorships: (y.sponsorships_cents / 100).toFixed(2),
    totalRevenue: (y.total_revenue_cents / 100).toFixed(2),
  };
}

function AmountInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="number"
      min="0"
      step="0.01"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink focus:border-red-700 focus:outline-none focus:ring-2 focus:ring-red-700/15"
    />
  );
}

export function FinancialGoalsEditor({ years }: { years: YearGoals[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [rows, setRows] = useState<DollarRow[]>(years.map(toDollarRow));
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  function updateRow(year: number, field: keyof Omit<DollarRow, "year">, value: string) {
    setRows((prev) => prev.map((r) => (r.year === year ? { ...r, [field]: value } : r)));
  }

  function addNextYear() {
    const nextYear = Math.max(...rows.map((r) => r.year)) + 1;
    setRows((prev) => [...prev, { year: nextYear, contributions: "0.00", grants: "0.00", sponsorships: "0.00", totalRevenue: "0.00" }]);
  }

  async function handleSave() {
    setState({ status: "submitting" });
    try {
      for (const row of rows) {
        const res = await fetch("/api/admin/financial-goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(row),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setState({ status: "error", message: data.message || `Could not save ${row.year}.` });
          return;
        }
      }
      setState({ status: "success", message: "Goals saved." });
      setEditing(false);
      router.refresh();
    } catch {
      setState({ status: "error", message: "Network error. Please check your connection and try again." });
    }
  }

  function handleCancel() {
    setRows(years.map(toDollarRow));
    setEditing(false);
    setState({ status: "idle" });
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg uppercase tracking-wide text-ink">5-Year Financial Plan & Goals</h2>
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Goals
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button type="button" onClick={addNextYear} className="flex items-center gap-1.5 text-sm font-medium text-red-700 hover:text-red-800">
              <Plus className="h-4 w-4" />
              Add Year
            </button>
            <button type="button" onClick={handleCancel} className="text-sm font-medium text-ink/50 hover:text-ink">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={state.status === "submitting"}
              className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-50"
            >
              {state.status === "submitting" ? "Saving…" : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-wide text-ink/45">
              <th className="py-2 pr-3">Fiscal Year</th>
              <th className="py-2 pr-3">Contributions Goal</th>
              <th className="py-2 pr-3">Grants Goal</th>
              <th className="py-2 pr-3">Sponsorships Goal</th>
              <th className="py-2 pr-3">Total Revenue Goal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.year} className="border-b border-ink/5 last:border-0">
                <td className="py-2.5 pr-3 font-semibold text-ink">{row.year}</td>
                {editing ? (
                  <>
                    <td className="py-2 pr-3">
                      <AmountInput value={row.contributions} onChange={(v) => updateRow(row.year, "contributions", v)} />
                    </td>
                    <td className="py-2 pr-3">
                      <AmountInput value={row.grants} onChange={(v) => updateRow(row.year, "grants", v)} />
                    </td>
                    <td className="py-2 pr-3">
                      <AmountInput value={row.sponsorships} onChange={(v) => updateRow(row.year, "sponsorships", v)} />
                    </td>
                    <td className="py-2 pr-3">
                      <AmountInput value={row.totalRevenue} onChange={(v) => updateRow(row.year, "totalRevenue", v)} />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2.5 pr-3 text-ink/70">{formatCurrency(Math.round(Number(row.contributions) * 100))}</td>
                    <td className="py-2.5 pr-3 text-ink/70">{formatCurrency(Math.round(Number(row.grants) * 100))}</td>
                    <td className="py-2.5 pr-3 text-ink/70">{formatCurrency(Math.round(Number(row.sponsorships) * 100))}</td>
                    <td className="py-2.5 pr-3 text-ink/70">{formatCurrency(Math.round(Number(row.totalRevenue) * 100))}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <FormStatus state={state} />
    </div>
  );
}
