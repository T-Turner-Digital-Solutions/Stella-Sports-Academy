"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CalendarClock, Video } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { MeetingForm } from "@/components/board/MeetingForm";
import type { BoardMeeting } from "@/lib/board-meetings";

type Member = { id: string; name: string };

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function chicagoDateKey(iso: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(new Date(iso));
}

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", { timeStyle: "short", timeZone: "America/Chicago" }).format(new Date(iso));
}

export function InteractiveCalendar({
  year,
  month,
  todayYear,
  todayMonth,
  todayDay,
  weeks,
  meetingsByDay,
  monthMeetings,
  members,
}: {
  year: number;
  month: number; // 1-12
  todayYear: number;
  todayMonth: number;
  todayDay: number;
  weeks: (number | null)[][];
  meetingsByDay: Record<number, BoardMeeting[]>;
  monthMeetings: BoardMeeting[];
  members: Member[];
}) {
  const [composeDate, setComposeDate] = useState<string | null>(null);

  const prev = { year: month === 1 ? year - 1 : year, month: month === 1 ? 12 : month - 1 };
  const next = { year: month === 12 ? year + 1 : year, month: month === 12 ? 1 : month + 1 };

  function dateKeyFor(day: number) {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return (
    <>
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

          <p className="mt-2 text-xs text-ink/40">Click any date to add a meeting or item.</p>

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
                  const dayMeetings = day !== null ? meetingsByDay[day] ?? [] : [];
                  return (
                    <button
                      key={j}
                      type="button"
                      disabled={day === null}
                      onClick={() => day !== null && setComposeDate(dateKeyFor(day))}
                      className={`flex min-h-[56px] flex-col items-center gap-0.5 rounded-lg p-1 text-xs transition-colors sm:min-h-[72px] ${
                        isToday
                          ? "bg-blue-700 text-white hover:bg-blue-800"
                          : day !== null
                            ? "bg-paper text-ink/70 hover:bg-blue-50"
                            : "cursor-default"
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
                    </button>
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
                description="No board meetings are scheduled this month. Click a date on the calendar to add one."
              />
            ) : (
              monthMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="rounded-xl border border-ink/10 bg-white p-4 transition-colors hover:border-blue-200"
                >
                  <Link href="/board/meetings" className="block">
                    <p className="font-semibold text-sm text-[#0b1f3a]">{meeting.title}</p>
                    <p className="mt-1 text-xs text-ink/50">
                      {chicagoDateKey(meeting.scheduled_at)} at {formatTime(meeting.scheduled_at)}
                    </p>
                  </Link>
                  {meeting.zoom_url && (
                    <a
                      href={meeting.zoom_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-800"
                    >
                      <Video className="h-3 w-3" />
                      Join Meeting
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {composeDate && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 pt-16 sm:pt-24"
          onClick={() => setComposeDate(null)}
        >
          <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <MeetingForm
              members={members}
              initialDate={composeDate}
              startOpen
              onDone={() => setComposeDate(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}
