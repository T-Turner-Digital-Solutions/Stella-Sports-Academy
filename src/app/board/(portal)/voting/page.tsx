import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { VotingBoard } from "@/components/board/VotingBoard";

export const metadata: Metadata = { title: "Voting & Approvals" };

export default function BoardVotingPage() {
  return (
    <Container>
      <PortalPageHero
        title="Voting & Approvals"
        description="Create, review, and vote on board actions, resolutions, and approvals."
      />
      <div className="mt-6">
        <VotingBoard />
      </div>
    </Container>
  );
}
