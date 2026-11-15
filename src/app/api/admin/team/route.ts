import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { findAdminUserById, setAdminUserActive, updateAdminUserTitle } from "@/lib/admin-users";

const patchSchema = z.object({
  id: z.string().uuid(),
  active: z.boolean().optional(),
  title: z.string().trim().max(100).optional(),
});

export async function PATCH(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { message: "Set DATABASE_URL to manage board member accounts." },
      { status: 501 }
    );
  }

  const session = await getCurrentAdminSession();
  if (!session || session.role !== "owner") {
    return NextResponse.json({ message: "Only owners can manage board member accounts." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success || (parsed.data.active === undefined && parsed.data.title === undefined)) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  if (parsed.data.id === session.id && parsed.data.active === false) {
    return NextResponse.json({ message: "You can't deactivate your own account." }, { status: 400 });
  }

  const target = await findAdminUserById(parsed.data.id);
  if (!target) {
    return NextResponse.json({ message: "Board member not found." }, { status: 404 });
  }

  if (parsed.data.active !== undefined) {
    await setAdminUserActive(parsed.data.id, parsed.data.active);
  }
  if (parsed.data.title !== undefined) {
    await updateAdminUserTitle(parsed.data.id, parsed.data.title || null);
  }

  return NextResponse.json({ message: "Board member updated." });
}
