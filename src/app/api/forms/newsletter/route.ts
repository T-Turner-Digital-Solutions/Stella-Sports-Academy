import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validation";
import { sendAdminNotification, escapeHtml } from "@/lib/email";
import { firstFieldErrors } from "@/lib/forms-server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Please check the form and try again.",
        fieldErrors: firstFieldErrors(parsed.error),
      },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    // Honeypot triggered — pretend success, drop silently.
    return NextResponse.json({ message: "Thanks for signing up!" });
  }

  const { firstName, lastName, email } = parsed.data;

  await sendAdminNotification(
    "New Steller Sports Academy email signup",
    `<p><strong>${escapeHtml(firstName)} ${escapeHtml(lastName)}</strong> (${escapeHtml(email)}) joined the email list.</p>`
  );

  return NextResponse.json({ message: "Thanks for signing up! Watch your inbox for updates from Steller." });
}
