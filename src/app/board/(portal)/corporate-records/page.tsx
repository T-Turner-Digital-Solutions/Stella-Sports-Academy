import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { isDatabaseConfigured } from "@/lib/db";
import { getCurrentAdminSession } from "@/lib/auth";
import { listCurrentBoardDocuments, listAcknowledgedDocumentIds } from "@/lib/board-documents";
import { CorporateRecordsBrowser } from "@/components/board/CorporateRecordsBrowser";
import { PortalPageHero } from "@/components/board/PortalPageHero";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Corporate Records" };

export default async function BoardCorporateRecordsPage() {
  const dbReady = isDatabaseConfigured();
  const session = await getCurrentAdminSession();
  const documents = dbReady ? await listCurrentBoardDocuments() : [];
  const acknowledgedIds = dbReady && session ? await listAcknowledgedDocumentIds(session.id) : [];

  return (
    <Container>
      <PortalPageHero
        title="Corporate Records"
        description="Official organizational records, governing documents, and compliance filings."
      />

      <div>
        {!dbReady || documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Records Available"
            description="Corporate records will appear here once they are uploaded and approved."
          />
        ) : (
          <CorporateRecordsBrowser documents={documents} acknowledgedIds={acknowledgedIds} />
        )}
      </div>
    </Container>
  );
}
