import type { Metadata } from "next";
import { CalendarClock, ClipboardList, ExternalLink } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Container } from "@/components/ui/Container";
import { isDatabaseConfigured } from "@/lib/db";
import { listUpcomingBoardMeetings } from "@/lib/board-meetings";
import { ATHLETICS_TRACKER_URL } from "@/content/board";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Board Portal" };

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function BoardPage() {
  const dbReady = isDatabaseConfigured();
  const meetings = dbReady ? await listUpcomingBoardMeetings() : [];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-ink/10 bg-white px-5 py-4 sm:px-8">
        <Logo />
        <LogoutButton redirectTo="/board/login" />
      </header>

      <main className="flex-1 py-12">
        <Container>
          <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Board Portal</h1>
          <p className="mt-1 text-sm text-ink/60">
            Private dashboard for Stellar Sports Academy board members.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* ATHLETICS TRACKER */}
            <section>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                  <ClipboardList className="h-4 w-4 text-red-700" />
                </span>
                <h2 className="font-display text-lg uppercase tracking-wide text-ink">Athletics Tracker</h2>
              </div>

              <div className="mt-4">
                {ATHLETICS_TRACKER_URL ? (
                  <div className="overflow-hidden rounded-2xl border border-ink/10" style={{ aspectRatio: "4 / 3" }}>
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

            {/* ZOOM MEETINGS */}
            <section>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                  <CalendarClock className="h-4 w-4 text-red-700" />
                </span>
                <h2 className="font-display text-lg uppercase tracking-wide text-ink">Upcoming Meetings</h2>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {!dbReady || meetings.length === 0 ? (
                  <EmptyState
                    icon={CalendarClock}
                    title="No Meetings Scheduled"
                    description="Upcoming board Zoom meetings will appear here once scheduled."
                  />
                ) : (
                  meetings.map((meeting) => (
                    <div key={meeting.id} className="rounded-2xl border border-ink/10 bg-white p-5">
                      <p className="font-semibold text-ink">{meeting.title}</p>
                      <p className="mt-1 text-sm text-ink/60">{formatDateTime(meeting.scheduled_at)}</p>
                      {meeting.notes && <p className="mt-2 text-sm text-ink/50">{meeting.notes}</p>}
                      <a
                        href={meeting.zoom_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800"
                      >
                        Join on Zoom
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
}
