import { NextResponse } from "next/server";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { sendDueReminders } from "@/lib/meeting-reminders";

/** Owner-only manual trigger for the same reminder logic the Netlify
 * Scheduled Function runs in production. Netlify Scheduled Functions never
 * run against Deploy Previews, so this is how the 24h/1h reminder logic can
 * actually be tested before merging. */
export async function POST() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to send reminders." }, { status: 501 });
  }

  const session = await getCurrentAdminSession();
  if (!session || session.role !== "owner") {
    return NextResponse.json({ message: "Only owners can trigger reminders." }, { status: 403 });
  }

  try {
    const results = await sendDueReminders();
    return NextResponse.json({ message: `Checked all meetings — ${results.length} reminder(s) sent.`, results });
  } catch (error) {
    console.error("[meeting-reminders:manual-trigger]", error);
    return NextResponse.json({ message: "Failed to send reminders.", error: String(error) }, { status: 500 });
  }
}
