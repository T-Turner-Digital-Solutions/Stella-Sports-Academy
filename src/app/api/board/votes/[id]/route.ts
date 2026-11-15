import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { setVoteStatus } from "@/lib/board-votes";

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

  await setVoteStatus(id, parsed.data.status, session.id);
  return NextResponse.json({ message: "Status updated." });
}
