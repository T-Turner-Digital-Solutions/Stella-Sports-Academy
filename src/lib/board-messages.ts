import { getDb } from "@/lib/db";
import type { AdminRole } from "@/lib/admin-users-shared";
import { isMigrationNotAppliedError, MigrationNotAppliedError } from "@/lib/migration-guard";

export type BoardMessage = {
  id: string;
  created_at: string;
  admin_user_id: string;
  body: string;
  recipient_ids: string[] | null;
  recipient_names: string[] | null;
  parent_message_id: string | null;
  author_name: string;
  author_role: AdminRole;
  author_title: string | null;
};


/** Every message a given member is allowed to see: every broadcast
 * (recipient_ids IS NULL) plus any private message where they're the
 * sender or a named recipient. This filter runs in SQL — never trust a
 * client to only ask for what it should see. */
export async function listMessagesForUser(userId: string, limit = 50) {
  const db = getDb();
  if (!db) return [];
  try {
    const result = await db.query<BoardMessage>(
      `SELECT m.id, m.created_at, m.admin_user_id, m.body, m.recipient_ids, m.parent_message_id,
              u.name AS author_name, u.role AS author_role, u.title AS author_title,
              (
                SELECT array_agg(ru.name ORDER BY ru.name)
                FROM admin_users ru
                WHERE ru.id = ANY(m.recipient_ids)
              ) AS recipient_names
       FROM board_messages m
       JOIN admin_users u ON u.id = m.admin_user_id
       WHERE m.recipient_ids IS NULL OR $1 = ANY(m.recipient_ids) OR m.admin_user_id = $1
       ORDER BY m.created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  } catch (error) {
    // Not returning [] here — an empty result would read as "no messages
    // exist," which is exactly the misleading state the board asked us not
    // to show. Callers must catch MigrationNotAppliedError and render an
    // honest notice instead.
    if (isMigrationNotAppliedError(error)) throw new MigrationNotAppliedError();
    throw error;
  }
}

/** recipientIds omitted/empty = broadcast to everyone, for a new top-level
 * message. A reply (parentMessageId set) always inherits the parent
 * thread's actual audience instead — any recipientIds passed alongside a
 * reply are ignored — and is refused outright if the replying account
 * can't currently see the parent message, so a private thread's audience
 * can never be widened or leaked by replying to it. */
export async function createMessage(
  adminUserId: string,
  body: string,
  recipientIds?: string[],
  parentMessageId?: string
) {
  const db = getDb();
  if (!db) return null;

  let recipients = recipientIds && recipientIds.length > 0 ? recipientIds : null;

  if (parentMessageId) {
    const parentResult = await db.query<{ recipient_ids: string[] | null }>(
      `SELECT recipient_ids FROM board_messages
       WHERE id = $1 AND (recipient_ids IS NULL OR $2 = ANY(recipient_ids) OR admin_user_id = $2)`,
      [parentMessageId, adminUserId]
    );
    const parent = parentResult.rows[0];
    if (!parent) return null;
    recipients = parent.recipient_ids;
  }

  const result = await db.query<{ id: string }>(
    `INSERT INTO board_messages (admin_user_id, body, recipient_ids, parent_message_id) VALUES ($1, $2, $3, $4) RETURNING id`,
    [adminUserId, body, recipients, parentMessageId || null]
  );
  return result.rows[0] ?? null;
}

/** Broadcast messages can be removed by their author or an owner
 * (moderation). Private messages can ONLY be removed by their author —
 * not even an owner — since they were never meant for the owner to see
 * or manage in the first place. */
export async function deleteMessage(id: string, requesterId: string, requesterIsOwner: boolean) {
  const db = getDb();
  if (!db) return false;
  if (requesterIsOwner) {
    await db.query(
      `DELETE FROM board_messages WHERE id = $1 AND (admin_user_id = $2 OR recipient_ids IS NULL)`,
      [id, requesterId]
    );
  } else {
    await db.query(`DELETE FROM board_messages WHERE id = $1 AND admin_user_id = $2`, [id, requesterId]);
  }
  return true;
}
