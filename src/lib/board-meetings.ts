import { getDb } from "@/lib/db";

export type BoardMeeting = {
  id: string;
  created_at: string;
  created_by: string | null;
  title: string;
  scheduled_at: string;
  zoom_url: string | null;
  notes: string | null;
};

export async function listUpcomingBoardMeetings() {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<BoardMeeting>(
    `SELECT * FROM board_meetings WHERE scheduled_at >= now() ORDER BY scheduled_at ASC`
  );
  return result.rows;
}

export async function listAllBoardMeetings() {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<BoardMeeting>(`SELECT * FROM board_meetings ORDER BY scheduled_at DESC`);
  return result.rows;
}

export async function createBoardMeeting(data: {
  title: string;
  scheduledAt: string;
  zoomUrl?: string;
  notes?: string;
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
  const result = await db.query<BoardMeeting>(
    `INSERT INTO board_meetings (title, scheduled_at, zoom_url, notes, created_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [data.title, data.scheduledAt, data.zoomUrl || null, data.notes || null, createdBy]
  );
  return result.rows[0] ?? null;
}

export async function deleteBoardMeeting(id: string) {
  const db = getDb();
  if (!db) return false;
  await db.query(`DELETE FROM board_meetings WHERE id = $1`, [id]);
  return true;
}
