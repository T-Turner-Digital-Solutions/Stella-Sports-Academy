import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession, createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { updateAdminUserName } from "@/lib/admin-users";

const profileSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(150),
});

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Accounts aren't database-backed yet." }, { status: 501 });
  }

  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(session.id)) {
    return NextResponse.json(
      { message: "Your session is out of date. Please log out and log back in, then try again." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message || "Enter a valid name." }, { status: 400 });
  }

  await updateAdminUserName(session.id, parsed.data.name);

  // The session cookie is a signed JWT carrying `name` as a claim set at
  // login — getCurrentAdminSession() only decodes it, it never re-queries
  // the database. Without reissuing it here, every page that reads
  // session.name (the Dashboard/Board Portal greeting) would keep showing
  // the pre-update name until the user logs out and back in, even though
  // the database row was updated correctly.
  const updatedSession = { ...session, name: parsed.data.name };
  const token = await createSessionToken(updatedSession);
  const response = NextResponse.json({ message: "Name updated." });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
