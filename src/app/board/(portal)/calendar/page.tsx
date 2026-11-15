import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CalendarClock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { isDatabaseConfigured } from "@/lib/db";
import { listAllBoardMeetingsForUser } from "@/lib/board-meetings";
import { getCurrentAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Calendar" };

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

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

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", { timeStyle: "short", timeZone: "America/Chicago" }).format(new Date(iso));
}

export default async function BoardCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ y?: string; m?: string }>;
}) {
  const { y, m } = await searchParams;
  const dbReady = isDatabaseConfigured();
  const session = await getCurrentAdminSession();
  const allMeetings =
    dbReady && session ? await listAllBoardMeetingsForUser(session.id, session.role === "owner") : [];

  const todayKey = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(new Date());
  const [todayYear, todayMonth, todayDay] = todayKey.split("-").map(Number);

  const year = y ? Number(y) : todayYear;
  const month = m ? Number(m) : todayMonth; // 1-12

  const prev = { year: month === 1 ? year - 1 : year, month: month === 1 ? 12 : month - 1 };
  const next = { year: month === 12 ? year + 1 : year, month: month === 12 ? 1 : month + 1 };

  const meetingsByDay = new Map<number, typeof allMeetings>();
  for (const meeting of allMeetings) {
    const key = chicagoDateKey(meeting.scheduled_at);
    const [y2, m2, d2] = key.split("-").map(Number);
    if (y2 === year && m2 === month) {
      meetingsByDay.set(d2, [...(meetingsByDay.get(d2) ?? []), meeting]);
    }
  }
  const monthMeetings = [...meetingsByDay.entries()]
    .sort((a, b) => a[0] - b[0])
    .flatMap(([, meetings]) => meetings)
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

  const weeks = monthGridCells(year, month - 1);

  return (
    <Container>
      <PortalPageHero
        title="Calendar"
        description="Every scheduled board meeting in one place, pulled directly from Board Meetings."
      />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-ink/10 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <Link
              href={`/board/calendar?y=${prev.year}&m=${prev.month}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-paper hover:text-ink"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <p className="font-semibold text-lg text-[#0b1f3a]">
              {MONTH_LABELS[month - 1]} {year}
            </p>
            <Link
              href={`/board/calendar?y=${next.year}&m=${next.month}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-paper hover:text-ink"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink/40">
            {WEEKDAY_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div className="mt-1 flex flex-col gap-1">
            {weeks.map((week, i) => (
              <div key={i} className="grid grid-cols-7 gap-1">
                {week.map((day, j) => {
                  const isToday = day === todayDay && month === todayMonth && year === todayYear;
                  const dayMeetings = day !== null ? meetingsByDay.get(day) ?? [] : [];
                  return (
                    <div
                      key={j}
                      className={`flex min-h-[56px] flex-col items-center gap-0.5 rounded-lg p-1 text-xs sm:min-h-[72px] ${
                        isToday ? "bg-blue-700 text-white" : day !== null ? "bg-paper text-ink/70" : ""
                      }`}
                    >
                      {day !== null && (
                        <>
                          <span className={isToday ? "font-bold" : "font-medium"}>{day}</span>
                          {dayMeetings.length > 0 && (
                            <span
                              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                                isToday ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {dayMeetings.length} meeting{dayMeetings.length > 1 ? "s" : ""}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold text-base text-[#0b1f3a]">
            {MONTH_LABELS[month - 1]} Meetings
          </p>
          <div className="mt-3 flex flex-col gap-3">
            {monthMeetings.length === 0 ? (
              <EmptyState
                theme="blue"
                icon={CalendarClock}
                title="Nothing This Month"
                description="No board meetings are scheduled this month."
              />
            ) : (
              monthMeetings.map((meeting) => (
                <Link
                  key={meeting.id}
                  href="/board/meetings"
                  className="rounded-xl border border-ink/10 bg-white p-4 transition-colors hover:border-blue-200"
                >
                  <p className="font-semibold text-sm text-[#0b1f3a]">{meeting.title}</p>
                  <p className="mt-1 text-xs text-ink/50">
                    {chicagoDateKey(meeting.scheduled_at)} at {formatTime(meeting.scheduled_at)}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
