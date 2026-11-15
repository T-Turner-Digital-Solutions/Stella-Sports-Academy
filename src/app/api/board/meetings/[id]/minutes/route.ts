import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { findBoardMeetingById } from "@/lib/board-meetings";
import {
  getOrCreateDraft,
  listMinutesHistory,
  recordMinutesDecision,
  saveDraftContent,
  submitMinutesForApproval,
} from "@/lib/board-meeting-minutes";

const patchSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("save"), content: z.string().max(50000) }),
  z.object({ action: z.literal("submit") }),
  z.object({ action: z.literal("decide"), decision: z.enum(["approved", "rejected"]) }),
]);

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to use meeting minutes." }, { status: 501 });
  }
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const meeting = await findBoardMeetingById(id);
  if (!meeting) {
    return NextResponse.json({ message: "Meeting not found." }, { status: 404 });
  }

  const minutes = await getOrCreateDraft(id, session.id);
  if (!minutes) {
    return NextResponse.json({ message: "Could not load minutes." }, { status: 500 });
  }
  const history = await listMinutesHistory(minutes.id);
  return NextResponse.json({ minutes, history });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to use meeting minutes." }, { status: 501 });
  }
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const minutes = await getOrCreateDraft(id, session.id);
  if (!minutes) {
    return NextResponse.json({ message: "Minutes not found." }, { status: 404 });
  }

  if (parsed.data.action === "save") {
    if (minutes.status !== "draft") {
      return NextResponse.json({ message: "These minutes have already been submitted and can no longer be edited." }, { status: 400 });
    }
    const saved = await saveDraftContent(minutes.id, session.id, parsed.data.content);
    if (!saved) return NextResponse.json({ message: "Could not save." }, { status: 500 });
    return NextResponse.json({ message: "Draft saved." });
  }

  if (parsed.data.action === "submit") {
    if (session.role !== "owner") {
      return NextResponse.json({ message: "Only an owner can submit minutes for board approval." }, { status: 403 });
    }
    if (minutes.status !== "draft") {
      return NextResponse.json({ message: "These minutes have already been submitted." }, { status: 400 });
    }
    const submitted = await submitMinutesForApproval(minutes, session.id);
    if (!submitted) return NextResponse.json({ message: "Could not submit for approval." }, { status: 500 });
    return NextResponse.json({ message: "Submitted for board approval." });
  }

  // decide
  if (session.role !== "owner") {
    return NextResponse.json({ message: "Only an owner can record the approval decision." }, { status: 403 });
  }
  if (minutes.status !== "submitted") {
    return NextResponse.json({ message: "These minutes haven't been submitted for approval yet." }, { status: 400 });
  }
  const decided = await recordMinutesDecision(minutes, session.id, parsed.data.decision);
  if (!decided) return NextResponse.json({ message: "Could not record the decision." }, { status: 500 });
  return NextResponse.json({ message: parsed.data.decision === "approved" ? "Approved and filed in Corporate Records." : "Marked as rejected." });
}
