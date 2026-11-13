"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { DOCUMENT_CATEGORY_LABELS, type BoardDocument } from "@/lib/board-documents-shared";

export function BoardDocumentsList({
  documents,
  acknowledgedIds,
}: {
  documents: BoardDocument[];
  acknowledgedIds: string[];
}) {
  const router = useRouter();
  const [acking, setAcking] = useState<string | null>(null);
  const acknowledged = new Set(acknowledgedIds);

  async function handleAcknowledge(id: string) {
    setAcking(id);
    const res = await fetch(`/api/board/documents/${id}/acknowledge`, { method: "POST" });
    if (res.ok) router.refresh();
    setAcking(null);
  }

  return (
    <div className="flex flex-col gap-3">
      {documents.map((document) => {
        const isAcknowledged = acknowledged.has(document.id);
        return (
          <div key={document.id} className="rounded-2xl border border-ink/10 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-red-700">
              {DOCUMENT_CATEGORY_LABELS[document.category]}
            </p>
            <p className="mt-0.5 font-semibold text-ink">{document.title}</p>
            {document.description && <p className="mt-1 text-sm text-ink/50">{document.description}</p>}

            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <a
                href={`/api/board/documents/${document.id}/download`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800"
              >
                View Document
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              {isAcknowledged ? (
                <span className="flex items-center gap-1.5 text-sm font-medium text-ink/50">
                  <CheckCircle2 className="h-4 w-4 text-red-700" />
                  Acknowledged
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleAcknowledge(document.id)}
                  disabled={acking === document.id}
                  className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/70 transition-colors hover:bg-paper disabled:opacity-50"
                >
                  {acking === document.id ? "Saving…" : "I Acknowledge"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
