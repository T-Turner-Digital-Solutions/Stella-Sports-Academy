import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import {
  findAdminUserById,
  setAdminUserActive,
  updateAdminUserTitle,
  updateAdminUserEmail,
  resendInvite,
  setAdminUserPasswordDirect,
} from "@/lib/admin-users";
import { sendConfirmationEmail, escapeHtml } from "@/lib/email";
import { site } from "@/content/site";

const patchSchema = z.object({
  id: z.string().uuid(),
  active: z.boolean().optional(),
  title: z.string().trim().max(100).optional(),
  email: z.string().trim().email().optional(),
  password: z.string().min(8, "Password must be at least 8 characters.").optional(),
});

const resendSchema = z.object({
  id: z.string().uuid(),
});

async function requireOwner() {
  if (!isDatabaseConfigured()) {
    return { error: NextResponse.json({ message: "Set DATABASE_URL to manage board member accounts." }, { status: 501 }) };
  }
  const session = await getCurrentAdminSession();
  if (!session || session.role !== "owner") {
    return { error: NextResponse.json({ message: "Only owners can manage board member accounts." }, { status: 403 }) };
  }
  return { session };
}

export async function PATCH(request: Request) {
  const auth = await requireOwner();
  if (auth.error) return auth.error;
  const session = auth.session!;

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (
    !parsed.success ||
    (parsed.data.active === undefined &&
      parsed.data.title === undefined &&
      parsed.data.email === undefined &&
      parsed.data.password === undefined)
  ) {
    return NextResponse.json(
      { message: parsed.success ? "Invalid request." : parsed.error.issues[0]?.message || "Invalid request." },
      { status: 400 }
    );
  }

  if (parsed.data.id === session.id && parsed.data.active === false) {
    return NextResponse.json({ message: "You can't deactivate your own account." }, { status: 400 });
  }

  const target = await findAdminUserById(parsed.data.id);
  if (!target) {
    return NextResponse.json({ message: "Board member not found." }, { status: 404 });
  }

  if (parsed.data.active !== undefined) {
    await setAdminUserActive(parsed.data.id, parsed.data.active);
  }
  if (parsed.data.title !== undefined) {
    await updateAdminUserTitle(parsed.data.id, parsed.data.title || null);
  }
  if (parsed.data.email !== undefined) {
    const ok = await updateAdminUserEmail(parsed.data.id, parsed.data.email);
    if (!ok) {
      return NextResponse.json({ message: "That email is already in use by another account." }, { status: 409 });
    }
  }
  if (parsed.data.password !== undefined) {
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    await setAdminUserPasswordDirect(parsed.data.id, passwordHash);
  }

  return NextResponse.json({ message: "Board member updated." });
}

/** Resends an invite email to an account that hasn't accepted it yet,
 * with a fresh 7-day token — e.g. the original was missed, bounced, or
 * expired. Reuses the exact invite email from POST /api/admin/invite. */
export async function POST(request: Request) {
  const auth = await requireOwner();
  if (auth.error) return auth.error;
  const session = auth.session!;

  const body = await request.json().catch(() => null);
  const parsed = resendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const updated = await resendInvite(parsed.data.id);
  if (!updated || !updated.invite_token) {
    return NextResponse.json(
      { message: "Could not resend — that account may already be active." },
      { status: 400 }
    );
  }

  const inviteUrl = `${site.url}/board/accept-invite?token=${updated.invite_token}`;
  await sendConfirmationEmail(
    updated.email,
    `You're invited to the ${site.name} Board Management Portal`,
    `<p>Hi ${escapeHtml(updated.name)},</p>
     <p>${escapeHtml(session.name || "A board member")} invited you to the ${escapeHtml(site.name)} Board
     Management Portal — meetings, corporate records, financials, notes, and messages for the board.</p>
     <p><a href="${inviteUrl}">Set your password to activate your account</a></p>
     <p>This link expires in 7 days. If you weren't expecting this invite, you can ignore this email.</p>`
  );

  return NextResponse.json({ message: `Invite resent to ${updated.email}.` });
}
