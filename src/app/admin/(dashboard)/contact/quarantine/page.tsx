import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/db";
import { listQuarantinedContactSubmissions } from "@/lib/submissions";
import { DbNotConfigured } from "@/components/admin/DbNotConfigured";
import { MarkLegitimateButton } from "@/components/admin/MarkLegitimateButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Quarantined Contact Submissions" };

// Owner-only, same as every page under /admin/(dashboard) — this is where
// Contact form messages the spam filter flagged land instead of the normal
// Contact Submissions inbox. Nothing here is ever deleted automatically,
// and nothing here ever triggered the admin/confirmation emails — "Mark
// Legitimate" is the only way a message leaves this list, and it moves it
// into the regular Contact Submissions view rather than re-sending anything.
export default async function AdminContactQuarantinePage() {
  const dbReady = isDatabaseConfigured();
  const submissions = dbReady ? await listQuarantinedContactSubmissions() : [];

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Quarantined Submissions</h1>
      <p className="mt-1 text-sm text-ink/60">
        Contact form messages our spam filter flagged as unsolicited marketing. Nothing here was emailed to the
        Contact inbox — review each one and mark it legitimate if it&rsquo;s a real inquiry.
      </p>

      <div className="mt-8 flex flex-col gap-5">
        {!dbReady ? (
          <DbNotConfigured />
        ) : submissions.length === 0 ? (
          <EmptyState
            icon={ShieldAlert}
            title="Nothing Quarantined"
            description="Contact form messages flagged as likely spam will appear here for review."
          />
        ) : (
          submissions.map((c) => (
            <div key={c.id} className="rounded-2xl border border-ink/10 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg uppercase tracking-wide text-ink">{c.name}</h3>
                  <p className="mt-1 text-xs text-ink/45">Submitted {formatDate(c.created_at)}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
                  Quarantined
                </span>
              </div>

              {c.spam_reason && (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                  {c.spam_reason}
                </p>
              )}

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink/40">Email</p>
                  <p className="mt-1 text-sm text-ink/80">
                    <a href={`mailto:${c.email}`} className="text-red-700 hover:underline">
                      {c.email}
                    </a>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink/40">Phone</p>
                  <p className="mt-1 text-sm text-ink/80">
                    {c.phone ? (
                      <a href={`tel:${c.phone}`} className="text-red-700 hover:underline">
                        {c.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink/40">Inquiry Type</p>
                  <p className="mt-1 text-sm text-ink/80">{c.inquiry_type}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink/40">IP Address</p>
                  <p className="mt-1 text-sm text-ink/80">{c.ip_address || "—"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink/40">Message</p>
                  <p className="mt-1 text-sm text-ink/80">{c.message}</p>
                </div>
              </div>

              <div className="mt-5 border-t border-ink/10 pt-5">
                <MarkLegitimateButton id={c.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
