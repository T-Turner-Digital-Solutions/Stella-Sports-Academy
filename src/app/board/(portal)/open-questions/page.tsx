import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Open Questions" };

export default function BoardOpenQuestionsPage() {
  return (
    <Container>
      <PortalPageHero
        title="Open Questions"
        description="Ask the administrator a question and track the answer."
      />
      <div className="mt-6">
        <EmptyState
          theme="blue"
          icon={HelpCircle}
          title="Coming Soon"
          description="A place to ask questions and see answers is being built next."
        />
      </div>
    </Container>
  );
}
