import { listAllBoardMeetingsUnscoped, markMeetingReminderSent } from "@/lib/board-meetings";
import { sendMeetingReminderEmail } from "@/lib/meeting-notifications";

const HOUR_MS = 60 * 60 * 1000;

/** Sends the 24h and 1h reminder for every meeting that has crossed that
 * threshold and hasn't been reminded yet (reminder_24h_sent_at /
 * reminder_1h_sent_at IS NULL) — idempotent no matter how often or
 * irregularly this runs, since each reminder is only ever sent once per
 * meeting. Cancelled meetings are skipped entirely. Intended to be called
 * by a Netlify Scheduled Function (see netlify/functions/meeting-reminders.mts)
 * on a real schedule, and by the owner-only manual-trigger API route for
 * testing in environments (like Deploy Previews) where scheduled functions
 * don't run. */
export async function sendDueReminders() {
  const meetings = await listAllBoardMeetingsUnscoped();
  const now = Date.now();
  const results: { meetingId: string; window: "24h" | "1h"; attempted: number; delivered: number }[] = [];

  for (const meeting of meetings) {
    if (meeting.status === "cancelled") continue;
    const msUntil = new Date(meeting.scheduled_at).getTime() - now;
    if (msUntil <= 0) continue;

    if (msUntil <= 24 * HOUR_MS && !meeting.reminder_24h_sent_at) {
      const result = await sendMeetingReminderEmail(meeting, "24h");
      await markMeetingReminderSent(meeting.id, "24h");
      results.push({ meetingId: meeting.id, window: "24h", ...result });
    }

    if (msUntil <= HOUR_MS && !meeting.reminder_1h_sent_at) {
      const result = await sendMeetingReminderEmail(meeting, "1h");
      await markMeetingReminderSent(meeting.id, "1h");
      results.push({ meetingId: meeting.id, window: "1h", ...result });
    }
  }

  return results;
}
