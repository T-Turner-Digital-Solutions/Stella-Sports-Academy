import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, FileText, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { isDatabaseConfigured } from "@/lib/db";
import { getCurrentAdminSession } from "@/lib/auth";
import { listUpcomingBoardMeetings } from "@/lib/board-meetings";
import { listCurrentBoardDocuments, listAcknowledgedDocumentIds } from "@/lib/board-documents";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard" };

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Chicago",
  }).format(new Date(iso));
}

export default async function BoardDashboardPage() {
  const dbReady = isDatabaseConfigured();
  const session = await getCurrentAdminSession();
  const meetings = dbReady ? await listUpcomingBoardMeetings() : [];
  const documents = dbReady ? await listCurrentBoardDocuments() : [];
  const acknowledgedIds = dbReady && session ? await listAcknowledgedDocumentIds(session.id) : [];
  const pendingCount = documents.filter((d) => !acknowledgedIds.includes(d.id)).length;
  const nextMeeting = meetings[0];

  return (
    <Container>
      <PortalPageHero
        eyebrow="Board Portal"
        title={session?.name ? `Welcome, ${session.name}` : "Dashboard"}
        description="Updates, action items, and key announcements."
      />
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Link
          href="/board/meetings"
          className="group flex flex-col gap-2 rounded-xl border border-ink/10 bg-white p-6 transition-colors hover:border-blue-200"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
              <CalendarClock className="h-5 w-5 text-blue-700" />
            </span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-blue-700">
              Board Meetings
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
          <p className="mt-2 text-lg font-semibold text-[#0b1f3a]">
            {nextMeeting ? nextMeeting.title : "Nothing Scheduled"}
          </p>
          <p className="text-sm font-medium text-ink/60">
            {nextMeeting ? formatDateTime(nextMeeting.scheduled_at) : "Check back once a meeting is scheduled."}
          </p>
        </Link>

        <Link
          href="/board/corporate-records"
          className="group flex flex-col gap-2 rounded-xl border border-ink/10 bg-white p-6 transition-colors hover:border-blue-200"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
              <FileText className="h-5 w-5 text-blue-700" />
            </span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-blue-700">
              Corporate Records
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
          <p className="mt-2 text-lg font-semibold text-[#0b1f3a]">
            {pendingCount > 0 ? `${pendingCount} Awaiting Acknowledgment` : "All Caught Up"}
          </p>
          <p className="text-sm font-medium text-ink/60">
            {pendingCount > 0 ? "Review and acknowledge the latest governance documents." : "No pending records to review."}
          </p>
        </Link>
      </div>
    </Container>
  );
}
