import { NextResponse } from "next/server";
import { getCurrentAdminSession } from "@/lib/auth";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { SCHEMA_SQL } from "@/lib/schema";

const EXPECTED_TABLES = [
  "athlete_applications",
  "volunteer_applications",
  "corporate_sponsorship_inquiries",
  "contact_submissions",
  "admin_users",
  "board_meetings",
  "donations",
  "board_documents",
  "board_document_acknowledgments",
];

/** Owners can always use this; DB_SETUP_SECRET is an optional extra way in
 * for one-off operational use (e.g. scripted verification right after
 * DATABASE_URL is first connected, before anyone has a session yet, or
 * right after DATABASE_URL changes — a DB-dependent login attempt in that
 * window would otherwise 500 since admin_users doesn't exist yet). */
async function isAuthorized(request: Request) {
  const session = await getCurrentAdminSession();
  if (session?.role === "owner") return true;

  const secret = process.env.DB_SETUP_SECRET;
  if (!secret) return false;
  return request.headers.get("x-setup-secret") === secret;
}

async function tableStatus() {
  const db = getDb();
  if (!db) return { connected: false as const };

  const result = await db.query<{ tablename: string }>(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`
  );
  const existing = new Set(result.rows.map((r) => r.tablename));
  const tables = Object.fromEntries(EXPECTED_TABLES.map((t) => [t, existing.has(t)]));

  let adminUserCount: number | null = null;
  if (existing.has("admin_users")) {
    const count = await db.query<{ count: string }>(`SELECT count(*) FROM admin_users`);
    adminUserCount = Number(count.rows[0]?.count ?? 0);
  }

  return { connected: true as const, tables, adminUserCount };
}

export async function GET(request: Request) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ message: "Not authorized." }, { status: 403 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "DATABASE_URL is not set." }, { status: 501 });
  }

  try {
    const status = await tableStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error("[db-setup:status-failed]", error);
    return NextResponse.json(
      { message: "Could not query the database.", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ message: "Not authorized." }, { status: 403 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "DATABASE_URL is not set." }, { status: 501 });
  }

  const db = getDb()!;

  try {
    await db.query(SCHEMA_SQL);
    const status = await tableStatus();
    return NextResponse.json({ message: "Database schema applied.", ...status });
  } catch (error) {
    console.error("[db-setup:apply-failed]", error);
    return NextResponse.json(
      { message: "Failed to apply schema.", error: String(error) },
      { status: 500 }
    );
  }
}
