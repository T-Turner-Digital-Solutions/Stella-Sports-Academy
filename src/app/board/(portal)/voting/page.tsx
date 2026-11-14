import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { VotingBoard } from "@/components/board/VotingBoard";

export const metadata: Metadata = { title: "Voting & Approvals" };

export default function BoardVotingPage() {
  return (
    <>
      <PortalPageHero
        title="Voting & Approvals"
        description="Create, review, and vote on board actions, resolutions, and approvals."
      />
      <Container className="py-8">
        <VotingBoard />
      </Container>
    </>
  );
}
