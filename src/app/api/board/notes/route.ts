import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { createNote, listNotesForUser } from "@/lib/board-notes";

const createSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  body: z.string().trim().max(10000).optional().default(""),
  sharedWith: z.array(z.string().uuid()).optional(),
  meetingId: z.string().uuid().optional(),
});

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ notes: [] });
  }
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }
  const notes = await listNotesForUser(session.id);
  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to save notes." }, { status: 501 });
  }
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Enter a title for the note." }, { status: 400 });
  }

  const note = await createNote({
    adminUserId: session.id,
    title: parsed.data.title,
    body: parsed.data.body,
    sharedWith: parsed.data.sharedWith,
    meetingId: parsed.data.meetingId,
  });
  if (!note) {
    return NextResponse.json({ message: "Could not save the note. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ message: "Note saved." });
}
