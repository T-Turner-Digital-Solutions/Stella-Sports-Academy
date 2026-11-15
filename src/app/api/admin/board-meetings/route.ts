import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import {
  createBoardMeeting,
  deleteBoardMeeting,
  findBoardMeetingById,
  setBoardMeetingStatus,
  updateBoardMeeting,
} from "@/lib/board-meetings";
import {
  sendMeetingCancelledEmail,
  sendMeetingInviteEmail,
  sendMeetingUpdateEmail,
} from "@/lib/meeting-notifications";

const createSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  scheduledAt: z.string().trim().min(1, "Date and time are required"),
  zoomUrl: z.string().trim().url("Enter a valid link").optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional(),
  inviteeIds: z.array(z.string().uuid()).optional(),
});

const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(200).optional(),
  scheduledAt: z.string().trim().min(1).optional(),
  zoomUrl: z.string().trim().url("Enter a valid link").optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional(),
  inviteeIds: z.array(z.string().uuid()).optional(),
  status: z.enum(["scheduled", "live", "completed", "cancelled"]).optional(),
});

const deleteSchema = z.object({
  id: z.string().uuid(),
});

function arraysEqual(a: string[] | null, b: string[] | null) {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((v, i) => v === sortedB[i]);
}

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
    return NextResponse.json({ message: "Enter a title, date/time, and (if any) a valid link." }, { status: 400 });
  }

  const meeting = await createBoardMeeting({
    title: parsed.data.title,
    scheduledAt: parsed.data.scheduledAt,
    zoomUrl: parsed.data.zoomUrl,
    notes: parsed.data.notes,
    inviteeIds: parsed.data.inviteeIds,
    createdBy: session.id,
  });

  if (!meeting) {
    return NextResponse.json({ message: "Could not schedule the meeting. Please try again." }, { status: 500 });
  }

  const emailResult = await sendMeetingInviteEmail(meeting);
  return NextResponse.json({ message: "Meeting scheduled.", notified: emailResult });
}

export async function PATCH(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to manage board meetings." }, { status: 501 });
  }

  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const before = await findBoardMeetingById(parsed.data.id);
  if (!before) {
    return NextResponse.json({ message: "Meeting not found." }, { status: 404 });
  }

  // Status-only transitions (cancel / reopen / mark live / mark completed)
  // never touch the other fields, so they're handled separately from a
  // content edit below.
  if (parsed.data.status && parsed.data.status !== before.status) {
    const updated = await setBoardMeetingStatus(parsed.data.id, parsed.data.status);
    if (!updated) {
      return NextResponse.json({ message: "Could not update the meeting." }, { status: 500 });
    }
    let emailResult;
    if (parsed.data.status === "cancelled") {
      emailResult = await sendMeetingCancelledEmail(before);
    } else if (before.status === "cancelled") {
      emailResult = await sendMeetingUpdateEmail(updated, "this meeting has been reopened");
    }
    return NextResponse.json({ message: "Meeting status updated.", notified: emailResult });
  }

  const hasContentChange =
    parsed.data.title !== undefined ||
    parsed.data.scheduledAt !== undefined ||
    parsed.data.zoomUrl !== undefined ||
    parsed.data.notes !== undefined ||
    parsed.data.inviteeIds !== undefined;

  if (!hasContentChange) {
    return NextResponse.json({ message: "Nothing to update." }, { status: 400 });
  }

  const updated = await updateBoardMeeting(parsed.data.id, {
    title: parsed.data.title,
    scheduledAt: parsed.data.scheduledAt,
    zoomUrl: parsed.data.zoomUrl,
    notes: parsed.data.notes,
    inviteeIds: parsed.data.inviteeIds,
  });
  if (!updated) {
    return NextResponse.json({ message: "Could not update the meeting. Please try again." }, { status: 500 });
  }

  const changedParts: string[] = [];
  if (parsed.data.title !== undefined && parsed.data.title !== before.title) changedParts.push("the title");
  if (parsed.data.scheduledAt !== undefined && new Date(parsed.data.scheduledAt).getTime() !== new Date(before.scheduled_at).getTime())
    changedParts.push("the date/time");
  if (parsed.data.zoomUrl !== undefined && (parsed.data.zoomUrl || null) !== before.zoom_url) changedParts.push("the meeting link");
  if (parsed.data.notes !== undefined && (parsed.data.notes || null) !== before.notes) changedParts.push("the notes");
  if (parsed.data.inviteeIds !== undefined && !arraysEqual(updated.invitee_ids, before.invitee_ids))
    changedParts.push("who's invited");

  let emailResult;
  if (changedParts.length > 0) {
    emailResult = await sendMeetingUpdateEmail(updated, changedParts.join(", "));
  }

  return NextResponse.json({ message: "Meeting updated.", notified: emailResult });
}

export async function DELETE(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to manage board meetings." }, { status: 501 });
  }

  const session = await getCurrentAdminSession();
  if (!session || session.role !== "owner") {
    return NextResponse.json(
      { message: "Only owners can permanently delete a meeting — use Cancel to preserve it in history." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  await deleteBoardMeeting(parsed.data.id);
  return NextResponse.json({ message: "Meeting permanently deleted." });
}
