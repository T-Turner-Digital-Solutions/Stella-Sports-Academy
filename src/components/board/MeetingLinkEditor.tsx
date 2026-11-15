"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Video } from "lucide-react";

/** Lets any signed-in board member/admin add or change a meeting's Google
 * Meet/Zoom link right from the Board Meetings page — no separate admin
 * page needed. Matches the existing permission model for board_meetings
 * (a scheduling convenience, not an access-control surface). */
export function MeetingLinkEditor({ meetingId, zoomUrl }: { meetingId: string; zoomUrl: string | null }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(zoomUrl ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await fetch("/api/admin/board-meetings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: meetingId, zoomUrl: value.trim() }),
    });
    const data = await res.json().catch(() => ({}));
    setPending(false);
    if (!res.ok) {
      setError(data.message || "Could not save the link.");
      return;
    }
    setEditing(false);
    router.refresh();
  }

  if (editing) {
    return (
      <form onSubmit={handleSave} className="mt-5 flex flex-col gap-2 sm:max-w-md">
        <input
          autoFocus
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://meet.google.com/... or https://zoom.us/j/..."
          className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
        />
        {error && <p className="text-xs font-medium text-red-700">{error}</p>}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save Link"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setValue(zoomUrl ?? "");
              setError(null);
            }}
            className="text-sm font-medium text-ink/50 hover:text-ink"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  if (!zoomUrl) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="mt-5 inline-flex items-center gap-2 rounded-full border border-blue-700/30 px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
      >
        <Video className="h-4 w-4" />
        Add Meeting Link
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="mt-2 flex items-center gap-1.5 text-xs font-medium text-ink/40 hover:text-ink"
    >
      <Pencil className="h-3 w-3" />
      Edit Link
    </button>
  );
}
