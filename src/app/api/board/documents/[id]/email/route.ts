import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { findBoardDocumentById, getBoardDocumentBytes, logDocumentEmail } from "@/lib/board-documents";
import { findAdminUserByEmail } from "@/lib/admin-users";
import { sendConfirmationEmail, escapeHtml } from "@/lib/email";
import { site } from "@/content/site";

const emailSchema = z.object({
  recipientEmail: z.string().trim().email("Enter a valid email address."),
  message: z.string().trim().max(1000).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to email corporate records." }, { status: 501 });
  }

  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const document = await findBoardDocumentById(id);
  if (!document || document.archived) {
    return NextResponse.json({ message: "Document not found." }, { status: 404 });
  }
  if (!document.allow_email) {
    return NextResponse.json({ message: "Emailing this document has been disabled by an administrator." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = emailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message || "Enter a valid email address." }, { status: 400 });
  }

  // Never email a record to an outside address — the recipient must be an
  // active, authorized board member/admin account.
  const recipient = await findAdminUserByEmail(parsed.data.recipientEmail);
  if (!recipient || !recipient.active) {
    return NextResponse.json(
      { message: "Documents can only be emailed to an active board member or administrator account." },
      { status: 403 }
    );
  }

  const bytes = await getBoardDocumentBytes(document.blob_key);
  if (!bytes) {
    return NextResponse.json({ message: "Document file is missing." }, { status: 404 });
  }

  const senderName = session.name || "A board member";
  await sendConfirmationEmail(
    recipient.email,
    `${site.name} — ${document.title}`,
    `<p>${escapeHtml(senderName)} shared a document from the Stellar Sports Academy Board Portal with you.</p>
     <p><strong>${escapeHtml(document.title)}</strong></p>
     ${parsed.data.message ? `<p>${escapeHtml(parsed.data.message)}</p>` : ""}
     <p>The file is attached. You can also view it in the portal at
     <a href="${site.url}/board/documents/${document.id}">${site.url}/board/documents/${document.id}</a>.</p>`,
    [{ filename: document.file_name, content: Buffer.from(bytes) }]
  );

  await logDocumentEmail({
    documentId: document.id,
    sentBy: session.id,
    recipientEmail: recipient.email,
    message: parsed.data.message,
  });

  return NextResponse.json({ message: `Emailed to ${recipient.email}.` });
}
