import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { createInvite, findAdminUserByEmail } from "@/lib/admin-users";
import { sendConfirmationEmail, escapeHtml } from "@/lib/email";
import { site } from "@/content/site";

const inviteSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(1, "Name is required").max(150),
  role: z.enum(["owner", "member"]),
});

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { message: "Set DATABASE_URL to manage board member accounts." },
      { status: 501 }
    );
  }

  const session = await getCurrentAdminSession();
  if (!session || session.role !== "owner") {
    return NextResponse.json({ message: "Only owners can invite board members." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Enter a valid name, email, and role." }, { status: 400 });
  }

  const existing = await findAdminUserByEmail(parsed.data.email);
  if (existing) {
    return NextResponse.json({ message: "That email already has an account." }, { status: 409 });
  }

  const invite = await createInvite(parsed.data);
  if (!invite || !invite.invite_token) {
    return NextResponse.json({ message: "Could not create the invite. Please try again." }, { status: 500 });
  }

  const inviteUrl = `${site.url}/admin/accept-invite?token=${invite.invite_token}`;

  await sendConfirmationEmail(
    invite.email,
    `You're invited to ${site.name} admin`,
    `<p>Hi ${escapeHtml(invite.name)},</p>
     <p>${escapeHtml(session.name || "A board member")} invited you to the ${escapeHtml(site.name)} admin
     section, where the board reviews athlete applications, volunteer sign-ups, sponsorship inquiries,
     contact messages, and donations.</p>
     <p><a href="${inviteUrl}">Set your password to accept the invite</a></p>
     <p>This link expires in 7 days. If you weren't expecting this invite, you can ignore this email.</p>`
  );

  return NextResponse.json({ message: `Invite sent to ${invite.email}.` });
}
