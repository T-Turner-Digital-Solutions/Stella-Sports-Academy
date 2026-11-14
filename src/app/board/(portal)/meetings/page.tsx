import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, Video, ClipboardList, FileSignature, Users, FolderOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { isDatabaseConfigured } from "@/lib/db";
import { listUpcomingBoardMeetings, listAllBoardMeetings } from "@/lib/board-meetings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Board Meetings" };

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Chicago",
  }).format(new Date(iso));
}

export default async function BoardMeetingsPage() {
  const dbReady = isDatabaseConfigured();
  const upcoming = dbReady ? await listUpcomingBoardMeetings() : [];
  const all = dbReady ? await listAllBoardMeetings() : [];
  const nextMeeting = upcoming[0];
  const otherUpcoming = upcoming.slice(1);
  const past = all.filter((m) => !upcoming.some((u) => u.id === m.id));

  return (
    <Container>
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Board Meetings</h1>
      <p className="mt-1 text-sm text-ink/60">Schedule, attend, and review board meetings, agendas, and minutes.</p>

      {/* NEXT MEETING */}
      <div className="mt-8">
        {!dbReady || !nextMeeting ? (
          <EmptyState
            icon={CalendarClock}
            title="Nothing Scheduled"
            description="The next board meeting will appear here once it's scheduled."
          />
        ) : (
          <div className="rounded-2xl border border-ink/10 bg-white p-6 sm:p-8">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-700">
              <Video className="h-3.5 w-3.5" />
              Next Meeting
            </p>
            <h2 className="mt-2 font-display text-2xl text-ink">{nextMeeting.title}</h2>
            <p className="mt-2 text-sm font-medium text-ink/60">{formatDateTime(nextMeeting.scheduled_at)}</p>
            {nextMeeting.notes && <p className="mt-3 max-w-2xl text-sm text-ink/60">{nextMeeting.notes}</p>}
            {nextMeeting.zoom_url ? (
              <a
                href={nextMeeting.zoom_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
              >
                <Video className="h-4 w-4" />
                Join Meeting
              </a>
            ) : (
              <p className="mt-5 text-sm text-ink/40">A meeting link hasn&apos;t been added yet.</p>
            )}
          </div>
        )}
      </div>

      {/* AGENDA / MINUTES / ATTENDANCE / DOCUMENTS */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div id="agenda" className="rounded-2xl border-l-4 border-blue-700 bg-white p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
              <ClipboardList className="h-4 w-4 text-blue-700" />
            </span>
            <p className="font-display text-base uppercase tracking-wide text-ink">Meeting Agenda</p>
          </div>
          <p className="mt-3 text-sm text-ink/60">
            {nextMeeting?.notes || "No agenda has been added for the next meeting yet."}
          </p>
        </div>

        <div id="attendance" className="rounded-2xl border-l-4 border-blue-700 bg-white p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
              <Users className="h-4 w-4 text-blue-700" />
            </span>
            <p className="font-display text-base uppercase tracking-wide text-ink">Attendance</p>
          </div>
          <p className="mt-3 text-sm text-ink/60">
            Attendance is recorded by the board secretary after each meeting and will appear here.
          </p>
        </div>

        <Link
          href="/board/corporate-records"
          className="group rounded-2xl border-l-4 border-blue-700 bg-white p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
              <FileSignature className="h-4 w-4 text-blue-700" />
            </span>
            <p className="font-display text-base uppercase tracking-wide text-ink">Meeting Minutes</p>
          </div>
          <p className="mt-3 text-sm text-ink/60">Access approved meeting minutes, filed under Corporate Records.</p>
        </Link>

        <Link
          href="/board/corporate-records"
          className="group rounded-2xl border-l-4 border-blue-700 bg-white p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
              <FolderOpen className="h-4 w-4 text-blue-700" />
            </span>
            <p className="font-display text-base uppercase tracking-wide text-ink">Board Documents</p>
          </div>
          <p className="mt-3 text-sm text-ink/60">Access related documents and meeting materials.</p>
        </Link>
      </div>

      {/* OTHER UPCOMING */}
      {otherUpcoming.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-lg uppercase tracking-wide text-ink">Also Upcoming</h2>
          <div className="mt-4 flex flex-col gap-3">
            {otherUpcoming.map((meeting) => (
              <div key={meeting.id} className="rounded-2xl border border-ink/10 bg-white p-5">
                <p className="font-semibold text-ink">{meeting.title}</p>
                <p className="mt-1 text-sm text-ink/60">{formatDateTime(meeting.scheduled_at)}</p>
                {meeting.notes && <p className="mt-2 text-sm text-ink/50">{meeting.notes}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PAST MEETINGS */}
      <section className="mt-10">
        <h2 className="font-display text-lg uppercase tracking-wide text-ink">Previous Meetings</h2>
        <div className="mt-4">
          {past.length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title="No Past Meetings"
              description="Completed meetings will be archived here."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {past.map((meeting) => (
                <div key={meeting.id} className="rounded-2xl border border-ink/10 bg-paper-dim p-5">
                  <p className="font-semibold text-ink">{meeting.title}</p>
                  <p className="mt-1 text-sm text-ink/60">{formatDateTime(meeting.scheduled_at)}</p>
                  {meeting.notes && <p className="mt-2 text-sm text-ink/50">{meeting.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Container>
  );
}
