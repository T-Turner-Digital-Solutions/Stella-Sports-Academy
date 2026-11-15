import { getDb } from "@/lib/db";

export type BoardNote = {
  id: string;
  created_at: string;
  updated_at: string;
  admin_user_id: string;
  title: string;
  body: string;
  shared_with: string[] | null;
  meeting_id: string | null;
  author_name: string;
  meeting_title: string | null;
};

// Postgres "undefined_column" (42703) or "undefined_table" (42P01) — see
// the matching comment in @/lib/board-meetings for why this degrades
// instead of failing the page.
function isMigrationNotAppliedError(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("code" in error)) return false;
  return error.code === "42703" || error.code === "42P01";
}

/** Every note a given member may see: their own, plus any note someone
 * else shared with them by name. Enforced in SQL, not the UI — a note with
 * shared_with set is invisible to anyone not in that list and not its
 * author, owners included. */
export async function listNotesForUser(userId: string) {
  const db = getDb();
  if (!db) return [];
  try {
    const result = await db.query<BoardNote>(
      `SELECT n.*, u.name AS author_name, m.title AS meeting_title
       FROM board_notes n
       JOIN admin_users u ON u.id = n.admin_user_id
       LEFT JOIN board_meetings m ON m.id = n.meeting_id
       WHERE n.admin_user_id = $1 OR $1 = ANY(n.shared_with)
       ORDER BY n.updated_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    if (!isMigrationNotAppliedError(error)) throw error;
    console.error("[board-notes] Migration not applied yet — returning no notes instead of failing the page.");
    return [];
  }
}

export async function findNoteById(id: string) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query<BoardNote & { admin_user_id: string }>(
    `SELECT n.*, u.name AS author_name, m.title AS meeting_title
     FROM board_notes n
     JOIN admin_users u ON u.id = n.admin_user_id
     LEFT JOIN board_meetings m ON m.id = n.meeting_id
     WHERE n.id = $1`,
    [id]
  );
  return result.rows[0] ?? null;
}

export async function createNote(data: {
  adminUserId: string;
  title: string;
  body: string;
  sharedWith?: string[];
  meetingId?: string | null;
}) {
  const db = getDb();
  if (!db) return null;
  const sharedWith = data.sharedWith && data.sharedWith.length > 0 ? data.sharedWith : null;
  const result = await db.query<{ id: string }>(
    `INSERT INTO board_notes (admin_user_id, title, body, shared_with, meeting_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [data.adminUserId, data.title, data.body, sharedWith, data.meetingId || null]
  );
  return result.rows[0] ?? null;
}

/** Only the author can update or delete their own note — sharing grants
 * read access, never write access. Both checks happen here, not just in
 * the API route, as the actual enforcement point. */
export async function updateNote(
  id: string,
  requesterId: string,
  data: { title?: string; body?: string; sharedWith?: string[] | null; meetingId?: string | null }
) {
  const db = getDb();
  if (!db) return null;
  const sharedWith = data.sharedWith && data.sharedWith.length > 0 ? data.sharedWith : null;
  const result = await db.query<{ id: string }>(
    `UPDATE board_notes
     SET title = COALESCE($3, title),
         body = COALESCE($4, body),
         shared_with = CASE WHEN $5::boolean THEN $6 ELSE shared_with END,
         meeting_id = CASE WHEN $7::boolean THEN $8 ELSE meeting_id END,
         updated_at = now()
     WHERE id = $1 AND admin_user_id = $2
     RETURNING id`,
    [
      id,
      requesterId,
      data.title ?? null,
      data.body ?? null,
      data.sharedWith !== undefined,
      sharedWith,
      data.meetingId !== undefined,
      data.meetingId || null,
    ]
  );
  return result.rows[0] ?? null;
}

export async function deleteNote(id: string, requesterId: string) {
  const db = getDb();
  if (!db) return false;
  const result = await db.query(`DELETE FROM board_notes WHERE id = $1 AND admin_user_id = $2`, [id, requesterId]);
  return (result.rowCount ?? 0) > 0;
}
