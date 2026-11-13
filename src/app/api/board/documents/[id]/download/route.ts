import { NextResponse } from "next/server";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { findBoardDocumentById, getBoardDocumentBytes } from "@/lib/board-documents";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to view corporate records." }, { status: 501 });
  }

  // Already enforced by src/proxy.ts (any signed-in board member or admin
  // account), re-checked here since this route streams private file
  // content and must never rely on the proxy alone.
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const document = await findBoardDocumentById(id);
  if (!document || document.archived) {
    return NextResponse.json({ message: "Document not found." }, { status: 404 });
  }

  const bytes = await getBoardDocumentBytes(document.blob_key);
  if (!bytes) {
    return NextResponse.json({ message: "Document file is missing." }, { status: 404 });
  }

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": document.content_type,
      "Content-Disposition": `inline; filename="${document.file_name.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
