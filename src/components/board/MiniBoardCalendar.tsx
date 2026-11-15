import Link from "next/link";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** 'YYYY-MM-DD' in the org's home time zone, matching how dates are
 * displayed elsewhere in the portal (America/Chicago). */
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

/** Real, read-only month view marking days that have an actual scheduled
 * board meeting — no invented events. Always shows the current month; a
 * full Calendar section (other months, personal events) is a separate,
 * not-yet-built feature. */
export function MiniBoardCalendar({ meetingDates }: { meetingDates: string[] }) {
  const todayKey = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(new Date());
  const [year, month] = todayKey.split("-").map(Number);
  const markedDays = new Set(
    meetingDates.filter((iso) => {
      const key = chicagoDateKey(iso);
      const [y, m] = key.split("-").map(Number);
      return y === year && m === month;
    }).map((iso) => Number(chicagoDateKey(iso).split("-")[2]))
  );
  const todayDay = Number(todayKey.split("-")[2]);
  const weeks = monthGridCells(year, month - 1);

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-base text-[#0b1f3a]">{MONTH_LABELS[month - 1]} {year}</p>
        <Link href="/board/meetings" className="text-xs font-semibold text-blue-700 hover:underline">
          View Meetings
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink/40">
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
      <div className="mt-1 flex flex-col gap-1">
        {weeks.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-1">
            {week.map((day, j) => (
              <div
                key={j}
                className={
                  day === null
                    ? ""
                    : `flex flex-col items-center justify-center rounded-lg py-1.5 text-xs ${
                        day === todayDay ? "bg-blue-700 font-bold text-white" : "text-ink/70"
                      }`
                }
              >
                {day !== null && (
                  <>
                    <span>{day}</span>
                    {markedDays.has(day) && (
                      <span className={`mt-0.5 h-1 w-1 rounded-full ${day === todayDay ? "bg-white" : "bg-blue-700"}`} />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
