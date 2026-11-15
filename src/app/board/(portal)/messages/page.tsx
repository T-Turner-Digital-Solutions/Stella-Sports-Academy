import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { MessageBoard } from "@/components/board/MessageBoard";
import { isDatabaseConfigured } from "@/lib/db";
import { getCurrentAdminSession } from "@/lib/auth";
import { listMessagesForUser } from "@/lib/board-messages";
import { listAdminUsers } from "@/lib/admin-users";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Messages" };

export default async function BoardMessagesPage() {
  const dbReady = isDatabaseConfigured();
  const session = await getCurrentAdminSession();
  const messages = dbReady && session ? await listMessagesForUser(session.id) : [];
  const allMembers = dbReady ? await listAdminUsers() : [];
  const otherMembers = allMembers
    .filter((m) => m.active && m.id !== session?.id)
    .map((m) => ({ id: m.id, name: m.name }));

  return (
    <Container>
      <PortalPageHero
        title="Messages"
        description="Post to the entire board, or send to just the people you pick — private messages are never visible to anyone else, including the administrator."
      />
      <div className="mt-6">
        <MessageBoard
          messages={messages}
          members={otherMembers}
          currentUserId={session?.id ?? ""}
          isOwner={session?.role === "owner"}
        />
      </div>
    </Container>
  );
}
