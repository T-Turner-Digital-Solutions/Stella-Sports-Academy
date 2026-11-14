import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { isDatabaseConfigured } from "@/lib/db";
import { getCurrentAdminSession } from "@/lib/auth";
import { listCurrentBoardDocuments, listAcknowledgedDocumentIds } from "@/lib/board-documents";
import { BoardDocumentsList } from "@/components/board/BoardDocumentsList";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Corporate Records" };

export default async function BoardCorporateRecordsPage() {
  const dbReady = isDatabaseConfigured();
  const session = await getCurrentAdminSession();
  const documents = dbReady ? await listCurrentBoardDocuments() : [];
  const acknowledgedIds = dbReady && session ? await listAcknowledgedDocumentIds(session.id) : [];

  return (
    <Container>
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Corporate Records</h1>
      <p className="mt-1 text-sm text-ink/60">Official record book, bylaws, and governance documents.</p>

      <div className="mt-8">
        {!dbReady || documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Records Yet"
            description="Governance documents the owner uploads will appear here for you to view and acknowledge."
          />
        ) : (
          <BoardDocumentsList documents={documents} acknowledgedIds={acknowledgedIds} />
        )}
      </div>
    </Container>
  );
}
