"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Video } from "lucide-react";

/** Lets any signed-in board member/admin schedule a new meeting right from
 * the Board Meetings page — no separate admin page needed. Matches the
 * existing permission model for board_meetings (a scheduling convenience,
 * not an access-control surface). */
export function CreateMeetingForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [zoomUrl, setZoomUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/board-meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : "",
        zoomUrl,
        notes,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.message || "Could not schedule the meeting.");
      return;
    }
    setTitle("");
    setScheduledAt("");
    setZoomUrl("");
    setNotes("");
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
      >
        <CalendarPlus className="h-4 w-4" />
        Schedule a Meeting
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-ink/10 bg-white p-6">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-700">
        <CalendarPlus className="h-3.5 w-3.5" />
        Schedule a Meeting
      </p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Meeting title"
          className="rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
        />
        <input
          required
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
        />
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-ink/15 px-3 py-2 focus-within:border-blue-700 focus-within:ring-2 focus-within:ring-blue-700/15">
        <Video className="h-4 w-4 flex-shrink-0 text-ink/40" />
        <input
          type="url"
          value={zoomUrl}
          onChange={(e) => setZoomUrl(e.target.value)}
          placeholder="Google Meet or Zoom link (optional — add later if you don't have it yet)"
          className="w-full text-sm text-ink focus:outline-none"
        />
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Agenda / notes (optional)"
        rows={3}
        className="mt-3 w-full resize-none rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
      />
      {error && <p className="mt-2 text-xs font-medium text-red-700">{error}</p>}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
        >
          {saving ? "Scheduling…" : "Schedule Meeting"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm font-medium text-ink/50 hover:text-ink">
          Cancel
        </button>
      </div>
    </form>
  );
}
