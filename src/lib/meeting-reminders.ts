import { listAllBoardMeetingsUnscoped, markMeetingReminderSent } from "@/lib/board-meetings";
import { sendMeetingReminderEmail } from "@/lib/meeting-notifications";

const HOUR_MS = 60 * 60 * 1000;

/** Sends the 24h and 1h reminder for every meeting that has crossed that
 * threshold and hasn't been reminded yet (reminder_24h_sent_at /
 * reminder_1h_sent_at IS NULL) — idempotent no matter how often or
 * irregularly this runs, since each reminder is only ever sent once per
 * meeting. Cancelled meetings are skipped entirely.
 *
 * The 24h reminder only fires while the meeting is still MORE than an hour
 * away. Without that lower bound, a meeting created (or rescheduled into)
 * less than an hour out would get its "24 hours" and "about an hour"
 * reminders in the very same run — technically not a duplicate (they're
 * different reminders), but a confusing double-send that doesn't reflect
 * real advance notice. In that case only the 1h reminder fires, since
 * that's the only one still meaningful.
 *
 * Intended to be called by a Netlify Scheduled Function (see
 * netlify/functions/meeting-reminders.mts) on a real schedule, and by the
 * owner-only manual-trigger API route for testing in environments (like
 * Deploy Previews) where scheduled functions don't run. */
export async function sendDueReminders() {
  const meetings = await listAllBoardMeetingsUnscoped();
  const now = Date.now();
  const results: { meetingId: string; window: "24h" | "1h"; attempted: number; delivered: number }[] = [];

  for (const meeting of meetings) {
    if (meeting.status === "cancelled") continue;
    const msUntil = new Date(meeting.scheduled_at).getTime() - now;
    if (msUntil <= 0) continue;

    if (msUntil <= 24 * HOUR_MS && msUntil > HOUR_MS && !meeting.reminder_24h_sent_at) {
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
