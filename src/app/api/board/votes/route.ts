import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { createVote } from "@/lib/board-votes";

const createSchema = z.object({
  category: z.enum(["resolutions", "policies", "contracts", "other"]),
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(2000).optional(),
  dueDate: z.string().trim().optional(),
});

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to create votes." }, { status: 501 });
  }
  const session = await getCurrentAdminSession();
  if (!session || session.role !== "owner") {
    return NextResponse.json({ message: "Only owners can create a vote or approval." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Enter a title and category." }, { status: 400 });
  }

  const vote = await createVote({
    createdBy: session.id,
    category: parsed.data.category,
    title: parsed.data.title,
    description: parsed.data.description,
    dueDate: parsed.data.dueDate,
  });
  if (!vote) {
    return NextResponse.json({ message: "Could not create it. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ message: "Vote created." });
}
