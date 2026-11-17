import { NextResponse } from "next/server";
import { z } from "zod";
import { markContactSubmissionLegitimate } from "@/lib/submissions";
import { getCurrentAdminSession } from "@/lib/auth";

const updateSchema = z.object({ id: z.string().uuid() });

// Session presence alone is enforced by proxy.ts for all /api/admin/* routes
// — the quarantine review area is owner-only, same as /api/admin/submissions.
export async function PATCH(request: Request) {
  const session = await getCurrentAdminSession();
  if (!session || session.role !== "owner") {
    return NextResponse.json({ message: "Not authorized." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const ok = await markContactSubmissionLegitimate(parsed.data.id);
  if (!ok) {
    return NextResponse.json({ message: "Database not configured." }, { status: 501 });
  }

  return NextResponse.json({ message: "Marked as legitimate." });
}
