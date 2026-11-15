import { getDb } from "@/lib/db";
import { isMigrationNotAppliedError } from "@/lib/migration-guard";

export type VoteCategory = "resolutions" | "policies" | "contracts" | "other";
export type VoteStatus = "pending" | "approved" | "declined" | "withdrawn";
export type VoteResponseValue = "approve" | "decline" | "abstain";

export type BoardVote = {
  id: string;
  created_at: string;
  created_by: string | null;
  creator_name: string | null;
  category: VoteCategory;
  title: string;
  description: string | null;
  due_date: string | null;
  status: VoteStatus;
  decided_by: string | null;
  decided_at: string | null;
};

export type BoardVoteResponse = {
  id: string;
  vote_id: string;
  admin_user_id: string;
  voter_name: string;
  response: VoteResponseValue;
  responded_at: string;
};

export async function listAllVotes() {
  const db = getDb();
  if (!db) return [];
  try {
    const result = await db.query<BoardVote>(
      `SELECT v.*, u.name AS creator_name
       FROM board_votes v
       LEFT JOIN admin_users u ON u.id = v.created_by
       ORDER BY v.created_at DESC`
    );
    return result.rows;
  } catch (error) {
    if (!isMigrationNotAppliedError(error)) throw error;
    console.error("[board-votes] Migration not applied yet — returning no votes instead of failing the page.");
    return [];
  }
}

export async function listResponsesForVotes(voteIds: string[]) {
  const db = getDb();
  if (!db || voteIds.length === 0) return [];
  try {
    return await listResponsesForVotesQuery(db, voteIds);
  } catch (error) {
    if (!isMigrationNotAppliedError(error)) throw error;
    console.error("[board-votes] Migration not applied yet — returning no responses instead of failing the page.");
    return [];
  }
}

async function listResponsesForVotesQuery(db: NonNullable<ReturnType<typeof getDb>>, voteIds: string[]) {
  const result = await db.query<BoardVoteResponse>(
    `SELECT r.*, u.name AS voter_name
     FROM board_vote_responses r
     JOIN admin_users u ON u.id = r.admin_user_id
     WHERE r.vote_id = ANY($1::uuid[])`,
    [voteIds]
  );
  return result.rows;
}

export async function createVote(data: {
  createdBy: string;
  category: VoteCategory;
  title: string;
  description?: string;
  dueDate?: string;
}) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query<{ id: string }>(
    `INSERT INTO board_votes (created_by, category, title, description, due_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [data.createdBy, data.category, data.title, data.description || null, data.dueDate || null]
  );
  return result.rows[0] ?? null;
}

export async function castVoteResponse(voteId: string, adminUserId: string, response: VoteResponseValue) {
  const db = getDb();
  if (!db) return false;
  await db.query(
    `INSERT INTO board_vote_responses (vote_id, admin_user_id, response)
     VALUES ($1, $2, $3)
     ON CONFLICT (vote_id, admin_user_id) DO UPDATE SET response = $3, responded_at = now()`,
    [voteId, adminUserId, response]
  );
  return true;
}

/** Owner-only — manually records the final outcome. Deliberately not
 * auto-computed from response tallies; see the schema comment for why. */
export async function setVoteStatus(voteId: string, status: VoteStatus, decidedBy: string) {
  const db = getDb();
  if (!db) return false;
  if (status === "pending") {
    await db.query(`UPDATE board_votes SET status = $1, decided_by = NULL, decided_at = NULL WHERE id = $2`, [
      status,
      voteId,
    ]);
  } else {
    await db.query(`UPDATE board_votes SET status = $1, decided_by = $2, decided_at = now() WHERE id = $3`, [
      status,
      decidedBy,
      voteId,
    ]);
  }
  return true;
}
