import { getDb } from "@/lib/db";

export type SuggestionCategory = "fundraising" | "programs" | "facilities" | "events" | "partnerships" | "other";
export type SuggestionStatus = "submitted" | "under_review" | "approved" | "declined" | "in_progress" | "completed";

export type BoardSuggestion = {
  id: string;
  created_at: string;
  created_by: string | null;
  created_by_name: string | null;
  category: SuggestionCategory;
  title: string;
  description: string;
  status: SuggestionStatus;
  admin_response: string | null;
  responded_at: string | null;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function listBoardSuggestions(): Promise<BoardSuggestion[]> {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<BoardSuggestion>(
    `SELECT s.id, s.created_at, s.created_by, u.name AS created_by_name, s.category, s.title,
            s.description, s.status, s.admin_response, s.responded_at
     FROM board_suggestions s
     LEFT JOIN admin_users u ON u.id = s.created_by
     ORDER BY s.created_at DESC`
  );
  return result.rows;
}

export async function createBoardSuggestion(data: {
  createdBy: string;
  category: SuggestionCategory;
  title: string;
  description: string;
}) {
  const db = getDb();
  if (!db) return false;
  const createdBy = UUID_RE.test(data.createdBy) ? data.createdBy : null;
  await db.query(
    `INSERT INTO board_suggestions (created_by, category, title, description) VALUES ($1, $2, $3, $4)`,
    [createdBy, data.category, data.title, data.description]
  );
  return true;
}

export async function updateSuggestionStatus(data: {
  id: string;
  status: SuggestionStatus;
  adminResponse?: string;
  respondedBy: string;
}) {
  const db = getDb();
  if (!db) return false;
  const respondedBy = UUID_RE.test(data.respondedBy) ? data.respondedBy : null;
  await db.query(
    `UPDATE board_suggestions
     SET status = $1, admin_response = COALESCE($2, admin_response), responded_by = $3, responded_at = now()
     WHERE id = $4`,
    [data.status, data.adminResponse ?? null, respondedBy, data.id]
  );
  return true;
}
