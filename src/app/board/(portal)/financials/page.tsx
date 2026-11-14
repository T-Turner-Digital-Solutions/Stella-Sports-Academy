import type { Metadata } from "next";
import { Coins, Gift, FileCheck2, TrendingUp, Flag, Target, Link2, Info } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { StatCard } from "@/components/board/StatCard";
import { isDatabaseConfigured } from "@/lib/db";
import { listFinancialGoalYears } from "@/lib/financial-goals";
import { getDonationTotalsByYear } from "@/lib/donations";
import { listCurrentBoardDocuments } from "@/lib/board-documents";
import { categoryToGroup } from "@/lib/board-documents-shared";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Financials" };

export default async function BoardFinancialsPage() {
  const dbReady = isDatabaseConfigured();
  const years = dbReady ? await listFinancialGoalYears() : [];
  const actualsByYear = dbReady ? await getDonationTotalsByYear() : {};
  const documents = dbReady ? await listCurrentBoardDocuments() : [];

  const currentYear = new Date().getFullYear();
  const currentYearGoals = years.find((y) => y.year === currentYear);
  const raisedToDate = actualsByYear[currentYear] ?? 0;
  const progressPct =
    currentYearGoals && currentYearGoals.contributions_cents > 0
      ? Math.min(100, Math.round((raisedToDate / currentYearGoals.contributions_cents) * 100))
      : 0;

  const allTimeRaised = Object.values(actualsByYear).reduce((sum, c) => sum + c, 0);
  const complianceFilingCount = documents.filter((d) => categoryToGroup(d.category) === "compliance").length;

  const totals = years.reduce(
    (acc, y) => ({
      contributions: acc.contributions + y.contributions_cents,
      grants: acc.grants + y.grants_cents,
      sponsorships: acc.sponsorships + y.sponsorships_cents,
      totalRevenue: acc.totalRevenue + y.total_revenue_cents,
    }),
    { contributions: 0, grants: 0, sponsorships: 0, totalRevenue: 0 }
  );

  return (
    <>
      <PortalPageHero
        title="Financials"
        description="Track contributions, funding, and progress toward our long-term goals."
      />
      <Container className="py-8">
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={Coins} label="Total Contributions" value={formatCurrency(allTimeRaised)} />
          <StatCard icon={Gift} label="Total Grants & Funding" value={formatCurrency(0)} />
          <StatCard icon={FileCheck2} label="Form 990 Filings" value={complianceFilingCount} />
          <StatCard icon={TrendingUp} label="Total Revenue" value={formatCurrency(allTimeRaised)} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr_1fr]">
          <section>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                <TrendingUp className="h-4 w-4 text-blue-700" />
              </span>
              <h2 className="font-portal-heading text-lg text-ink">5-Year Financial Plan &amp; Goals</h2>
            </div>
            <p className="mt-1 text-sm text-ink/50">
              Annual contributions, grants, sponsorships, and total revenue goals for {years[0]?.year ?? currentYear}–
              {years[years.length - 1]?.year ?? currentYear}.
            </p>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-sm">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="bg-blue-900 text-xs font-bold uppercase tracking-wide text-white/80">
                    <th className="px-4 py-3">Fiscal Year</th>
                    <th className="px-4 py-3">Contributions</th>
                    <th className="px-4 py-3">Grants &amp; Funding</th>
                    <th className="px-4 py-3">Sponsorships</th>
                    <th className="px-4 py-3">Total Revenue Goal</th>
                  </tr>
                </thead>
                <tbody>
                  {years.map((y, i) => (
                    <tr key={y.year} className={`border-b border-ink/5 last:border-0 ${i % 2 === 1 ? "bg-blue-50/40" : ""}`}>
                      <td className="px-4 py-3 font-semibold text-ink">{y.year}</td>
                      <td className="px-4 py-3 text-ink/70">{formatCurrency(y.contributions_cents)}</td>
                      <td className="px-4 py-3 text-ink/70">{formatCurrency(y.grants_cents)}</td>
                      <td className="px-4 py-3 text-ink/70">{formatCurrency(y.sponsorships_cents)}</td>
                      <td className="px-4 py-3 text-ink/70">{formatCurrency(y.total_revenue_cents)}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-900 font-semibold text-white">
                    <td className="px-4 py-3">Total ({years.length} Years)</td>
                    <td className="px-4 py-3">{formatCurrency(totals.contributions)}</td>
                    <td className="px-4 py-3">{formatCurrency(totals.grants)}</td>
                    <td className="px-4 py-3">{formatCurrency(totals.sponsorships)}</td>
                    <td className="px-4 py-3">{formatCurrency(totals.totalRevenue)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-ink/40">
              Goals only — these figures don&apos;t reflect money actually received. Grants and sponsorships
              don&apos;t yet have an automated actuals feed, so only contributions processed through the
              website&apos;s donation system are tracked as real dollars received.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                <Target className="h-4 w-4 text-blue-700" />
              </span>
              <h2 className="font-portal-heading text-lg text-ink">{currentYear} Goal Progress</h2>
            </div>

            <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-ink/60">
                  <Coins className="h-4 w-4 text-blue-700" />
                  Annual Goal
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

          <section>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                <Link2 className="h-4 w-4 text-blue-700" />
              </span>
              <h2 className="font-portal-heading text-lg text-ink">Connected Accounts</h2>
            </div>
            <p className="mt-1 text-sm text-ink/50">Live totals from our donation platform.</p>

            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white p-4">
                <div>
                  <p className="font-semibold text-ink">Online Donations</p>
                  <p className="text-xs text-ink/50">Stripe checkout</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-ink">{formatCurrency(allTimeRaised)}</p>
                  <p className="flex items-center justify-end gap-1 text-xs font-medium text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                    Connected
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white p-4">
                <div>
                  <p className="font-semibold text-ink">Zeffy Giving Page</p>
                  <p className="text-xs text-ink/50">Hosted donation form</p>
                </div>
                <p className="text-xs font-medium text-ink/40">No live total available</p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-700" />
              <p className="text-xs leading-relaxed text-ink/60">
                Totals above include only donations processed through our website&apos;s Stripe checkout. Zeffy
                doesn&apos;t provide a live totals feed, and manual deposits aren&apos;t tracked automatically.
              </p>
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
