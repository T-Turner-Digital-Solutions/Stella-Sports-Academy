"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Send, CheckCircle2, XCircle, FileCheck2 } from "lucide-react";
import type { BoardMeetingMinutes, MinutesHistoryEntry } from "@/lib/board-meeting-minutes";

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted for Approval",
  approved: "Approved",
  rejected: "Rejected",
};

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-ink/10 text-ink/60",
  submitted: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Chicago" }).format(
    new Date(iso)
  );
}

export function MinutesEditor({
  meetingId,
  minutes,
  history,
  isOwner,
  filedDocumentUrl,
}: {
  meetingId: string;
  minutes: BoardMeetingMinutes;
  history: MinutesHistoryEntry[];
  isOwner: boolean;
  filedDocumentUrl: string | null;
}) {
  const router = useRouter();
  const [content, setContent] = useState(minutes.content);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function send(body: Record<string, unknown>, label = "") {
    setPending(label);
    setError(null);
    const res = await fetch(`/api/board/meetings/${meetingId}/minutes`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    setPending(null);
    if (!res.ok) {
      setError(data.message || "Something went wrong.");
      return;
    }
    router.refresh();
  }

  const isDraft = minutes.status === "draft";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${STATUS_STYLES[minutes.status]}`}>
          {STATUS_LABELS[minutes.status]}
        </span>
        {filedDocumentUrl && (
          <Link href={filedDocumentUrl} className="flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:underline">
            <FileCheck2 className="h-4 w-4" />
            View Filed Minutes in Corporate Records
          </Link>
        )}
      </div>

      <div className="rounded-xl border border-ink/10 bg-white p-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          readOnly={!isDraft}
          placeholder="Draft the official minutes for this meeting — attendance, discussion, motions, and decisions…"
          rows={14}
          className={`w-full resize-y rounded-lg border px-3 py-2 text-sm text-ink focus:outline-none ${
            isDraft
              ? "border-ink/15 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15"
              : "border-ink/10 bg-paper text-ink/70"
          }`}
        />
        {error && <p className="mt-2 text-xs font-medium text-red-700">{error}</p>}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {isDraft && (
            <>
              <button
                type="button"
                onClick={() => send({ action: "save", content }, "save")}
                disabled={pending !== null}
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/70 transition-colors hover:bg-paper disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {pending === "save" ? "Saving…" : "Save Draft"}
              </button>
              {isOwner && (
                <button
                  type="button"
                  onClick={() => send({ action: "save", content }).then(() => send({ action: "submit" }, "submit"))}
                  disabled={pending !== null}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {pending === "submit" ? "Submitting…" : "Submit for Board Approval"}
                </button>
              )}
            </>
          )}

          {minutes.status === "submitted" && (
            <>
              <p className="text-sm text-ink/60">
                Up for a vote on{" "}
                <Link href="/board/voting" className="font-semibold text-blue-700 hover:underline">
                  Voting &amp; Approvals
                </Link>
                .
              </p>
              {isOwner && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => send({ action: "decide", decision: "approved" }, "approve")}
                    disabled={pending !== null}
                    className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {pending === "approve" ? "Filing…" : "Approve & File"}
                  </button>
                  <button
                    type="button"
                    onClick={() => send({ action: "decide", decision: "rejected" }, "reject")}
                    disabled={pending !== null}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                    {pending === "reject" ? "Rejecting…" : "Reject"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-ink/10 bg-white p-5">
        <p className="font-semibold text-sm text-[#0b1f3a]">Audit Trail</p>
        <div className="mt-3 flex flex-col gap-2">
          {history.map((h) => (
            <p key={h.id} className="text-xs text-ink/60">
              <span className="font-semibold capitalize text-ink/80">{h.action}</span>
              {h.actor_name ? ` by ${h.actor_name}` : ""} — {formatDateTime(h.created_at)}
              {h.note ? ` (${h.note})` : ""}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
