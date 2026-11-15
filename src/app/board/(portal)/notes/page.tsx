import type { Metadata } from "next";
import { NotebookPen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "My Notes" };

export default function BoardNotesPage() {
  return (
    <Container>
      <PortalPageHero
        title="My Notes"
        description="Private notes only you can see — not visible to other board members or the administrator."
      />
      <div className="mt-6">
        <EmptyState
          theme="blue"
          icon={NotebookPen}
          title="Coming Soon"
          description="Private notes are being built next. Once ready, anything you write here will be visible only to your own account."
        />
      </div>
    </Container>
  );
}
