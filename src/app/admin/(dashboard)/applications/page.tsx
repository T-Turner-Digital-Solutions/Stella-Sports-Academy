import Link from "next/link";
import type { Metadata } from "next";
import { UserRound } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/db";
import { listAthleteApplications } from "@/lib/submissions";
import { DbNotConfigured } from "@/components/admin/DbNotConfigured";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Athlete Applications" };

function calculateAge(dob: string) {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default async function AdminApplicationsPage() {
  const dbReady = isDatabaseConfigured();
  const applications = dbReady ? await listAthleteApplications() : [];

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Athlete Applications</h1>
      <p className="mt-1 text-sm text-ink/60">
        Confidential — visible only to authorized admin staff. Never displayed publicly.
      </p>

      <div className="mt-8">
        {!dbReady ? (
          <DbNotConfigured />
        ) : applications.length === 0 ? (
          <EmptyState icon={UserRound} title="No Applications Yet" description="Submitted athlete applications will appear here." />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-wide text-ink/45">
                  <th className="px-5 py-3">Athlete</th>
                  <th className="px-5 py-3">Age</th>
                  <th className="px-5 py-3">Sport</th>
                  <th className="px-5 py-3">Parent / Guardian</th>
                  <th className="px-5 py-3">Submitted</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-ink/5 last:border-0 hover:bg-paper">
                    <td className="px-5 py-4">
                      <Link href={`/admin/applications/${app.id}`} className="font-semibold text-ink hover:text-red-700">
                        {app.athlete_first_name} {app.athlete_last_name}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-ink/70">{calculateAge(app.date_of_birth)}</td>
                    <td className="px-5 py-4 text-ink/70">{app.sport}</td>
                    <td className="px-5 py-4 text-ink/70">{app.parent_name}</td>
                    <td className="px-5 py-4 text-ink/50">{formatDate(app.created_at)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
