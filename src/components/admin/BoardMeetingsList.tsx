"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ExternalLink } from "lucide-react";
import type { BoardMeeting } from "@/lib/board-meetings";

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function BoardMeetingsList({ meetings }: { meetings: BoardMeeting[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch("/api/admin/board-meetings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-3">
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className="flex flex-col gap-2 rounded-2xl border border-ink/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-semibold text-ink">{meeting.title}</p>
            <p className="text-sm text-ink/60">{formatDateTime(meeting.scheduled_at)}</p>
            {meeting.notes && <p className="mt-1 text-sm text-ink/50">{meeting.notes}</p>}
          </div>
          <div className="flex items-center gap-2">
            {meeting.zoom_url && (
              <a
                href={meeting.zoom_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-ink/15 px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-paper"
              >
                <ExternalLink className="h-4 w-4" />
                Link
              </a>
            )}
            <button
              type="button"
              onClick={() => handleDelete(meeting.id)}
              disabled={deletingId === meeting.id}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
              aria-label={`Remove ${meeting.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
