import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, FileText, Printer } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { findBoardDocumentById, listAcknowledgmentsForDocument } from "@/lib/board-documents";
import { DOCUMENT_CATEGORY_LABELS } from "@/lib/board-documents-shared";
import { formatDate } from "@/lib/utils";
import { AcknowledgeButton } from "@/components/board/AcknowledgeButton";
import { EmailDocumentButton } from "@/components/board/EmailDocumentButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Document" };

export default async function BoardDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) notFound();

  const { id } = await params;
  const document = await findBoardDocumentById(id);
  if (!document) notFound();

  const session = await getCurrentAdminSession();
  const acknowledgments = await listAcknowledgmentsForDocument(id);
  const alreadyAcknowledged = Boolean(session && acknowledgments.some((a) => a.admin_user_id === session.id));

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="flex items-center justify-between border-b border-ink/10 bg-white px-5 py-4 sm:px-8">
        <Logo />
        <Link href="/board" className="flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-ink">
          <ArrowLeft className="h-4 w-4" />
          Back to Board Portal
        </Link>
      </header>

      <main className="flex-1 py-10">
        <Container className="max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-ink/10 bg-ink p-6 text-white sm:flex-row sm:items-start sm:justify-between sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                  <FileText className="h-6 w-6 text-white" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-white/50">
                    {DOCUMENT_CATEGORY_LABELS[document.category]} &middot; Version {document.version}
                  </p>
                  <h1 className="mt-1 font-display text-2xl uppercase tracking-wide text-white">
                    {document.title}
                    {(!document.is_current || document.archived) && (
                      <span className="ml-3 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold normal-case tracking-normal text-white/70">
                        {document.archived ? "Archived" : "Superseded"}
                      </span>
                    )}
                  </h1>
                  {document.description && <p className="mt-2 max-w-xl text-sm text-white/70">{document.description}</p>}
                  <p className="mt-3 text-xs text-white/40">Effective {formatDate(document.effective_date)}</p>
                </div>
              </div>

              <div className="flex flex-shrink-0 flex-col items-stretch gap-2 sm:items-end">
                <div className="relative flex flex-wrap items-center gap-2">
                  {document.allow_download && (
                    <a
                      href={`/api/board/documents/${document.id}/download`}
                      download={document.file_name}
                      className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  )}
                  {document.allow_print && (
                    <a
                      href={`/api/board/documents/${document.id}/download#view=FitH&pagemode=none`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Opens the full document in a new tab at a readable size, where your browser's print dialog can print the whole document or just the pages you need"
                      className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      <Printer className="h-4 w-4" />
                      Print
                    </a>
                  )}
                  {document.allow_email && <EmailDocumentButton documentId={document.id} />}
                </div>
                <AcknowledgeButton documentId={document.id} initiallyAcknowledged={alreadyAcknowledged} />
              </div>
            </div>

            <div className="bg-paper-dim p-3 sm:p-5">
              <div className="overflow-hidden rounded-xl border border-ink/10 bg-white" style={{ height: "80vh" }}>
                <iframe
                  src={`/api/board/documents/${document.id}/download#view=FitH&pagemode=none`}
                  title={document.title}
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
