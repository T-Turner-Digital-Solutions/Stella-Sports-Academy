import { getDb } from "@/lib/db";

export type BoardMeetingStatus = "scheduled" | "live" | "completed" | "cancelled";

export type BoardMeeting = {
  id: string;
  created_at: string;
  created_by: string | null;
  title: string;
  scheduled_at: string;
  zoom_url: string | null;
  notes: string | null;
  invitee_ids: string[] | null;
  status: BoardMeetingStatus;
  reminder_24h_sent_at: string | null;
  reminder_1h_sent_at: string | null;
};

const VISIBILITY_CLAUSE = `(invitee_ids IS NULL OR $1 = ANY(invitee_ids) OR created_by = $1)`;

// Postgres "undefined_column" (42703) or "undefined_table" (42P01) —
// thrown if this code runs against a database that hasn't had the
// migration applied yet (missing status/invitee_ids, or the table itself).
// Degrading to an empty list here, instead of letting the whole page 500,
// is a deliberate stop-gap: it keeps /board and everything else that calls
// these functions usable (just showing "nothing scheduled") until the
// migration runs, rather than the entire portal going down over one query.
function isMigrationNotAppliedError(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("code" in error)) return false;
  return error.code === "42703" || error.code === "42P01";
}

/** Upcoming, non-cancelled meetings a given member can see — every
 * board-wide meeting, plus any invite-only meeting they were actually
 * invited to or created. isOwner bypasses the invite-list filter, since an
 * owner manages all meetings regardless of who's invited. */
export async function listUpcomingBoardMeetingsForUser(userId: string, isOwner: boolean) {
  const db = getDb();
  if (!db) return [];
  try {
    const result = await db.query<BoardMeeting>(
      `SELECT * FROM board_meetings
       WHERE scheduled_at >= now() AND status != 'cancelled'
         AND (${isOwner ? "true" : VISIBILITY_CLAUSE})
       ORDER BY scheduled_at ASC`,
      isOwner ? [] : [userId]
    );
    return result.rows;
  } catch (error) {
    if (!isMigrationNotAppliedError(error)) throw error;
    console.error("[board-meetings] Migration not applied yet — returning no meetings instead of failing the page.");
    return [];
  }
}

/** Full history (including past and cancelled) a given member can see. */
export async function listAllBoardMeetingsForUser(userId: string, isOwner: boolean) {
  const db = getDb();
  if (!db) return [];
  try {
    const result = await db.query<BoardMeeting>(
      `SELECT * FROM board_meetings
       WHERE ${isOwner ? "true" : VISIBILITY_CLAUSE}
       ORDER BY scheduled_at DESC`,
      isOwner ? [] : [userId]
    );
    return result.rows;
  } catch (error) {
    if (!isMigrationNotAppliedError(error)) throw error;
    console.error("[board-meetings] Migration not applied yet — returning no meetings instead of failing the page.");
    return [];
  }
}

/** Internal/system use only (e.g. the reminder job) — every meeting,
 * regardless of who can see it in the UI. Never expose this to a request
 * without a visibility check of its own. */
export async function listAllBoardMeetingsUnscoped() {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<BoardMeeting>(`SELECT * FROM board_meetings ORDER BY scheduled_at DESC`);
  return result.rows;
}

export async function findBoardMeetingById(id: string) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query<BoardMeeting>(`SELECT * FROM board_meetings WHERE id = $1`, [id]);
  return result.rows[0] ?? null;
}

export async function createBoardMeeting(data: {
  title: string;
  scheduledAt: string;
  zoomUrl?: string;
  notes?: string;
  inviteeIds?: string[];
  createdBy: string;
}) {
  const db = getDb();
  if (!db) return null;
  // created_by is nullable (ON DELETE SET NULL) specifically so a stale,
  // pre-database session id (e.g. the "env-admin" bootstrap sentinel — see
  // @/lib/auth) falls back to no attribution instead of crashing the insert
  // on an invalid UUID.
  const createdBy = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.createdBy)
    ? data.createdBy
    : null;
  const invitees = data.inviteeIds && data.inviteeIds.length > 0 ? data.inviteeIds : null;
  const result = await db.query<BoardMeeting>(
    `INSERT INTO board_meetings (title, scheduled_at, zoom_url, notes, invitee_ids, created_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [data.title, data.scheduledAt, data.zoomUrl || null, data.notes || null, invitees, createdBy]
  );
  return result.rows[0] ?? null;
}

export type BoardMeetingUpdate = {
  title?: string;
  scheduledAt?: string;
  zoomUrl?: string | null;
  notes?: string | null;
  inviteeIds?: string[] | null;
};

export async function updateBoardMeeting(id: string, data: BoardMeetingUpdate) {
  const db = getDb();
  if (!db) return null;
  const invitees = data.inviteeIds && data.inviteeIds.length > 0 ? data.inviteeIds : null;
  const result = await db.query<BoardMeeting>(
    `UPDATE board_meetings
     SET title = COALESCE($2, title),
         scheduled_at = COALESCE($3, scheduled_at),
         zoom_url = CASE WHEN $4::boolean THEN $5 ELSE zoom_url END,
         notes = CASE WHEN $6::boolean THEN $7 ELSE notes END,
         invitee_ids = CASE WHEN $8::boolean THEN $9 ELSE invitee_ids END,
         -- Rescheduling to a genuinely different time means any reminder
         -- already sent was for the old time — reset both flags so the
         -- new time gets its own 24h/1h reminders instead of staying
         -- silently suppressed.
         reminder_24h_sent_at = CASE WHEN $3 IS NOT NULL AND $3::timestamptz IS DISTINCT FROM scheduled_at THEN NULL ELSE reminder_24h_sent_at END,
         reminder_1h_sent_at = CASE WHEN $3 IS NOT NULL AND $3::timestamptz IS DISTINCT FROM scheduled_at THEN NULL ELSE reminder_1h_sent_at END
     WHERE id = $1
     RETURNING *`,
    [
      id,
      data.title ?? null,
      data.scheduledAt ?? null,
      data.zoomUrl !== undefined,
      data.zoomUrl || null,
      data.notes !== undefined,
      data.notes || null,
      data.inviteeIds !== undefined,
      invitees,
    ]
  );
  return result.rows[0] ?? null;
}

export async function setBoardMeetingStatus(id: string, status: BoardMeetingStatus) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query<BoardMeeting>(
    `UPDATE board_meetings SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rows[0] ?? null;
}

export async function markMeetingReminderSent(id: string, window: "24h" | "1h") {
  const db = getDb();
  if (!db) return false;
  const column = window === "24h" ? "reminder_24h_sent_at" : "reminder_1h_sent_at";
  await db.query(`UPDATE board_meetings SET ${column} = now() WHERE id = $1`, [id]);
  return true;
}

/** True deletion — kept for genuine mistakes (e.g. a duplicate test entry),
 * but the portal's "Cancel Meeting" action uses setBoardMeetingStatus
 * instead, so real meeting history is never lost. */
export async function deleteBoardMeeting(id: string) {
  const db = getDb();
  if (!db) return false;
  await db.query(`DELETE FROM board_meetings WHERE id = $1`, [id]);
  return true;
}

/** Every account that should receive a notification for this meeting:
 * the resolved invitee list (or every active board member, for a
 * board-wide meeting) plus the creator, deduplicated. */
export async function resolveMeetingNotificationRecipients(meeting: BoardMeeting) {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<{ id: string; email: string; name: string }>(
    meeting.invitee_ids && meeting.invitee_ids.length > 0
      ? `SELECT id, email, name FROM admin_users WHERE active = true AND (id = ANY($1::uuid[]) OR id = $2)`
      : `SELECT id, email, name FROM admin_users WHERE active = true`,
    meeting.invitee_ids && meeting.invitee_ids.length > 0 ? [meeting.invitee_ids, meeting.created_by] : []
  );
  return result.rows;
}
