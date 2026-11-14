import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { createBoardDocument, findBoardDocumentById, type DocumentCategory } from "@/lib/board-documents";

// Netlify Functions buffer request bodies at 6 MB, and binary uploads are
// base64-encoded in transit (~33% overhead) — keep a safe margin under that
// effective ~4.5 MB limit rather than let a large upload fail with an
// opaque platform error.
const MAX_FILE_BYTES = 4 * 1024 * 1024;

const CATEGORIES = [
  "corporate-record-book",
  "articles-of-incorporation",
  "bylaws",
  "ein-letter",
  "organizational-minutes",
  "board-resolution",
  "policy",
  "irs-determination-letter",
  "other",
] as const satisfies readonly DocumentCategory[];

const boolField = z
  .union([z.literal("true"), z.literal("false"), z.undefined(), z.null()])
  .transform((v) => v === "true");

const uploadFieldsSchema = z.object({
  category: z.enum(CATEGORIES),
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(2000).optional(),
  replaceId: z.string().uuid().optional(),
  effectiveDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date.")
    .optional()
    .or(z.literal("")),
  allowPrint: boolField,
  allowDownload: boolField,
  allowEmail: boolField,
});

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to manage corporate records." }, { status: 501 });
  }

  const session = await getCurrentAdminSession();
  if (!session || session.role !== "owner") {
    return NextResponse.json({ message: "Only the owner can upload corporate records." }, { status: 403 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ message: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ message: "Choose a file to upload." }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ message: "Only PDF files are accepted." }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { message: `That file is too large (max ${Math.floor(MAX_FILE_BYTES / (1024 * 1024))} MB). Try compressing the PDF.` },
      { status: 413 }
    );
  }

  const parsed = uploadFieldsSchema.safeParse({
    category: form.get("category"),
    title: form.get("title"),
    description: form.get("description") || undefined,
    replaceId: form.get("replaceId") || undefined,
    effectiveDate: form.get("effectiveDate") || undefined,
    allowPrint: form.get("allowPrint") || undefined,
    allowDownload: form.get("allowDownload") || undefined,
    allowEmail: form.get("allowEmail") || undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message || "Check the form and try again." }, { status: 400 });
  }

  if (parsed.data.replaceId) {
    const existing = await findBoardDocumentById(parsed.data.replaceId);
    if (!existing || !existing.is_current) {
      return NextResponse.json({ message: "The document being replaced couldn't be found." }, { status: 404 });
    }
  }

  const fileBytes = await file.arrayBuffer();
  const document = await createBoardDocument({
    category: parsed.data.category,
    title: parsed.data.title,
    description: parsed.data.description,
    fileName: file.name,
    contentType: file.type,
    fileBytes,
    uploadedBy: session.id,
    replaceId: parsed.data.replaceId,
    effectiveDate: parsed.data.effectiveDate || undefined,
    allowPrint: parsed.data.allowPrint,
    allowDownload: parsed.data.allowDownload,
    allowEmail: parsed.data.allowEmail,
  });

  if (!document) {
    return NextResponse.json({ message: "Could not save the document. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ message: "Document uploaded." });
}
