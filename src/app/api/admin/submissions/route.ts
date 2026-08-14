import { NextResponse } from "next/server";
import { z } from "zod";
import { updateSubmissionStatus } from "@/lib/submissions";

const updateSchema = z.object({
  type: z.enum(["application", "volunteer", "sponsorship", "contact"]),
  id: z.string().uuid(),
  status: z.enum(["new", "reviewed", "archived"]),
});

// Auth is enforced by middleware.ts for all /api/admin/* routes.
export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const ok = await updateSubmissionStatus(parsed.data.type, parsed.data.id, parsed.data.status);
  if (!ok) {
    return NextResponse.json({ message: "Database not configured." }, { status: 501 });
  }

  return NextResponse.json({ message: "Updated." });
}
