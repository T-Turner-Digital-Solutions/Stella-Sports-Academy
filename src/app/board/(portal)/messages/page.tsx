import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { MessageBoard } from "@/components/board/MessageBoard";
import { MigrationPendingNotice } from "@/components/board/MigrationPendingNotice";
import { isDatabaseConfigured } from "@/lib/db";
import { getCurrentAdminSession } from "@/lib/auth";
import { listMessagesForUser, type BoardMessage } from "@/lib/board-messages";
import { listAdminUsers } from "@/lib/admin-users";
import { MigrationNotAppliedError } from "@/lib/migration-guard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Messages" };

export default async function BoardMessagesPage() {
  const dbReady = isDatabaseConfigured();
  const session = await getCurrentAdminSession();
  let messages: BoardMessage[] = [];
  let unavailable = false;
  if (dbReady && session) {
    try {
      messages = await listMessagesForUser(session.id);
    } catch (error) {
      if (!(error instanceof MigrationNotAppliedError)) throw error;
      unavailable = true;
    }
  }
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
        {unavailable ? (
          <MigrationPendingNotice feature="Messages" />
        ) : (
          <MessageBoard
            messages={messages}
            members={otherMembers}
            currentUserId={session?.id ?? ""}
            isOwner={session?.role === "owner"}
          />
        )}
      </div>
    </Container>
  );
}
