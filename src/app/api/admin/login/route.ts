import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createSessionToken,
  isAuthConfigured,
  sessionCookieOptions,
  SESSION_COOKIE,
  verifyAdminCredentials,
} from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      {
        message:
          "Admin login isn't configured yet. Set ADMIN_EMAIL, ADMIN_PASSWORD_HASH, and SESSION_SECRET.",
      },
      { status: 501 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Enter a valid email and password." }, { status: 400 });
  }

  const valid = await verifyAdminCredentials(parsed.data.email, parsed.data.password);
  if (!valid) {
    return NextResponse.json({ message: "Incorrect email or password." }, { status: 401 });
  }

  const token = await createSessionToken(parsed.data.email);
  const response = NextResponse.json({ message: "Signed in." });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
