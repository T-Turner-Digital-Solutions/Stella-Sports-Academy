import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { acceptInvite, findAdminUserByInviteToken, touchLastLogin } from "@/lib/admin-users";
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";

const acceptInviteSchema = z.object({
  token: z.string().trim().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function GET(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Admin accounts aren't configured yet." }, { status: 501 });
  }

  const token = new URL(request.url).searchParams.get("token") ?? "";
  const invite = token ? await findAdminUserByInviteToken(token) : null;
  if (!invite) {
    return NextResponse.json({ message: "This invite link is invalid or has expired." }, { status: 404 });
  }

  return NextResponse.json({ name: invite.name, email: invite.email });
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Admin accounts aren't configured yet." }, { status: 501 });
  }

  const body = await request.json().catch(() => null);
  const parsed = acceptInviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Enter a password with at least 8 characters." },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await acceptInvite(parsed.data.token, passwordHash);
  if (!user) {
    return NextResponse.json({ message: "This invite link is invalid or has expired." }, { status: 404 });
  }

  await touchLastLogin(user.id);

  const token = await createSessionToken({ id: user.id, email: user.email, name: user.name, role: user.role });
  const response = NextResponse.json({ message: "Account set up. Signing you in…" });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
