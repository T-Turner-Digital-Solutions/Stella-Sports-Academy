import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { InteractiveCalendar } from "@/components/board/InteractiveCalendar";
import { MigrationPendingNotice } from "@/components/board/MigrationPendingNotice";
import { isDatabaseConfigured } from "@/lib/db";
import { listAllBoardMeetingsForUser, type BoardMeeting } from "@/lib/board-meetings";
import { listAdminUsers } from "@/lib/admin-users";
import { getCurrentAdminSession } from "@/lib/auth";
import { MigrationNotAppliedError } from "@/lib/migration-guard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Calendar" };

function chicagoDateKey(iso: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(new Date(iso));
}

function monthGridCells(year: number, month: number) {
  const startWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (number | null)[] = Array(startWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export default async function BoardCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ y?: string; m?: string }>;
}) {
  const { y, m } = await searchParams;
  const dbReady = isDatabaseConfigured();
  const session = await getCurrentAdminSession();
  let allMeetings: BoardMeeting[] = [];
  let unavailable = false;
  if (dbReady && session) {
    try {
      allMeetings = await listAllBoardMeetingsForUser(session.id, session.role === "owner");
    } catch (error) {
      if (!(error instanceof MigrationNotAppliedError)) throw error;
      unavailable = true;
    }
  }
  const allMembers = dbReady ? await listAdminUsers() : [];
  const members = allMembers
    .filter((mem) => mem.active && mem.id !== session?.id)
    .map((mem) => ({ id: mem.id, name: mem.name }));

  const todayKey = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(new Date());
  const [todayYear, todayMonth, todayDay] = todayKey.split("-").map(Number);

  const year = y ? Number(y) : todayYear;
  const month = m ? Number(m) : todayMonth; // 1-12

  const meetingsByDay: Record<number, BoardMeeting[]> = {};
  for (const meeting of allMeetings) {
    const key = chicagoDateKey(meeting.scheduled_at);
    const [y2, m2, d2] = key.split("-").map(Number);
    if (y2 === year && m2 === month) {
      meetingsByDay[d2] = [...(meetingsByDay[d2] ?? []), meeting];
    }
  }
  const monthMeetings = Object.entries(meetingsByDay)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .flatMap(([, meetings]) => meetings)
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

  const weeks = monthGridCells(year, month - 1);

  return (
    <Container>
      <PortalPageHero
        title="Calendar"
        description="Every scheduled board meeting in one place, pulled directly from Board Meetings."
      />
      {unavailable && <div className="mt-6"><MigrationPendingNotice feature="Calendar" /></div>}
      {!unavailable && (
        <InteractiveCalendar
          year={year}
          month={month}
          todayYear={todayYear}
          todayMonth={todayMonth}
          todayDay={todayDay}
          weeks={weeks}
          meetingsByDay={meetingsByDay}
          monthMeetings={monthMeetings}
          members={members}
        />
      )}
    </Container>
  );
}
