import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { createBoardMeeting, deleteBoardMeeting } from "@/lib/board-meetings";

const createSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  scheduledAt: z.string().trim().min(1, "Date and time are required"),
  zoomUrl: z.string().trim().url("Enter a valid Zoom link"),
  notes: z.string().trim().max(2000).optional(),
});

const deleteSchema = z.object({
  id: z.string().uuid(),
});

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to schedule board meetings." }, { status: 501 });
  }

  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Enter a title, date/time, and a valid Zoom link." }, { status: 400 });
  }

  const meeting = await createBoardMeeting({
    title: parsed.data.title,
    scheduledAt: parsed.data.scheduledAt,
    zoomUrl: parsed.data.zoomUrl,
    notes: parsed.data.notes,
    createdBy: session.id,
  });

  if (!meeting) {
    return NextResponse.json({ message: "Could not schedule the meeting. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ message: "Meeting scheduled." });
}

export async function DELETE(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to manage board meetings." }, { status: 501 });
  }

  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  await deleteBoardMeeting(parsed.data.id);
  return NextResponse.json({ message: "Meeting removed." });
}
