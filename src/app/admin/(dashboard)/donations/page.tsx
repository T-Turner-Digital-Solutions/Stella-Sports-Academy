import type { Metadata } from "next";
import { Gift, CheckCircle2, Clock } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/db";
import { listDonations, getDonationTotals } from "@/lib/donations";
import { DbNotConfigured } from "@/components/admin/DbNotConfigured";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Donations" };

export default async function AdminDonationsPage() {
  const dbReady = isDatabaseConfigured();
  const totals = dbReady ? await getDonationTotals() : null;
  const donations = dbReady ? await listDonations() : [];

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Donations</h1>
      <p className="mt-1 text-sm text-ink/60">
        Confidential — donor names and amounts are visible only to authorized board members, never displayed publicly.
      </p>

      <div className="mt-8">
        {!dbReady ? (
          <DbNotConfigured />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-ink/10 bg-white p-6">
                <p className="text-sm font-medium text-ink/60">Raised This Year</p>
                <p className="mt-2 font-display text-3xl text-ink">{formatCurrency(totals?.yearTotalCents ?? 0)}</p>
                <p className="mt-1 text-sm text-ink/50">{totals?.yearCount ?? 0} gift{totals?.yearCount === 1 ? "" : "s"}</p>
              </div>
              <div className="rounded-2xl border border-ink/10 bg-white p-6">
                <p className="text-sm font-medium text-ink/60">Raised All-Time</p>
                <p className="mt-2 font-display text-3xl text-ink">{formatCurrency(totals?.allTimeTotalCents ?? 0)}</p>
                <p className="mt-1 text-sm text-ink/50">{totals?.allTimeCount ?? 0} gift{totals?.allTimeCount === 1 ? "" : "s"}</p>
              </div>
            </div>

            <div className="mt-6">
              {donations.length === 0 ? (
                <EmptyState icon={Gift} title="No Donations Yet" description="Completed gifts will appear here as they come in." />
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-wide text-ink/45">
                        <th className="px-5 py-3">Donor</th>
                        <th className="px-5 py-3">Amount</th>
                        <th className="px-5 py-3">Designation</th>
                        <th className="px-5 py-3">Frequency</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map((d) => (
                        <tr key={d.id} className="border-b border-ink/5 last:border-0 hover:bg-paper">
                          <td className="px-5 py-4">
                            <p className="font-semibold text-ink">{d.donor_name}</p>
                            {d.donor_email && (
                              <a href={`mailto:${d.donor_email}`} className="text-xs text-red-700 hover:underline">
                                {d.donor_email}
                              </a>
                            )}
                          </td>
                          <td className="px-5 py-4 font-semibold text-ink">{formatCurrency(d.amount_cents)}</td>
                          <td className="px-5 py-4 text-ink/70">{d.designation}</td>
                          <td className="px-5 py-4 text-ink/70 capitalize">{d.frequency.replace("-", " ")}</td>
                          <td className="px-5 py-4 text-ink/50">{formatDate(d.created_at)}</td>
                          <td className="px-5 py-4">
                            {d.receipt_emailed_at ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Sent
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/40">
                                <Clock className="h-3.5 w-3.5" /> Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
