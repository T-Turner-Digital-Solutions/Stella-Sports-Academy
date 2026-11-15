import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { castVoteResponse } from "@/lib/board-votes";

const respondSchema = z.object({
  response: z.enum(["approve", "decline", "abstain"]),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to cast a vote." }, { status: 501 });
  }
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = respondSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid response." }, { status: 400 });
  }

  await castVoteResponse(id, session.id, parsed.data.response);
  return NextResponse.json({ message: "Your response was recorded." });
}
