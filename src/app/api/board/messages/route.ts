import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { createMessage, deleteMessage, listRecentMessages } from "@/lib/board-messages";

const createSchema = z.object({
  body: z.string().trim().min(1, "Write a message first.").max(2000),
});

const deleteSchema = z.object({
  id: z.string().uuid(),
});

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ messages: [] });
  }
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }
  const messages = await listRecentMessages();
  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to post messages." }, { status: 501 });
  }
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Write a message first." }, { status: 400 });
  }

  const message = await createMessage(session.id, parsed.data.body);
  if (!message) {
    return NextResponse.json({ message: "Could not post the message. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ message: "Message posted." });
}

export async function DELETE(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to manage messages." }, { status: 501 });
  }
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  await deleteMessage(parsed.data.id, session.id, session.role === "owner");
  return NextResponse.json({ message: "Message removed." });
}
