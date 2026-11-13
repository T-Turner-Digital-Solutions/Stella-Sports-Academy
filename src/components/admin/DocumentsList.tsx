"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ExternalLink, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DOCUMENT_CATEGORY_LABELS, type BoardDocument } from "@/lib/board-documents-shared";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DocumentRow({ document }: { document: BoardDocument }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [replacing, setReplacing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleArchive() {
    if (!window.confirm(`Archive "${document.title}"? Board members will no longer see it.`)) return;
    setBusy(true);
    await fetch(`/api/admin/documents/${document.id}`, { method: "DELETE" });
    router.refresh();
    setBusy(false);
  }

  async function handleReplace() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);

    const body = new FormData();
    body.set("file", file);
    body.set("category", document.category);
    body.set("title", document.title);
    if (document.description) body.set("description", document.description);
    body.set("replaceId", document.id);

    const res = await fetch("/api/admin/documents", { method: "POST", body });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.message || "Something went wrong. Please try again.");
      setBusy(false);
      return;
    }
    setReplacing(false);
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-red-700">
            {DOCUMENT_CATEGORY_LABELS[document.category]} · v{document.version}
          </p>
          <p className="mt-0.5 font-semibold text-ink">{document.title}</p>
          {document.description && <p className="mt-1 text-sm text-ink/60">{document.description}</p>}
          <p className="mt-1 text-xs text-ink/40">
            {document.file_name} · {formatBytes(document.file_size_bytes)} · Uploaded {formatDate(document.created_at)}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <a
            href={`/api/board/documents/${document.id}/download`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-ink/15 px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-paper"
          >
            <ExternalLink className="h-4 w-4" />
            View
          </a>
          {document.is_current && !document.archived && (
            <>
              <button
                type="button"
                onClick={() => setReplacing((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg border border-ink/15 px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-paper"
              >
                <RefreshCw className="h-4 w-4" />
                Replace
              </button>
              <button
                type="button"
                onClick={handleArchive}
                disabled={busy}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
                aria-label={`Archive ${document.title}`}
              >
                <Archive className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {replacing && (
        <div className="flex flex-col gap-2 border-t border-ink/10 pt-3 sm:flex-row sm:items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="flex-1 rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm text-ink file:mr-3 file:rounded-full file:border-0 file:bg-red-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-red-700"
          />
          <button
            type="button"
            onClick={handleReplace}
            disabled={busy}
            className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-50"
          >
            {busy ? "Uploading…" : "Upload New Version"}
          </button>
        </div>
      )}
      {error && <p className="text-xs font-medium text-red-700">{error}</p>}
    </div>
  );
}

export function DocumentsList({ documents }: { documents: BoardDocument[] }) {
  return (
    <div className="flex flex-col gap-3">
      {documents.map((document) => (
        <DocumentRow key={document.id} document={document} />
      ))}
    </div>
  );
}
