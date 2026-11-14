import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { archiveBoardDocument, findBoardDocumentById, updateDocumentPermissions } from "@/lib/board-documents";

const permissionsSchema = z.object({
  allowPrint: z.boolean(),
  allowDownload: z.boolean(),
  allowEmail: z.boolean(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to manage corporate records." }, { status: 501 });
  }

  const session = await getCurrentAdminSession();
  if (!session || session.role !== "owner") {
    return NextResponse.json({ message: "Only the owner can change document permissions." }, { status: 403 });
  }

  const { id } = await params;
  const existing = await findBoardDocumentById(id);
  if (!existing) {
    return NextResponse.json({ message: "Document not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = permissionsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  await updateDocumentPermissions(id, parsed.data);
  return NextResponse.json({ message: "Permissions updated." });
}

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
