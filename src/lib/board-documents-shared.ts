// Types and constants shared between server code (src/lib/board-documents.ts)
// and client components. Kept dependency-free — no @/lib/db import — so
// client components can pull in DOCUMENT_CATEGORY_LABELS without also
// bundling `pg` (see the identical concern documented in src/lib/session.ts
// for why proxy.ts stays off @/lib/db).
export type DocumentCategory =
  | "corporate-record-book"
  | "articles-of-incorporation"
  | "bylaws"
  | "ein-letter"
  | "organizational-minutes"
  | "board-resolution"
  | "policy"
  | "irs-determination-letter"
  | "other";

export type BoardDocument = {
  id: string;
  created_at: string;
  uploaded_by: string | null;
  category: DocumentCategory;
  title: string;
  description: string | null;
  blob_key: string;
  file_name: string;
  content_type: string;
  file_size_bytes: number;
  version: number;
  is_current: boolean;
  archived: boolean;
};

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  "corporate-record-book": "Corporate Record Book",
  "articles-of-incorporation": "Articles of Incorporation",
  bylaws: "Bylaws",
  "ein-letter": "EIN Letter",
  "organizational-minutes": "Organizational Minutes",
  "board-resolution": "Board Resolution",
  policy: "Policy",
  "irs-determination-letter": "IRS Determination Letter",
  other: "Other",
};
