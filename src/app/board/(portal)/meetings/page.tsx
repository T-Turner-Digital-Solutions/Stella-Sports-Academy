import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, Video, ClipboardList, FileSignature, Users, FolderOpen, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PortalPageHero } from "@/components/board/PortalPageHero";
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
      <PortalPageHero
        title="Board Meetings"
        description="Schedule, attend, and review board meetings, agendas, and minutes."
        badge={nextMeeting ? "Upcoming" : undefined}
      />
      <div className="mt-6">
      {/* NEXT MEETING */}
      <div>
        {!dbReady || !nextMeeting ? (
          <EmptyState
            theme="blue"
            icon={CalendarClock}
            title="Nothing Scheduled"
            description="The next board meeting will appear here once it's scheduled."
          />
        ) : (
          <div className="rounded-xl border border-ink/10 bg-white p-6 sm:p-8">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-700">
              <Video className="h-3.5 w-3.5" />
              Next Meeting
            </p>
            <h2 className="font-semibold mt-2 text-2xl text-[#0b1f3a]">{nextMeeting.title}</h2>
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
        <div id="agenda" className="flex items-center gap-4 rounded-xl border-l-4 border-blue-700 bg-white p-5">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <ClipboardList className="h-5 w-5 text-blue-700" />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-base text-[#0b1f3a]">Meeting Agenda</p>
            <p className="mt-1 text-sm text-ink/60">
              {nextMeeting?.notes || "No agenda has been added for the next meeting yet."}
            </p>
          </div>
        </div>

        <div id="attendance" className="flex items-center gap-4 rounded-xl border-l-4 border-blue-700 bg-white p-5">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <Users className="h-5 w-5 text-blue-700" />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-base text-[#0b1f3a]">Attendance</p>
            <p className="mt-1 text-sm text-ink/60">
              Attendance is recorded by the board secretary after each meeting and will appear here.
            </p>
          </div>
        </div>

        <Link
          href="/board/corporate-records"
          className="group flex items-center gap-4 rounded-xl border-l-4 border-blue-700 bg-white p-5 transition-shadow"
        >
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FileSignature className="h-5 w-5 text-blue-700" />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-base text-[#0b1f3a]">Meeting Minutes</p>
            <p className="mt-1 text-sm text-ink/60">Access approved meeting minutes, filed under Corporate Records.</p>
          </div>
          <ChevronRight className="h-4 w-4 flex-shrink-0 text-ink/30 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/board/corporate-records"
          className="group flex items-center gap-4 rounded-xl border-l-4 border-blue-700 bg-white p-5 transition-shadow"
        >
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FolderOpen className="h-5 w-5 text-blue-700" />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-base text-[#0b1f3a]">Board Documents</p>
            <p className="mt-1 text-sm text-ink/60">Access related documents and meeting materials.</p>
          </div>
          <ChevronRight className="h-4 w-4 flex-shrink-0 text-ink/30 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* OTHER UPCOMING */}
      {otherUpcoming.length > 0 && (
        <section className="mt-10">
          <h2 className="font-semibold text-lg text-[#0b1f3a]">Also Upcoming</h2>
          <div className="mt-4 flex flex-col gap-3">
            {otherUpcoming.map((meeting) => (
              <div key={meeting.id} className="rounded-xl border border-ink/10 bg-white p-5">
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
        <h2 className="font-semibold text-lg text-[#0b1f3a]">Previous Meetings</h2>
        <div className="mt-4">
          {past.length === 0 ? (
            <EmptyState
              theme="blue"
              icon={CalendarClock}
              title="No Past Meetings"
              description="Completed meetings will be archived here."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {past.map((meeting) => (
                <div key={meeting.id} className="rounded-xl border border-ink/10 bg-paper-dim p-5">
                  <p className="font-semibold text-ink">{meeting.title}</p>
                  <p className="mt-1 text-sm text-ink/60">{formatDateTime(meeting.scheduled_at)}</p>
                  {meeting.notes && <p className="mt-2 text-sm text-ink/50">{meeting.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      </div>
    </Container>
  );
}
