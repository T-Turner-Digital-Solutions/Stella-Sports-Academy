import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { updateSuggestionStatus } from "@/lib/board-suggestions";

const STATUSES = ["submitted", "under_review", "approved", "declined", "in_progress", "completed"] as const;

const patchSchema = z.object({
  status: z.enum(STATUSES),
  adminResponse: z.string().trim().max(4000).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to manage suggestions." }, { status: 501 });
  }

  const session = await getCurrentAdminSession();
  if (!session || session.role !== "owner") {
    return NextResponse.json({ message: "Only the owner can review suggestions." }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message || "Invalid status." }, { status: 400 });
  }

  const ok = await updateSuggestionStatus({
    id,
    status: parsed.data.status,
    adminResponse: parsed.data.adminResponse,
    respondedBy: session.id,
  });

  if (!ok) {
    return NextResponse.json({ message: "Could not update the suggestion. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ message: "Suggestion updated." });
}
