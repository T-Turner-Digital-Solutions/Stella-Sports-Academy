import { NextResponse } from "next/server";
import { z } from "zod";
import { updateSubmissionStatus } from "@/lib/submissions";
import { getCurrentAdminSession } from "@/lib/auth";

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "reviewed", "archived"]),
});

// Unlike /api/admin/submissions (owner-only Website Administration), this
// route exists specifically so any signed-in board member — e.g. whoever is
// following up with corporate donors — can track inquiries from the Board
// Portal without needing owner access. Session presence alone is already
// enforced by proxy.ts for all /api/board/* routes.
export async function PATCH(request: Request) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const ok = await updateSubmissionStatus("sponsorship", parsed.data.id, parsed.data.status);
  if (!ok) {
    return NextResponse.json({ message: "Database not configured." }, { status: 501 });
  }

  return NextResponse.json({ message: "Updated." });
}
