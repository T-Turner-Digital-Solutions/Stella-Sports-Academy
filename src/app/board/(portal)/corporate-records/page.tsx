import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
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
      <div className="mt-6">
        <CorporateRecordsBrowser documents={documents} acknowledgedIds={acknowledgedIds} />
      </div>
    </Container>
  );
}
