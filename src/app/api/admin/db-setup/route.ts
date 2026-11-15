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
  "board_document_email_log",
  "financial_goals",
  "financial_goal_changes",
  "board_suggestions",
  "board_notes",
  "board_messages",
  "board_votes",
  "board_vote_responses",
  "board_meeting_minutes",
  "board_meeting_minutes_history",
];

// Columns added by later migrations — a table can exist from an older
// schema version while still missing these, so table-existence alone isn't
// enough to confirm meeting scheduling, notes sharing, or message threads
// are actually ready to use.
const EXPECTED_COLUMNS: { table: string; column: string }[] = [
  { table: "admin_users", column: "title" },
  { table: "board_meetings", column: "invitee_ids" },
  { table: "board_meetings", column: "status" },
  { table: "board_meetings", column: "reminder_24h_sent_at" },
  { table: "board_meetings", column: "reminder_1h_sent_at" },
  { table: "board_notes", column: "shared_with" },
  { table: "board_notes", column: "meeting_id" },
  { table: "board_messages", column: "parent_message_id" },
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

  // Only check columns on tables that exist — information_schema.columns
  // simply returns no rows for a table that isn't there yet, which would
  // otherwise read as a false "missing column" rather than "missing table".
  const columnChecks = await Promise.all(
    EXPECTED_COLUMNS.filter((c) => existing.has(c.table)).map(async (c) => {
      const result = await db.query<{ exists: boolean }>(
        `SELECT EXISTS (
           SELECT 1 FROM information_schema.columns
           WHERE table_name = $1 AND column_name = $2
         ) AS exists`,
        [c.table, c.column]
      );
      return [`${c.table}.${c.column}`, result.rows[0]?.exists ?? false] as const;
    })
  );
  const columns = Object.fromEntries(
    EXPECTED_COLUMNS.map((c) => [`${c.table}.${c.column}`, false])
  );
  for (const [key, ok] of columnChecks) columns[key] = ok;

  const titleColumnExists = columns["admin_users.title"];
  const meetingManagementReady =
    tables.board_meetings &&
    columns["board_meetings.invitee_ids"] &&
    columns["board_meetings.status"] &&
    columns["board_meetings.reminder_24h_sent_at"] &&
    columns["board_meetings.reminder_1h_sent_at"];
  const notesReady = tables.board_notes && columns["board_notes.shared_with"] && columns["board_notes.meeting_id"];
  const messageThreadsReady = tables.board_messages && columns["board_messages.parent_message_id"];
  const minutesReady = tables.board_meeting_minutes && tables.board_meeting_minutes_history;
  const suggestionsReady = tables.board_suggestions;
  const votingReady = tables.board_votes && tables.board_vote_responses;

  return {
    connected: true as const,
    tables,
    columns,
    adminUserCount,
    titleColumnExists,
    meetingManagementReady,
    notesReady,
    messageThreadsReady,
    minutesReady,
    suggestionsReady,
    votingReady,
  };
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
