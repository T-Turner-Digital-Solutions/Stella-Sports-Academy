import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/db";
import { listAllBoardDocuments } from "@/lib/board-documents";
import { getCurrentAdminSession } from "@/lib/auth";
import { DbNotConfigured } from "@/components/admin/DbNotConfigured";
import { DocumentUploadForm } from "@/components/admin/DocumentUploadForm";
import { DocumentsList } from "@/components/admin/DocumentsList";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Corporate Records" };

export default async function AdminDocumentsPage() {
  const dbReady = isDatabaseConfigured();
  const session = await getCurrentAdminSession();
  const isOwner = session?.role === "owner";
  const documents = dbReady && isOwner ? await listAllBoardDocuments() : [];

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Corporate Records</h1>
      <p className="mt-1 text-sm text-ink/60">
        Governance documents board members can view and acknowledge on their private dashboard.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {!dbReady ? (
          <DbNotConfigured />
        ) : !isOwner ? (
          <EmptyState
            icon={FileText}
            title="Owner Access Required"
            description="Only the owner account can upload or manage corporate records. View them from the Board Portal instead."
          />
        ) : (
          <>
            <DocumentUploadForm />
            {documents.length === 0 ? (
              <EmptyState icon={FileText} title="No Records Yet" description="Documents you upload will appear here and on the board portal." />
            ) : (
              <DocumentsList documents={documents} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
