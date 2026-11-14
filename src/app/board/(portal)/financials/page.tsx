import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Financials" };

export default function BoardFinancialsPage() {
  return (
    <Container>
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Financials</h1>
      <p className="mt-1 text-sm text-ink/60">Budgets, reports, and financial updates.</p>

      <div className="mt-8">
        <EmptyState
          icon={BarChart3}
          title="Coming Soon"
          description="Budgets, financial statements, and sponsorship summaries will be published here in a later stage of the portal."
        />
      </div>
    </Container>
  );
}
