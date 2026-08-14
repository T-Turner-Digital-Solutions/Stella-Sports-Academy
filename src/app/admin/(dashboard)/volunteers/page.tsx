import type { Metadata } from "next";
import { HeartHandshake } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/db";
import { listVolunteerApplications } from "@/lib/submissions";
import { DbNotConfigured } from "@/components/admin/DbNotConfigured";
import { SubmissionCard } from "@/components/admin/SubmissionCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Volunteer Applications" };

export default async function AdminVolunteersPage() {
  const dbReady = isDatabaseConfigured();
  const volunteers = dbReady ? await listVolunteerApplications() : [];

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Volunteer Applications</h1>
      <p className="mt-1 text-sm text-ink/60">Everyone who&rsquo;s applied to coach, mentor, tutor, or help at events.</p>

      <div className="mt-8 flex flex-col gap-5">
        {!dbReady ? (
          <DbNotConfigured />
        ) : volunteers.length === 0 ? (
          <EmptyState icon={HeartHandshake} title="No Volunteer Applications Yet" description="Submitted volunteer applications will appear here." />
        ) : (
          volunteers.map((v) => (
            <SubmissionCard
              key={v.id}
              title={v.name}
              status={v.status}
              createdAt={v.created_at}
              type="volunteer"
              id={v.id}
              fields={[
                { label: "Email", value: <a href={`mailto:${v.email}`} className="text-red-700 hover:underline">{v.email}</a> },
                { label: "Phone", value: <a href={`tel:${v.phone}`} className="text-red-700 hover:underline">{v.phone}</a> },
                { label: "Area of Interest", value: v.area_of_interest },
                { label: "Availability", value: v.availability },
                { label: "Experience", value: v.experience },
                { label: "Message", value: v.message },
              ]}
            />
          ))
        )}
      </div>
    </div>
  );
}
