import type { Metadata } from "next";
import Link from "next/link";
import { FileSignature, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { isDatabaseConfigured } from "@/lib/db";
import { getCurrentAdminSession } from "@/lib/auth";
import { listAllMinutesForUser, type MinutesStatus } from "@/lib/board-meeting-minutes";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Meeting Minutes" };

const STATUS_LABELS: Record<MinutesStatus, string> = {
  draft: "Draft",
  submitted: "Pending Approval",
  approved: "Approved & Filed",
  rejected: "Rejected",
};

const STATUS_STYLES: Record<MinutesStatus, string> = {
  draft: "bg-ink/10 text-ink/60",
  submitted: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

// A centralized index of every meeting's minutes, each linking back to the
// SAME per-meeting editor at /board/meetings/[id]/minutes — this page adds
// no new minutes storage or editing of its own, it's purely a navigable
// library view over what already exists.
export default async function MeetingMinutesLibraryPage() {
  const dbReady = isDatabaseConfigured();
  const session = await getCurrentAdminSession();
  const isOwner = session?.role === "owner";
  const allMinutes = dbReady && session ? await listAllMinutesForUser(session.id, isOwner) : [];

  return (
    <Container>
      <PortalPageHero
        title="Meeting Minutes"
        description="Every meeting's minutes in one place — draft, pending approval, or filed in Corporate Records."
      />
      <div className="mt-6">
        {allMinutes.length === 0 ? (
          <EmptyState
            theme="blue"
            icon={FileSignature}
            title="No Minutes Yet"
            description="Open a meeting from Board Meetings and choose Meeting Minutes to start a draft."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {allMinutes.map((m) => (
              <Link
                key={m.id}
                href={`/board/meetings/${m.meeting_id}/minutes`}
                className="group flex items-center gap-4 rounded-xl border border-ink/10 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                  <FileSignature className="h-5 w-5 text-blue-700" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[#0b1f3a]">{m.meeting_title}</p>
                  <p className="mt-1 text-sm text-ink/50">{formatDate(m.meeting_scheduled_at)}</p>
                </div>
                <span className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[m.status]}`}>
                  {STATUS_LABELS[m.status]}
                </span>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-ink/30 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
