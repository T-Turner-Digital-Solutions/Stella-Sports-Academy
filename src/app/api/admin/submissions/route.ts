import { NextResponse } from "next/server";
import { z } from "zod";
import { updateSubmissionStatus } from "@/lib/submissions";
import { getCurrentAdminSession } from "@/lib/auth";

const updateSchema = z.object({
  type: z.enum(["application", "volunteer", "sponsorship", "contact"]),
  id: z.string().uuid(),
  status: z.enum(["new", "reviewed", "archived"]),
});

// Session presence alone is enforced by proxy.ts for all /api/admin/* routes
// — Website Administration itself is owner-only, so this re-checks role too,
// the same way /api/admin/documents and /api/admin/financial-goals already do.
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

  const ok = await updateSubmissionStatus(parsed.data.type, parsed.data.id, parsed.data.status);
  if (!ok) {
    return NextResponse.json({ message: "Database not configured." }, { status: 501 });
  }

  return NextResponse.json({ message: "Updated." });
}
