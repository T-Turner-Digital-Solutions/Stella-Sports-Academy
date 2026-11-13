import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { findAdminUserById, updateAdminUserPassword } from "@/lib/admin-users";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password."),
  newPassword: z.string().min(8, "New password must be at least 8 characters."),
});

// Accounts bootstrapped before DATABASE_URL was connected carry the
// sentinel id "env-admin" (see verifyAdminCredentials in @/lib/auth)
// instead of a real admin_users UUID. A session token issued back then is
// still a valid, signed token — it just can't be looked up as a database
// row. Without this check that mismatch would reach findAdminUserById as a
// malformed UUID and crash the query instead of failing cleanly.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Accounts aren't database-backed yet." }, { status: 501 });
  }

  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }
  if (!UUID_RE.test(session.id)) {
    return NextResponse.json(
      { message: "Your session is out of date. Please log out and log back in, then try again." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Enter a valid password." },
      { status: 400 }
    );
  }

  const user = await findAdminUserById(session.id);
  if (!user || !user.active || !user.password_hash) {
    return NextResponse.json({ message: "Account not found." }, { status: 404 });
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.password_hash);
  if (!valid) {
    return NextResponse.json({ message: "Current password is incorrect." }, { status: 401 });
  }

  const newHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await updateAdminUserPassword(user.id, newHash);

  return NextResponse.json({ message: "Password updated." });
}
