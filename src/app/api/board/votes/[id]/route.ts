import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { setVoteStatus } from "@/lib/board-votes";
import { findMinutesByVoteId, recordMinutesDecision } from "@/lib/board-meeting-minutes";
import { MigrationNotAppliedError } from "@/lib/migration-guard";

const statusSchema = z.object({
  status: z.enum(["pending", "approved", "declined", "withdrawn"]),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to manage votes." }, { status: 501 });
  }
  const session = await getCurrentAdminSession();
  if (!session || session.role !== "owner") {
    return NextResponse.json({ message: "Only owners can record the final outcome." }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid status." }, { status: 400 });
  }

  // If this vote is actually a meeting-minutes approval, deciding it here
  // also records the decision on the minutes record and (on approval)
  // auto-files it into Corporate Records — one decision, not two things to
  // remember to update.
  if (parsed.data.status === "approved" || parsed.data.status === "declined") {
    let minutes = null;
    try {
      minutes = await findMinutesByVoteId(id);
    } catch (error) {
      // The meeting-minutes table doesn't exist yet on this database —
      // this vote still isn't a minutes approval as far as we can tell, so
      // fall through to the plain vote-status update below rather than
      // blocking an unrelated decision on a pending migration.
      if (!(error instanceof MigrationNotAppliedError)) throw error;
    }
    if (minutes) {
      await recordMinutesDecision(minutes, session.id, parsed.data.status === "approved" ? "approved" : "rejected");
      return NextResponse.json({ message: "Status updated and minutes filed." });
    }
  }

  await setVoteStatus(id, parsed.data.status, session.id);
  return NextResponse.json({ message: "Status updated." });
}
