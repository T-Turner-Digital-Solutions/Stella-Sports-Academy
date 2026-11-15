import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarClock, FileCheck2, CalendarDays, Users, Video, ClipboardList, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { StatCard } from "@/components/board/StatCard";
import { MiniBoardCalendar } from "@/components/board/MiniBoardCalendar";
import { isDatabaseConfigured } from "@/lib/db";
import { getCurrentAdminSession } from "@/lib/auth";
import { listUpcomingBoardMeetings, listAllBoardMeetings } from "@/lib/board-meetings";
import { listCurrentBoardDocuments, listAcknowledgedDocumentIds } from "@/lib/board-documents";
import { findAdminUserById, firstName, formatPositionLabel, listAdminUsers } from "@/lib/admin-users";

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
  const upcoming = dbReady ? await listUpcomingBoardMeetings() : [];
  const allMeetings = dbReady ? await listAllBoardMeetings() : [];
  const documents = dbReady ? await listCurrentBoardDocuments() : [];
  const acknowledgedIds = dbReady && session ? await listAcknowledgedDocumentIds(session.id) : [];
  const pendingDocs = documents.filter((d) => !acknowledgedIds.includes(d.id));
  const members = dbReady ? await listAdminUsers() : [];
  const activeMemberCount = members.filter((m) => m.active).length;
  const nextMeeting = upcoming[0];
  const member = dbReady && session ? await findAdminUserById(session.id) : null;
  const positionLabel = member ? formatPositionLabel(member) : null;

  return (
    <Container>
      <div className="relative h-56 overflow-hidden rounded-xl bg-[#0b1f3a] sm:h-64">
        <Image
          src="/hero/athletes-hero.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-cover object-[70%_30%] opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1f3a] via-[#0b1f3a]/85 to-[#0b1f3a]/20" />
        <div className="relative flex h-full flex-col justify-center p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-300">Board Portal</p>
          <h1 className="mt-1.5 text-3xl font-bold text-white sm:text-4xl">
            Welcome{session?.name ? `, ${firstName(session.name)}` : ""}!
          </h1>
          {positionLabel && <p className="mt-1 text-sm font-semibold text-blue-300">{positionLabel}</p>}
          <p className="mt-2 max-w-md text-sm text-white/70">
            Your board workspace for meetings, documents, decisions, and academy growth.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={CalendarClock}
          label="Next Meeting"
          value={nextMeeting ? formatDateTime(nextMeeting.scheduled_at).split(",").slice(0, 2).join(",") : "None set"}
        />
        <StatCard icon={FileCheck2} label="Documents to Acknowledge" value={pendingDocs.length} />
        <StatCard icon={CalendarDays} label="Upcoming Meetings" value={upcoming.length} />
        <StatCard icon={Users} label="Active Board Members" value={activeMemberCount} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-700">
            <Video className="h-3.5 w-3.5" />
            Upcoming Board Meeting
          </p>
          {nextMeeting ? (
            <>
              <p className="mt-2 text-lg font-semibold text-[#0b1f3a]">{nextMeeting.title}</p>
              <p className="mt-1 text-sm font-medium text-ink/60">{formatDateTime(nextMeeting.scheduled_at)}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {nextMeeting.zoom_url ? (
                  <a
                    href={nextMeeting.zoom_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
                  >
                    <Video className="h-4 w-4" />
                    Join Meeting
                  </a>
                ) : (
                  <p className="text-sm text-ink/40">A meeting link hasn&apos;t been added yet.</p>
                )}
                <Link
                  href="/board/meetings"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink/70 transition-colors hover:bg-paper"
                >
                  <ClipboardList className="h-4 w-4" />
                  View Agenda
                </Link>
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm text-ink/50">Nothing scheduled right now.</p>
          )}
        </div>

        <MiniBoardCalendar meetingDates={allMeetings.map((m) => m.scheduled_at)} />

        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-base text-[#0b1f3a]">Documents Awaiting Acknowledgment</p>
            <Link href="/board/corporate-records" className="text-xs font-semibold text-blue-700 hover:underline">
              View All
            </Link>
          </div>
          {pendingDocs.length === 0 ? (
            <p className="mt-3 text-sm text-ink/50">All caught up — nothing pending.</p>
          ) : (
            <div className="mt-3 flex flex-col gap-3">
              {pendingDocs.slice(0, 4).map((doc) => (
                <Link
                  key={doc.id}
                  href={`/board/documents/${doc.id}`}
                  className="group flex items-center justify-between gap-2 text-sm"
                >
                  <span className="text-ink/80 group-hover:text-blue-700">{doc.title}</span>
                  <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-ink/30 transition-transform group-hover:translate-x-1 group-hover:text-blue-700" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
