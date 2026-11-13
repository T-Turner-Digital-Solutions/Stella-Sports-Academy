import { NextResponse } from "next/server";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { acknowledgeBoardDocument, findBoardDocumentById } from "@/lib/board-documents";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to acknowledge corporate records." }, { status: 501 });
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

  const ok = await acknowledgeBoardDocument(id, session.id);
  if (!ok) {
    return NextResponse.json(
      { message: "Your session is out of date. Please log out and log back in, then try again." },
      { status: 401 }
    );
  }
  return NextResponse.json({ message: "Acknowledged." });
}
