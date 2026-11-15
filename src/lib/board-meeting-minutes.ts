import { getDb } from "@/lib/db";
import { createBoardDocument } from "@/lib/board-documents";
import { createVote, setVoteStatus } from "@/lib/board-votes";

export type MinutesStatus = "draft" | "submitted" | "approved" | "rejected";

export type BoardMeetingMinutes = {
  id: string;
  created_at: string;
  updated_at: string;
  meeting_id: string;
  drafted_by: string | null;
  content: string;
  status: MinutesStatus;
  vote_id: string | null;
  filed_document_id: string | null;
  submitted_at: string | null;
  decided_at: string | null;
  meeting_title: string;
  meeting_scheduled_at: string;
};

export type MinutesHistoryEntry = {
  id: string;
  created_at: string;
  actor_id: string | null;
  actor_name: string | null;
  action: string;
  note: string | null;
};

async function logHistory(minutesId: string, actorId: string | null, action: string, note?: string) {
  const db = getDb();
  if (!db) return;
  await db.query(
    `INSERT INTO board_meeting_minutes_history (minutes_id, actor_id, action, note) VALUES ($1, $2, $3, $4)`,
    [minutesId, actorId, action, note || null]
  );
}

export async function findMinutesForMeeting(meetingId: string) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query<BoardMeetingMinutes>(
    `SELECT mm.*, m.title AS meeting_title, m.scheduled_at AS meeting_scheduled_at
     FROM board_meeting_minutes mm
     JOIN board_meetings m ON m.id = mm.meeting_id
     WHERE mm.meeting_id = $1`,
    [meetingId]
  );
  return result.rows[0] ?? null;
}

export async function findMinutesByVoteId(voteId: string) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query<BoardMeetingMinutes>(
    `SELECT mm.*, m.title AS meeting_title, m.scheduled_at AS meeting_scheduled_at
     FROM board_meeting_minutes mm
     JOIN board_meetings m ON m.id = mm.meeting_id
     WHERE mm.vote_id = $1`,
    [voteId]
  );
  return result.rows[0] ?? null;
}

export async function getOrCreateDraft(meetingId: string, draftedBy: string) {
  const existing = await findMinutesForMeeting(meetingId);
  if (existing) return existing;

  const db = getDb();
  if (!db) return null;
  await db.query(
    `INSERT INTO board_meeting_minutes (meeting_id, drafted_by) VALUES ($1, $2) ON CONFLICT (meeting_id) DO NOTHING`,
    [meetingId, draftedBy]
  );
  const created = await findMinutesForMeeting(meetingId);
  if (created) await logHistory(created.id, draftedBy, "drafted");
  return created;
}

/** Content can only be changed while still a draft — once submitted, the
 * board is voting on a fixed version of record. */
export async function saveDraftContent(id: string, actorId: string, content: string) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query<{ id: string }>(
    `UPDATE board_meeting_minutes SET content = $1, updated_at = now() WHERE id = $2 AND status = 'draft' RETURNING id`,
    [content, id]
  );
  if (result.rows[0]) await logHistory(id, actorId, "edited");
  return result.rows[0] ?? null;
}

/** Submitting creates a real board_votes item (category 'resolutions') so
 * the board approves minutes through the same Voting & Approvals flow as
 * any other resolution, instead of a second, parallel approval system. */
export async function submitMinutesForApproval(minutes: BoardMeetingMinutes, actorId: string) {
  const db = getDb();
  if (!db) return null;

  const vote = await createVote({
    createdBy: actorId,
    category: "resolutions",
    title: `Approve Meeting Minutes — ${minutes.meeting_title}`,
    description: minutes.content.slice(0, 500),
  });
  if (!vote) return null;

  const result = await db.query<{ id: string }>(
    `UPDATE board_meeting_minutes
     SET status = 'submitted', vote_id = $1, submitted_at = now(), updated_at = now()
     WHERE id = $2
     RETURNING id`,
    [vote.id, minutes.id]
  );
  if (result.rows[0]) await logHistory(minutes.id, actorId, "submitted", `Linked to vote ${vote.id}`);
  return result.rows[0] ?? null;
}

/** Called directly (owner action on the minutes page) or via the cascade
 * from the linked board_votes item being decided on the Voting &
 * Approvals page — either path ends up here, the single place that
 * actually records the outcome and (on approval) auto-files the minutes. */
export async function recordMinutesDecision(
  minutes: BoardMeetingMinutes,
  decidedBy: string,
  decision: "approved" | "rejected"
) {
  const db = getDb();
  if (!db) return null;

  await db.query(
    `UPDATE board_meeting_minutes SET status = $1, decided_at = now(), updated_at = now() WHERE id = $2`,
    [decision, minutes.id]
  );
  await logHistory(minutes.id, decidedBy, decision);

  // Keep the linked vote in sync if this was decided from the minutes side.
  if (minutes.vote_id) {
    await setVoteStatus(minutes.vote_id, decision === "approved" ? "approved" : "declined", decidedBy);
  }

  if (decision === "approved") {
    const fileName = `meeting-minutes-${minutes.meeting_id}.txt`;
    const bytes = new TextEncoder().encode(minutes.content).buffer;
    const document = await createBoardDocument({
      category: "organizational-minutes",
      title: `Meeting Minutes — ${minutes.meeting_title}`,
      description: `Approved board meeting minutes for ${new Date(minutes.meeting_scheduled_at).toLocaleDateString()}.`,
      fileName,
      contentType: "text/plain",
      fileBytes: bytes,
      uploadedBy: decidedBy,
    });
    if (document) {
      await db.query(`UPDATE board_meeting_minutes SET filed_document_id = $1 WHERE id = $2`, [document.id, minutes.id]);
      await logHistory(minutes.id, decidedBy, "filed", `Filed as Corporate Records document ${document.id}`);
    }
  }

  return findMinutesForMeeting(minutes.meeting_id);
}

export async function listMinutesHistory(minutesId: string) {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<MinutesHistoryEntry>(
    `SELECT h.id, h.created_at, h.actor_id, u.name AS actor_name, h.action, h.note
     FROM board_meeting_minutes_history h
     LEFT JOIN admin_users u ON u.id = h.actor_id
     WHERE h.minutes_id = $1
     ORDER BY h.created_at ASC`,
    [minutesId]
  );
  return result.rows;
}
