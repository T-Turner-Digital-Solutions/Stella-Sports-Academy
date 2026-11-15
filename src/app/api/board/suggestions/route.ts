import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { createBoardSuggestion } from "@/lib/board-suggestions";

const CATEGORIES = ["fundraising", "programs", "facilities", "events", "partnerships", "other"] as const;

const submitSchema = z.object({
  category: z.enum(CATEGORIES),
  title: z.string().trim().min(3, "Enter a short title.").max(200),
  description: z.string().trim().min(10, "Say a bit more about the idea.").max(4000),
});

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to submit suggestions." }, { status: 501 });
  }

  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message || "Check your suggestion and try again." }, { status: 400 });
  }

  const ok = await createBoardSuggestion({
    createdBy: session.id,
    category: parsed.data.category,
    title: parsed.data.title,
    description: parsed.data.description,
  });

  if (!ok) {
    return NextResponse.json({ message: "Could not submit your suggestion. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ message: "Suggestion submitted." });
}
