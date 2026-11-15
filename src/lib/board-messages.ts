import { getDb } from "@/lib/db";
import type { AdminRole } from "@/lib/admin-users-shared";

export type BoardMessage = {
  id: string;
  created_at: string;
  admin_user_id: string;
  body: string;
  author_name: string;
  author_role: AdminRole;
  author_title: string | null;
};

/** A single shared board channel (not private DMs) — every signed-in
 * board member/admin can read every message. */
export async function listRecentMessages(limit = 50) {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<BoardMessage>(
    `SELECT m.id, m.created_at, m.admin_user_id, m.body,
            u.name AS author_name, u.role AS author_role, u.title AS author_title
     FROM board_messages m
     JOIN admin_users u ON u.id = m.admin_user_id
     ORDER BY m.created_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}

export async function createMessage(adminUserId: string, body: string) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query<{ id: string }>(
    `INSERT INTO board_messages (admin_user_id, body) VALUES ($1, $2) RETURNING id`,
    [adminUserId, body]
  );
  return result.rows[0] ?? null;
}

/** Owners can remove any message; everyone else can only remove their own. */
export async function deleteMessage(id: string, requesterId: string, requesterIsOwner: boolean) {
  const db = getDb();
  if (!db) return false;
  if (requesterIsOwner) {
    await db.query(`DELETE FROM board_messages WHERE id = $1`, [id]);
  } else {
    await db.query(`DELETE FROM board_messages WHERE id = $1 AND admin_user_id = $2`, [id, requesterId]);
  }
  return true;
}
