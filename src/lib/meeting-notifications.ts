import { sendConfirmationEmail, escapeHtml } from "@/lib/email";
import { resolveMeetingNotificationRecipients, type BoardMeeting } from "@/lib/board-meetings";
import { site } from "@/content/site";

function formatMeetingTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Chicago",
  }).format(new Date(iso));
}

function meetingDetailsHtml(meeting: BoardMeeting) {
  return `
    <p><strong>${escapeHtml(meeting.title)}</strong></p>
    <p>${escapeHtml(formatMeetingTime(meeting.scheduled_at))} (Central Time)</p>
    ${
      meeting.zoom_url
        ? `<p><a href="${escapeHtml(meeting.zoom_url)}">${escapeHtml(meeting.zoom_url)}</a></p>`
        : `<p>No meeting link has been added yet — check the portal before the meeting.</p>`
    }
    ${meeting.notes ? `<p>${escapeHtml(meeting.notes)}</p>` : ""}
    <p><a href="${site.url}/board/meetings">View in the Board Portal</a></p>
  `;
}

/** Every call here resolves its own recipient list fresh from the database
 * (via resolveMeetingNotificationRecipients) rather than trusting a list
 * passed in, so a stale caller can never under- or over-notify. Each send
 * is independent — one failed email never blocks the others. */
async function sendToAll(meeting: BoardMeeting, subject: string, bodyHtml: string) {
  const recipients = await resolveMeetingNotificationRecipients(meeting);
  const results = await Promise.all(
    recipients.map((r) => sendConfirmationEmail(r.email, subject, `<p>Hi ${escapeHtml(r.name)},</p>${bodyHtml}`))
  );
  return { attempted: recipients.length, delivered: results.filter((r) => r.delivered).length };
}

export async function sendMeetingInviteEmail(meeting: BoardMeeting) {
  return sendToAll(
    meeting,
    `You're invited: ${meeting.title} — ${site.name}`,
    `<p>You've been invited to a board meeting.</p>${meetingDetailsHtml(meeting)}`
  );
}

export async function sendMeetingUpdateEmail(meeting: BoardMeeting, changeSummary: string) {
  return sendToAll(
    meeting,
    `Meeting updated: ${meeting.title} — ${site.name}`,
    `<p>A board meeting you're invited to has changed: ${escapeHtml(changeSummary)}.</p>${meetingDetailsHtml(meeting)}`
  );
}

export async function sendMeetingCancelledEmail(meeting: BoardMeeting) {
  return sendToAll(
    meeting,
    `Cancelled: ${meeting.title} — ${site.name}`,
    `<p>This board meeting has been cancelled:</p><p><strong>${escapeHtml(meeting.title)}</strong></p><p>${escapeHtml(
      formatMeetingTime(meeting.scheduled_at)
    )} (Central Time)</p>`
  );
}

export async function sendMeetingReminderEmail(meeting: BoardMeeting, window: "24h" | "1h") {
  const when = window === "24h" ? "tomorrow" : "in about an hour";
  return sendToAll(
    meeting,
    `Reminder: ${meeting.title} is ${when} — ${site.name}`,
    `<p>This is a reminder that a board meeting is coming up ${when}.</p>${meetingDetailsHtml(meeting)}`
  );
}
