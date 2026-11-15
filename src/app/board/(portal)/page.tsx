import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutGrid,
  FolderOpen,
  CalendarClock,
  BarChart3,
  CheckSquare,
  Users,
  CalendarDays,
  NotebookPen,
  MessageCircle,
  HelpCircle,
  Video,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTile } from "@/components/board/SectionTile";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { listUpcomingBoardMeetingsForUser, type BoardMeeting } from "@/lib/board-meetings";
import { findAdminUserById, firstName, formatPositionLabel } from "@/lib/admin-users";
import { MigrationNotAppliedError } from "@/lib/migration-guard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Board Portal" };

const SECTIONS = [
  {
    href: "/board/dashboard",
    icon: LayoutGrid,
    title: "Dashboard",
    description: "Updates, action items, and key announcements",
  },
  {
    href: "/board/corporate-records",
    icon: FolderOpen,
    title: "Corporate Records",
    description: "Official record book, bylaws, and governance",
  },
  {
    href: "/board/meetings",
    icon: CalendarClock,
    title: "Board Meetings",
    description: "Agendas, minutes, and meeting schedule",
  },
  {
    href: "/board/financials",
    icon: BarChart3,
    title: "Financials",
    description: "Budgets, reports, and financial updates",
  },
  {
    href: "/board/voting",
    icon: CheckSquare,
    title: "Voting & Approvals",
    description: "Resolutions, decisions, and acknowledgments",
  },
  {
    href: "/board/operations",
    icon: Users,
    title: "Board Operations",
    description: "Directory, tasks, committees, and policies",
  },
  {
    href: "/board/calendar",
    icon: CalendarDays,
    title: "Calendar",
    description: "Every scheduled board meeting in one view",
  },
  {
    href: "/board/notes",
    icon: NotebookPen,
    title: "My Notes",
    description: "Private notes only you can see",
  },
  {
    href: "/board/messages",
    icon: MessageCircle,
    title: "Messages",
    description: "Share quick updates with the board",
  },
  {
    href: "/board/open-questions",
    icon: HelpCircle,
    title: "Open Questions",
    description: "Ask the administrator a question",
  },
  {
    href: "/board/external-meetings",
    icon: Video,
    title: "External Meetings",
    description: "Sponsor, donor, and partner meetings",
  },
] as const;

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Chicago",
  }).format(new Date(iso));
}

export default async function BoardPortalHubPage() {
  const session = await getCurrentAdminSession();
  const dbReady = isDatabaseConfigured();
  let upcoming: BoardMeeting[] = [];
  let meetingsUnavailable = false;
  if (dbReady && session) {
    try {
      upcoming = await listUpcomingBoardMeetingsForUser(session.id, session.role === "owner");
    } catch (error) {
      if (!(error instanceof MigrationNotAppliedError)) throw error;
      meetingsUnavailable = true;
    }
  }
  const nextMeeting = upcoming[0];
  const member = dbReady && session ? await findAdminUserById(session.id) : null;
  const positionLabel = member ? formatPositionLabel(member) : null;

  return (
    <Container className="py-8">
      <div className="flex items-start justify-between gap-4 rounded-xl bg-[#0b1f3a] p-6 sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-300">Board Portal</p>
          <h1 className="mt-1.5 text-2xl font-bold text-white sm:text-3xl">
            Welcome{session?.name ? `, ${firstName(session.name)}` : ""}!
          </h1>
          {positionLabel && <p className="mt-1 text-sm font-semibold text-blue-300">{positionLabel}</p>}
          <p className="mt-2 max-w-xl text-sm text-white/70">
            Everything you need to govern, collaborate, and support the academy.
          </p>
        </div>
        <Image
          src="/brand/stella-mark.png"
          alt="Stellar Sports Academy"
          width={1514}
          height={730}
          className="hidden h-12 w-auto flex-shrink-0 drop-shadow-sm sm:block"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <SectionTile key={section.href} {...section} />
        ))}
      </div>

      <Link
        href="/board/meetings"
        className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50 p-5 transition-colors hover:border-blue-200"
      >
        <div>
          <p className="text-sm font-semibold text-[#0b1f3a]">Upcoming Meetings &amp; Reminders</p>
          <p className="mt-0.5 text-sm text-ink/60">
            {meetingsUnavailable
              ? "Meeting schedule temporarily unavailable."
              : nextMeeting
                ? `${nextMeeting.title} — ${formatDateTime(nextMeeting.scheduled_at)}`
                : "Nothing scheduled right now."}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 flex-shrink-0 text-blue-700" />
      </Link>
    </Container>
  );
}
