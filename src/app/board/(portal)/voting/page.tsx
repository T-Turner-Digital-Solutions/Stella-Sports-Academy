import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { VotingBoard } from "@/components/board/VotingBoard";
import { isDatabaseConfigured } from "@/lib/db";
import { getCurrentAdminSession } from "@/lib/auth";
import { listAllVotes, listResponsesForVotes, type BoardVoteResponse } from "@/lib/board-votes";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Voting & Approvals" };

export default async function BoardVotingPage() {
  const dbReady = isDatabaseConfigured();
  const session = await getCurrentAdminSession();
  const votes = dbReady ? await listAllVotes() : [];
  const responses = dbReady ? await listResponsesForVotes(votes.map((v) => v.id)) : [];

  const responsesByVote: Record<string, BoardVoteResponse[]> = {};
  for (const r of responses) {
    (responsesByVote[r.vote_id] ??= []).push(r);
  }

  return (
    <Container>
      <PortalPageHero
        title="Voting & Approvals"
        description="Create, review, and vote on board actions, resolutions, and approvals."
      />
      <div className="mt-6">
        <VotingBoard
          votes={votes}
          responsesByVote={responsesByVote}
          currentUserId={session?.id ?? ""}
          isOwner={session?.role === "owner"}
        />
      </div>
    </Container>
  );
}
