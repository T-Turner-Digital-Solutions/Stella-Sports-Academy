import type { Metadata } from "next";
import { CheckSquare } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Voting & Approvals" };

export default function BoardVotingPage() {
  return (
    <Container>
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Voting & Approvals</h1>
      <p className="mt-1 text-sm text-ink/60">Resolutions, decisions, and acknowledgments.</p>

      <div className="mt-8">
        <EmptyState
          icon={CheckSquare}
          title="Coming Soon"
          description="Board resolutions and voting will be built against the organization's adopted bylaws — quorum, eligibility, and approval rules — in a later stage of the portal."
        />
      </div>
    </Container>
  );
}
