import type { Config } from "@netlify/functions";

// Scheduled Functions only run against published/production deploys, never
// Deploy Previews or branch deploys — see POST /api/admin/meeting-reminders
// for a manually-triggerable equivalent used to test this logic in preview.
// Relative imports only: this function is bundled separately from the
// Next.js app and doesn't share its "@/" tsconfig path alias.
import { sendDueReminders } from "../../src/lib/meeting-reminders";

export default async () => {
  try {
    const results = await sendDueReminders();
    console.log(`[meeting-reminders] sent ${results.length} reminder(s)`, results);
  } catch (error) {
    console.error("[meeting-reminders] failed", error);
  }
};

export const config: Config = {
  // Every 15 minutes — frequent enough that a meeting 24h or 1h out gets
  // its reminder promptly, without being wasteful. Duplicate sends are
  // prevented by reminder_24h_sent_at/reminder_1h_sent_at regardless of
  // how often this runs.
  schedule: "*/15 * * * *",
};
