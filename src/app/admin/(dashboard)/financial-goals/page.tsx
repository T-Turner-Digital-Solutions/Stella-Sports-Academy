import type { Metadata } from "next";
import { History } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/db";
import { getCurrentAdminSession } from "@/lib/auth";
import { listFinancialGoalYears, listGoalChangeHistory, type GoalCategory } from "@/lib/financial-goals";
import { DbNotConfigured } from "@/components/admin/DbNotConfigured";
import { FinancialGoalsEditor } from "@/components/admin/FinancialGoalsEditor";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Financial Goals" };

const CATEGORY_LABELS: Record<GoalCategory, string> = {
  contributions: "Contributions",
  grants: "Grants",
  sponsorships: "Sponsorships",
  total_revenue: "Total Revenue",
};

export default async function AdminFinancialGoalsPage() {
  const dbReady = isDatabaseConfigured();
  const session = await getCurrentAdminSession();
  const isOwner = session?.role === "owner";
  const years = dbReady && isOwner ? await listFinancialGoalYears() : [];
  const history = dbReady && isOwner ? await listGoalChangeHistory() : [];

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Financial Goals</h1>
      <p className="mt-1 text-sm text-ink/60">
        Fundraising targets shown on the board&apos;s Financials page. These are goals only — they never change actual
        money received.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {!dbReady ? (
          <DbNotConfigured />
        ) : !isOwner ? (
          <EmptyState
            icon={History}
            title="Owner Access Required"
            description="Only the owner account can edit financial goals. View them from the Board Portal's Financials page instead."
          />
        ) : (
          <>
            <FinancialGoalsEditor years={years} />

            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                  <History className="h-4 w-4 text-red-700" />
                </span>
                <h2 className="font-display text-lg uppercase tracking-wide text-ink">Goal Change History</h2>
              </div>
              {history.length === 0 ? (
                <p className="mt-4 text-sm text-ink/50">No goal changes have been made yet.</p>
              ) : (
                <div className="mt-4 flex flex-col gap-2">
                  {history.map((change) => (
                    <div key={change.id} className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-ink/5 py-2 text-sm last:border-0">
                      <span className="font-semibold text-ink">
                        {change.year} {CATEGORY_LABELS[change.category]}
                      </span>
                      <span className="text-ink/50">
                        {formatCurrency(change.previous_cents)} &rarr; {formatCurrency(change.new_cents)}
                      </span>
                      <span className="text-ink/40">
                        by {change.changed_by_name || "Unknown"} on {formatDate(change.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
