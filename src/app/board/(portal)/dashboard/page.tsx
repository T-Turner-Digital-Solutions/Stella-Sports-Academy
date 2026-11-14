import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, FileText, CalendarClock, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { isDatabaseConfigured } from "@/lib/db";
import { getCurrentAdminSession } from "@/lib/auth";
import { listUpcomingBoardMeetings } from "@/lib/board-meetings";
import { listCurrentBoardDocuments, listAcknowledgedDocumentIds } from "@/lib/board-documents";
import { ATHLETICS_TRACKER_URL } from "@/content/board";

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
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">
        {session?.name ? `Welcome, ${session.name}` : "Dashboard"}
      </h1>
      <p className="mt-1 text-sm text-ink/60">Updates, action items, and key announcements.</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Link
          href="/board/meetings"
          className="group flex flex-col gap-2 rounded-2xl border border-ink/10 bg-white p-6 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
              <CalendarClock className="h-5 w-5 text-blue-700" />
            </span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-blue-700">
              Board Meetings
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
          <p className="mt-2 font-display text-lg text-ink">
            {nextMeeting ? nextMeeting.title : "Nothing Scheduled"}
          </p>
          <p className="text-sm font-medium text-ink/60">
            {nextMeeting ? formatDateTime(nextMeeting.scheduled_at) : "Check back once a meeting is scheduled."}
          </p>
        </Link>

        <Link
          href="/board/corporate-records"
          className="group flex flex-col gap-2 rounded-2xl border border-ink/10 bg-white p-6 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
              <FileText className="h-5 w-5 text-blue-700" />
            </span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-blue-700">
              Corporate Records
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
          <p className="mt-2 font-display text-lg text-ink">
            {pendingCount > 0 ? `${pendingCount} Awaiting Acknowledgment` : "All Caught Up"}
          </p>
          <p className="text-sm font-medium text-ink/60">
            {pendingCount > 0 ? "Review and acknowledge the latest governance documents." : "No pending records to review."}
          </p>
        </Link>
      </div>

      <section className="mt-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
            <ClipboardList className="h-4 w-4 text-blue-700" />
          </span>
          <h2 className="font-display text-lg uppercase tracking-wide text-ink">Athletics Tracker</h2>
        </div>

        <div className="mt-4">
          {ATHLETICS_TRACKER_URL ? (
            <div className="overflow-hidden rounded-2xl border border-ink/10" style={{ aspectRatio: "16 / 7" }}>
              <iframe src={ATHLETICS_TRACKER_URL} title="Athletics Tracker" className="h-full w-full" />
            </div>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="Not Connected Yet"
              description="The Google Sheets athletics tracker will appear here once the sheet link is shared and connected."
            />
          )}
        </div>
      </section>
    </Container>
  );
}
