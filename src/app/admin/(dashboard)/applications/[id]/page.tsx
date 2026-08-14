import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/db";
import { getAthleteApplication } from "@/lib/submissions";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusToggle } from "@/components/admin/StatusToggle";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Athlete Application" };

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-ink/40">{label}</p>
      <p className="mt-1 text-sm text-ink">{value || "—"}</p>
    </div>
  );
}

export default async function AthleteApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isDatabaseConfigured()) notFound();

  const { id } = await params;
  const app = await getAthleteApplication(id);
  if (!app) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/applications" className="flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-red-700">
        <ArrowLeft className="h-4 w-4" />
        Back to Athlete Applications
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl uppercase tracking-wide text-ink">
            {app.athlete_first_name} {app.athlete_last_name}
          </h1>
          <p className="mt-1 text-sm text-ink/50">Submitted {formatDate(app.created_at)}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={app.status} />
          <StatusToggle type="application" id={app.id} status={app.status} />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8">
        <section className="rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg uppercase tracking-wide text-ink">Athlete Information</h2>
          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3">
            <Field label="First Name" value={app.athlete_first_name} />
            <Field label="Last Name" value={app.athlete_last_name} />
            <Field label="Date of Birth" value={formatDate(app.date_of_birth)} />
            <Field label="School" value={app.school} />
            <Field label="Grade" value={app.grade} />
            <Field label="Sport" value={app.sport} />
            <Field label="Position" value={app.position} />
            <Field label="Current Team" value={app.current_team} />
          </div>
        </section>

        <section className="rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg uppercase tracking-wide text-ink">Parent / Guardian</h2>
          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3">
            <Field label="Name" value={app.parent_name} />
            <Field label="Email" value={<a href={`mailto:${app.parent_email}`} className="text-red-700 hover:underline">{app.parent_email}</a>} />
            <Field label="Phone" value={<a href={`tel:${app.parent_phone}`} className="text-red-700 hover:underline">{app.parent_phone}</a>} />
          </div>
        </section>

        <section className="rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg uppercase tracking-wide text-ink">Program Interest</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {app.program_interest.map((interest) => (
              <span key={interest} className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700">
                {interest}
              </span>
            ))}
          </div>
          <div className="mt-5">
            <Field label="Financial Assistance Requested" value={app.financial_assistance ? "Yes" : "No"} />
          </div>
        </section>

        <section className="rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg uppercase tracking-wide text-ink">Additional Information</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink/75">
            {app.additional_info || "None provided."}
          </p>
        </section>
      </div>
    </div>
  );
}
