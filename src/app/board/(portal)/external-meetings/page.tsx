import type { Metadata } from "next";
import { Video } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "External Meetings" };

export default function BoardExternalMeetingsPage() {
  return (
    <Container>
      <PortalPageHero
        title="External Meetings"
        description="Meetings with sponsors, donors, parents, and partners — scheduled by the administrator."
      />
      <div className="mt-6">
        <EmptyState
          theme="blue"
          icon={Video}
          title="Coming Soon"
          description="Scheduling and RSVPs for meetings with people outside the board are being built next."
        />
      </div>
    </Container>
  );
}
