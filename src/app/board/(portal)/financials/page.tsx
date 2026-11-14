import type { Metadata } from "next";
import { BarChart3, Coins, Target, Flag, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { isDatabaseConfigured } from "@/lib/db";
import { listFinancialGoalYears } from "@/lib/financial-goals";
import { getDonationTotalsByYear } from "@/lib/donations";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Financials" };

export default async function BoardFinancialsPage() {
  const dbReady = isDatabaseConfigured();
  const years = dbReady ? await listFinancialGoalYears() : [];
  const actualsByYear = dbReady ? await getDonationTotalsByYear() : {};

  const currentYear = new Date().getFullYear();
  const currentYearGoals = years.find((y) => y.year === currentYear);
  const raisedToDate = actualsByYear[currentYear] ?? 0;
  const progressPct = currentYearGoals && currentYearGoals.contributions_cents > 0
    ? Math.min(100, Math.round((raisedToDate / currentYearGoals.contributions_cents) * 100))
    : 0;

  const hasAnyGoals = years.some(
    (y) => y.contributions_cents || y.grants_cents || y.sponsorships_cents || y.total_revenue_cents
  );

  return (
    <Container>
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Financials</h1>
      <p className="mt-1 text-sm text-ink/60">Track contributions, funding, and progress toward our long-term goals.</p>

      {!dbReady || !hasAnyGoals ? (
        <div className="mt-8">
          <EmptyState
            icon={BarChart3}
            title="No Goals Set Yet"
            description="Annual fundraising goals will appear here once the owner sets them from the admin Financial Goals page."
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <section>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                <TrendingUp className="h-4 w-4 text-blue-700" />
              </span>
              <h2 className="font-display text-lg uppercase tracking-wide text-ink">5-Year Financial Plan & Goals</h2>
            </div>
            <p className="mt-1 text-sm text-ink/50">
              Annual contributions, grants, sponsorships, and total revenue goals.
            </p>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="bg-ink text-xs font-bold uppercase tracking-wide text-white/70">
                    <th className="px-4 py-3">Fiscal Year</th>
                    <th className="px-4 py-3">Contributions</th>
                    <th className="px-4 py-3">Grants & Funding</th>
                    <th className="px-4 py-3">Sponsorships</th>
                    <th className="px-4 py-3">Total Revenue Goal</th>
                  </tr>
                </thead>
                <tbody>
                  {years.map((y) => (
                    <tr key={y.year} className="border-b border-ink/5 last:border-0">
                      <td className="px-4 py-3 font-semibold text-ink">{y.year}</td>
                      <td className="px-4 py-3 text-ink/70">{formatCurrency(y.contributions_cents)}</td>
                      <td className="px-4 py-3 text-ink/70">{formatCurrency(y.grants_cents)}</td>
                      <td className="px-4 py-3 text-ink/70">{formatCurrency(y.sponsorships_cents)}</td>
                      <td className="px-4 py-3 text-ink/70">{formatCurrency(y.total_revenue_cents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-ink/40">
              Goals only — these figures don&apos;t reflect money actually received. Grants and sponsorships don&apos;t yet
              have an automated actuals feed, so only contributions processed through the website&apos;s donation system
              are tracked below.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                <Target className="h-4 w-4 text-blue-700" />
              </span>
              <h2 className="font-display text-lg uppercase tracking-wide text-ink">{currentYear} Goal Progress</h2>
            </div>

            <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-ink/60">
                  <Coins className="h-4 w-4 text-blue-700" />
                  Contributions Goal
                </span>
                <span className="font-semibold text-ink">{formatCurrency(currentYearGoals?.contributions_cents ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-ink/60">
                  <Flag className="h-4 w-4 text-blue-700" />
                  Raised to Date
                </span>
                <span className="font-semibold text-ink">{formatCurrency(raisedToDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-ink/60">
                  <TrendingUp className="h-4 w-4 text-blue-700" />
                  Remaining to Goal
                </span>
                <span className="font-semibold text-ink">
                  {formatCurrency(Math.max(0, (currentYearGoals?.contributions_cents ?? 0) - raisedToDate))}
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm font-medium text-ink/60">
                  <span className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-700" />
                    Progress
                  </span>
                  <span className="font-semibold text-blue-700">{progressPct}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper-dim">
                  <div className="h-full rounded-full bg-blue-700" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </Container>
  );
}
