"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, CheckCircle2, ChevronDown, Eye, RefreshCw } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { DOCUMENT_CATEGORY_LABELS, type BoardDocument } from "@/lib/board-documents-shared";

export type DocumentAcknowledgment = { name: string; email: string; acknowledged_at: string };

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function PermissionToggle({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-ink/60">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5 rounded border-ink/30 text-red-700 focus:ring-red-700/30"
      />
      {label}
    </label>
  );
}

function DocumentRow({
  document,
  activeMemberCount,
  acknowledgments,
}: {
  document: BoardDocument;
  activeMemberCount: number;
  acknowledgments: DocumentAcknowledgment[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [replacing, setReplacing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAcks, setShowAcks] = useState(false);
  const [permissions, setPermissions] = useState({
    allowPrint: document.allow_print,
    allowDownload: document.allow_download,
    allowEmail: document.allow_email,
  });

  async function handlePermissionChange(next: typeof permissions) {
    setPermissions(next);
    await fetch(`/api/admin/documents/${document.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
  }

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
            {document.file_name} · {formatBytes(document.file_size_bytes)} · Effective {formatDate(document.effective_date)}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <Link
            href={`/board/documents/${document.id}`}
            className="flex items-center gap-1.5 rounded-lg border border-ink/15 px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-paper"
          >
            <Eye className="h-4 w-4" />
            View
          </Link>
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

      {document.is_current && !document.archived && (
        <div className="flex flex-wrap items-center gap-4 border-t border-ink/5 pt-3">
          <PermissionToggle
            id={`${document.id}-print`}
            label="Print"
            checked={permissions.allowPrint}
            onChange={(v) => handlePermissionChange({ ...permissions, allowPrint: v })}
          />
          <PermissionToggle
            id={`${document.id}-download`}
            label="Download"
            checked={permissions.allowDownload}
            onChange={(v) => handlePermissionChange({ ...permissions, allowDownload: v })}
          />
          <PermissionToggle
            id={`${document.id}-email`}
            label="Email"
            checked={permissions.allowEmail}
            onChange={(v) => handlePermissionChange({ ...permissions, allowEmail: v })}
          />

          <button
            type="button"
            onClick={() => setShowAcks((v) => !v)}
            className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-ink/50 hover:text-ink"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-red-700" />
            {acknowledgments.length} of {activeMemberCount} acknowledged
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showAcks && "rotate-180")} />
          </button>
        </div>
      )}

      {showAcks && (
        <div className="border-t border-ink/5 pt-3">
          {acknowledgments.length === 0 ? (
            <p className="text-xs text-ink/40">No one has acknowledged this document yet.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {acknowledgments.map((a) => (
                <li key={a.email} className="text-xs text-ink/60">
                  <span className="font-medium text-ink">{a.name}</span> — {formatDate(a.acknowledged_at)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

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

export function DocumentsList({
  documents,
  activeMemberCount,
  acknowledgmentsByDocument,
}: {
  documents: BoardDocument[];
  activeMemberCount: number;
  acknowledgmentsByDocument: Record<string, DocumentAcknowledgment[]>;
}) {
  return (
    <div className="flex flex-col gap-3">
      {documents.map((document) => (
        <DocumentRow
          key={document.id}
          document={document}
          activeMemberCount={activeMemberCount}
          acknowledgments={acknowledgmentsByDocument[document.id] ?? []}
        />
      ))}
    </div>
  );
}
