import { getStore } from "@netlify/blobs";
import { getDb } from "@/lib/db";
import type { DocumentCategory, BoardDocument } from "@/lib/board-documents-shared";

export type { DocumentCategory, BoardDocument } from "@/lib/board-documents-shared";

function documentsStore() {
  return getStore("board-documents");
}

export async function listCurrentBoardDocuments() {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<BoardDocument>(
    `SELECT * FROM board_documents WHERE is_current = true AND archived = false ORDER BY title ASC`
  );
  return result.rows;
}

export async function listAllBoardDocuments() {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<BoardDocument>(
    `SELECT * FROM board_documents ORDER BY title ASC, version DESC`
  );
  return result.rows;
}

export async function findBoardDocumentById(id: string) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query<BoardDocument>(`SELECT * FROM board_documents WHERE id = $1`, [id]);
  return result.rows[0] ?? null;
}

/** Uploads a new document, or a new version of one if `replaceId` points at
 * an existing current document — the prior version is marked is_current =
 * false (not deleted) so document version history is kept. */
export async function createBoardDocument(data: {
  category: DocumentCategory;
  title: string;
  description?: string;
  fileName: string;
  contentType: string;
  fileBytes: ArrayBuffer;
  uploadedBy: string;
  replaceId?: string;
  effectiveDate?: string;
  allowPrint?: boolean;
  allowDownload?: boolean;
  allowEmail?: boolean;
}) {
  const db = getDb();
  if (!db) return null;

  let version = 1;
  if (data.replaceId) {
    const previous = await findBoardDocumentById(data.replaceId);
    if (previous) {
      version = previous.version + 1;
      await db.query(`UPDATE board_documents SET is_current = false WHERE id = $1`, [previous.id]);
    }
  }

  const blobKey = crypto.randomUUID();
  await documentsStore().set(blobKey, data.fileBytes, {
    metadata: { fileName: data.fileName, contentType: data.contentType },
  });

  const uploadedBy = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.uploadedBy)
    ? data.uploadedBy
    : null;

  const result = await db.query<BoardDocument>(
    `INSERT INTO board_documents
       (category, title, description, blob_key, file_name, content_type, file_size_bytes, version, uploaded_by,
        effective_date, allow_print, allow_download, allow_email)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10, CURRENT_DATE), $11, $12, $13)
     RETURNING *`,
    [
      data.category,
      data.title,
      data.description || null,
      blobKey,
      data.fileName,
      data.contentType,
      data.fileBytes.byteLength,
      version,
      uploadedBy,
      data.effectiveDate || null,
      data.allowPrint ?? true,
      data.allowDownload ?? true,
      data.allowEmail ?? true,
    ]
  );
  return result.rows[0] ?? null;
}

export async function updateDocumentPermissions(
  id: string,
  permissions: { allowPrint: boolean; allowDownload: boolean; allowEmail: boolean }
) {
  const db = getDb();
  if (!db) return false;
  await db.query(
    `UPDATE board_documents SET allow_print = $1, allow_download = $2, allow_email = $3 WHERE id = $4`,
    [permissions.allowPrint, permissions.allowDownload, permissions.allowEmail, id]
  );
  return true;
}

export async function getBoardDocumentBytes(blobKey: string) {
  return documentsStore().get(blobKey, { type: "arrayBuffer" });
}

export async function archiveBoardDocument(id: string) {
  const db = getDb();
  if (!db) return false;
  await db.query(`UPDATE board_documents SET archived = true, is_current = false WHERE id = $1`, [id]);
  return true;
}

export async function acknowledgeBoardDocument(documentId: string, adminUserId: string) {
  const db = getDb();
  if (!db) return false;
  try {
    await db.query(
      `INSERT INTO board_document_acknowledgments (document_id, admin_user_id)
       VALUES ($1, $2)
       ON CONFLICT (document_id, admin_user_id) DO NOTHING`,
      [documentId, adminUserId]
    );
    return true;
  } catch {
    // adminUserId isn't a valid UUID (e.g. a stale pre-database session) —
    // see the matching comment on findAdminUserById in @/lib/admin-users.
    return false;
  }
}

/** Document ids the given member HAS already acknowledged — used by the
 * board documents view to show acknowledged/unacknowledged status. */
export async function listAcknowledgedDocumentIds(adminUserId: string) {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<{ document_id: string }>(
    `SELECT document_id FROM board_document_acknowledgments WHERE admin_user_id = $1`,
    [adminUserId]
  );
  return result.rows.map((r) => r.document_id);
}

export async function listAcknowledgmentsForDocument(documentId: string) {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<{ admin_user_id: string; acknowledged_at: string }>(
    `SELECT admin_user_id, acknowledged_at FROM board_document_acknowledgments WHERE document_id = $1`,
    [documentId]
  );
  return result.rows;
}

/** Admin-facing acknowledgment tracking: who has acknowledged this document
 * (by name) and when. */
export async function listAcknowledgmentsWithNames(documentId: string) {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<{ name: string; email: string; acknowledged_at: string }>(
    `SELECT u.name, u.email, a.acknowledged_at
     FROM board_document_acknowledgments a
     JOIN admin_users u ON u.id = a.admin_user_id
     WHERE a.document_id = $1
     ORDER BY a.acknowledged_at ASC`,
    [documentId]
  );
  return result.rows;
}

export async function logDocumentEmail(data: {
  documentId: string;
  sentBy: string;
  recipientEmail: string;
  message?: string;
}) {
  const db = getDb();
  if (!db) return false;
  const sentBy = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.sentBy) ? data.sentBy : null;
  await db.query(
    `INSERT INTO board_document_email_log (document_id, sent_by, recipient_email, message)
     VALUES ($1, $2, $3, $4)`,
    [data.documentId, sentBy, data.recipientEmail, data.message || null]
  );
  return true;
}

/** Document ids the given member has NOT yet acknowledged, among current,
 * non-archived documents — used for the Dashboard's pending-acknowledgment
 * count. */
export async function listUnacknowledgedDocumentIds(adminUserId: string) {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<{ id: string }>(
    `SELECT d.id FROM board_documents d
     WHERE d.is_current = true AND d.archived = false
       AND NOT EXISTS (
         SELECT 1 FROM board_document_acknowledgments a
         WHERE a.document_id = d.id AND a.admin_user_id = $1
       )`,
    [adminUserId]
  );
  return result.rows.map((r) => r.id);
}
