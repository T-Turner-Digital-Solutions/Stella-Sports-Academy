import { NextResponse } from "next/server";
import { z } from "zod";
import { isDatabaseConfigured } from "@/lib/db";
import { createPasswordResetToken } from "@/lib/admin-users";
import { sendConfirmationEmail, escapeHtml } from "@/lib/email";
import { site } from "@/content/site";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email(),
});

// Always returns the same generic message, whether or not the email has an
// account — otherwise this endpoint could be used to find out who has
// admin access.
const GENERIC_MESSAGE = "If that email has an account, a password reset link has been sent.";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Accounts aren't database-backed yet." }, { status: 501 });
  }

  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
  }

  const user = await createPasswordResetToken(parsed.data.email);
  if (user?.invite_token) {
    const resetUrl = `${site.url}/admin/accept-invite?token=${user.invite_token}`;
    await sendConfirmationEmail(
      user.email,
      `Reset your ${site.name} admin password`,
      `<p>Hi ${escapeHtml(user.name)},</p>
       <p>A password reset was requested for your ${escapeHtml(site.name)} admin account. If this was
       you, set a new password here:</p>
       <p><a href="${resetUrl}">Reset your password</a></p>
       <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email —
       your password hasn't been changed.</p>`
    );
  }

  return NextResponse.json({ message: GENERIC_MESSAGE });
}
