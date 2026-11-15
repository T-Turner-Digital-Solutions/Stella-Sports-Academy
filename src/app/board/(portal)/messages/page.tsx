import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { MessageBoard } from "@/components/board/MessageBoard";
import { isDatabaseConfigured } from "@/lib/db";
import { getCurrentAdminSession } from "@/lib/auth";
import { listRecentMessages } from "@/lib/board-messages";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Messages" };

export default async function BoardMessagesPage() {
  const dbReady = isDatabaseConfigured();
  const session = await getCurrentAdminSession();
  const messages = dbReady ? await listRecentMessages() : [];

  return (
    <Container>
      <PortalPageHero
        title="Messages"
        description="A shared space for the board to post quick updates — visible to every signed-in board member."
      />
      <div className="mt-6">
        <MessageBoard messages={messages} currentUserId={session?.id ?? ""} isOwner={session?.role === "owner"} />
      </div>
    </Container>
  );
}
