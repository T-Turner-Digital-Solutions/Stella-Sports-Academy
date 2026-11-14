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
  effective_date: string;
  allow_print: boolean;
  allow_download: boolean;
  allow_email: boolean;
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

/** The six top-level groups the Corporate Records library is organized
 * into, per the board's requested layout — a display-only grouping over
 * the finer DocumentCategory values above, not a separate schema concept. */
export type RecordGroup =
  | "corporate-record-book"
  | "formation"
  | "governance"
  | "resolutions"
  | "compliance"
  | "other";

export const RECORD_GROUP_LABELS: Record<RecordGroup, string> = {
  "corporate-record-book": "Corporate Record Book",
  formation: "Formation Documents",
  governance: "Bylaws & Governance Policies",
  resolutions: "Board Resolutions",
  compliance: "Compliance Filings",
  other: "Other Official Corporate Records",
};

export const RECORD_GROUP_DESCRIPTIONS: Record<RecordGroup, string> = {
  "corporate-record-book": "The complete, featured record book",
  formation: "Articles, Incorporation, EIN",
  governance: "Bylaws, Policies, Procedures",
  resolutions: "Board actions and approvals",
  compliance: "IRS, annual reports, state filings (e.g. Form 990)",
  other: "Minutes, contracts, agreements, and other official records",
};

export function categoryToGroup(category: DocumentCategory): RecordGroup {
  switch (category) {
    case "corporate-record-book":
      return "corporate-record-book";
    case "articles-of-incorporation":
    case "ein-letter":
      return "formation";
    case "bylaws":
    case "policy":
      return "governance";
    case "board-resolution":
      return "resolutions";
    case "irs-determination-letter":
      return "compliance";
    case "organizational-minutes":
    case "other":
      return "other";
  }
}
