import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/db";
import { listContactSubmissions } from "@/lib/submissions";
import { DbNotConfigured } from "@/components/admin/DbNotConfigured";
import { SubmissionCard } from "@/components/admin/SubmissionCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contact Submissions" };

export default async function AdminContactPage() {
  const dbReady = isDatabaseConfigured();
  const submissions = dbReady ? await listContactSubmissions() : [];

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Contact Submissions</h1>
      <p className="mt-1 text-sm text-ink/60">General inquiries submitted through the Contact page.</p>

      <div className="mt-8 flex flex-col gap-5">
        {!dbReady ? (
          <DbNotConfigured />
        ) : submissions.length === 0 ? (
          <EmptyState icon={MessageSquare} title="No Contact Submissions Yet" description="Submitted contact messages will appear here." />
        ) : (
          submissions.map((c) => (
            <SubmissionCard
              key={c.id}
              title={c.name}
              status={c.status}
              createdAt={c.created_at}
              type="contact"
              id={c.id}
              fields={[
                { label: "Email", value: <a href={`mailto:${c.email}`} className="text-red-700 hover:underline">{c.email}</a> },
                { label: "Phone", value: c.phone ? <a href={`tel:${c.phone}`} className="text-red-700 hover:underline">{c.phone}</a> : null },
                { label: "Inquiry Type", value: c.inquiry_type },
                { label: "Message", value: c.message },
              ]}
            />
          ))
        )}
      </div>
    </div>
  );
}
