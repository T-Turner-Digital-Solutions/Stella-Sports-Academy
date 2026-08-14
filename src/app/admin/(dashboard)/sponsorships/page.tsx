import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/db";
import { listSponsorshipInquiries } from "@/lib/submissions";
import { DbNotConfigured } from "@/components/admin/DbNotConfigured";
import { SubmissionCard } from "@/components/admin/SubmissionCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sponsorship Inquiries" };

export default async function AdminSponsorshipsPage() {
  const dbReady = isDatabaseConfigured();
  const inquiries = dbReady ? await listSponsorshipInquiries() : [];

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Sponsorship Inquiries</h1>
      <p className="mt-1 text-sm text-ink/60">Corporate and individual sponsorship interest submitted through the site.</p>

      <div className="mt-8 flex flex-col gap-5">
        {!dbReady ? (
          <DbNotConfigured />
        ) : inquiries.length === 0 ? (
          <EmptyState icon={Building2} title="No Sponsorship Inquiries Yet" description="Submitted sponsorship inquiries will appear here." />
        ) : (
          inquiries.map((s) => (
            <SubmissionCard
              key={s.id}
              title={s.company_name}
              status={s.status}
              createdAt={s.created_at}
              type="sponsorship"
              id={s.id}
              fields={[
                { label: "Contact Name", value: s.contact_name },
                { label: "Email", value: <a href={`mailto:${s.email}`} className="text-red-700 hover:underline">{s.email}</a> },
                { label: "Phone", value: s.phone ? <a href={`tel:${s.phone}`} className="text-red-700 hover:underline">{s.phone}</a> : null },
                { label: "Interested Tier", value: s.interested_tier },
                { label: "Message", value: s.message },
              ]}
            />
          ))
        )}
      </div>
    </div>
  );
}
