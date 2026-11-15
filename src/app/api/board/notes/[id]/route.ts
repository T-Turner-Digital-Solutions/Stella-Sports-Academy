import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { deleteNote, updateNote } from "@/lib/board-notes";

const updateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  body: z.string().trim().max(10000).optional(),
  sharedWith: z.array(z.string().uuid()).optional(),
  meetingId: z.string().uuid().nullable().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to manage notes." }, { status: 501 });
  }
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const updated = await updateNote(id, session.id, parsed.data);
  if (!updated) {
    return NextResponse.json({ message: "Note not found, or it isn't yours to edit." }, { status: 404 });
  }
  return NextResponse.json({ message: "Note updated." });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to manage notes." }, { status: 501 });
  }
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const removed = await deleteNote(id, session.id);
  if (!removed) {
    return NextResponse.json({ message: "Note not found, or it isn't yours to delete." }, { status: 404 });
  }
  return NextResponse.json({ message: "Note deleted." });
}
