import { NextResponse } from "next/server";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { archiveBoardDocument, findBoardDocumentById } from "@/lib/board-documents";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to manage corporate records." }, { status: 501 });
  }

  const session = await getCurrentAdminSession();
  if (!session || session.role !== "owner") {
    return NextResponse.json({ message: "Only the owner can archive corporate records." }, { status: 403 });
  }

  const { id } = await params;
  const existing = await findBoardDocumentById(id);
  if (!existing) {
    return NextResponse.json({ message: "Document not found." }, { status: 404 });
  }

  await archiveBoardDocument(id);
  return NextResponse.json({ message: "Document archived." });
}
