import type { Metadata } from "next";
import { CheckSquare } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PortalPageHero } from "@/components/board/PortalPageHero";

export const metadata: Metadata = { title: "Voting & Approvals" };

export default function BoardVotingPage() {
  return (
    <Container>
      <PortalPageHero title="Voting & Approvals" description="Resolutions, decisions, and acknowledgments." />

      <div>
        <EmptyState
          icon={CheckSquare}
          title="Coming Soon"
          description="Board resolutions and voting will be built against the organization's adopted bylaws — quorum, eligibility, and approval rules — in a later stage of the portal."
        />
      </div>
    </Container>
  );
}
