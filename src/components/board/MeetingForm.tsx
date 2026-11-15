"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Video, Users, Lock, ChevronDown } from "lucide-react";
import type { BoardMeeting } from "@/lib/board-meetings";

type Member = { id: string; name: string };

/** Local datetime-local input value from an ISO string, in the browser's
 * own timezone (matches how <input type="datetime-local"> always reads). */
function toLocalInputValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Create or edit a board meeting — title, date/time, video link, notes,
 * and who's invited (everyone, or a specific subset). Posts to the existing
 * /api/admin/board-meetings endpoint, which sends the matching Resend
 * notification (invite on create, update notice on edit). */
export function MeetingForm({
  meeting,
  members,
  onDone,
}: {
  /** Omit to render a "Schedule a Meeting" create button; pass an existing
   * meeting to render inline, pre-filled for editing. */
  meeting?: BoardMeeting;
  members: Member[];
  onDone?: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(meeting);
  const [open, setOpen] = useState(isEdit);
  const [title, setTitle] = useState(meeting?.title ?? "");
  const [scheduledAt, setScheduledAt] = useState(meeting ? toLocalInputValue(meeting.scheduled_at) : "");
  const [zoomUrl, setZoomUrl] = useState(meeting?.zoom_url ?? "");
  const [notes, setNotes] = useState(meeting?.notes ?? "");
  const [inviteeIds, setInviteeIds] = useState<string[]>(meeting?.invitee_ids ?? []);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleInvitee(id: string) {
    setInviteeIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title,
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : "",
      zoomUrl,
      notes,
      inviteeIds,
    };

    const res = await fetch("/api/admin/board-meetings", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isEdit ? { id: meeting!.id, ...payload } : payload),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.message || "Could not save the meeting.");
      return;
    }
    if (!isEdit) {
      setTitle("");
      setScheduledAt("");
      setZoomUrl("");
      setNotes("");
      setInviteeIds([]);
      setOpen(false);
    }
    onDone?.();
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

  const inviteeNames = members.filter((m) => inviteeIds.includes(m.id)).map((m) => m.name);

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-ink/10 bg-white p-6">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-700">
        <CalendarPlus className="h-3.5 w-3.5" />
        {isEdit ? "Edit Meeting" : "Schedule a Meeting"}
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

      <div className="relative mt-3">
        <button
          type="button"
          onClick={() => setPickerOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:bg-paper"
        >
          {inviteeIds.length === 0 ? (
            <>
              <Users className="h-3.5 w-3.5" />
              Entire Board Invited
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5 text-blue-700" />
              {inviteeNames.join(", ")}
            </>
          )}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>

        {pickerOpen && (
          <div className="absolute left-0 top-full z-10 mt-2 w-64 rounded-xl border border-ink/10 bg-white p-2 shadow-lg">
            <button
              type="button"
              onClick={() => setInviteeIds([])}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-ink/70 hover:bg-paper"
            >
              <Users className="h-4 w-4" />
              Entire board
            </button>
            <div className="my-1 h-px bg-ink/10" />
            {members.length === 0 ? (
              <p className="px-2.5 py-2 text-xs text-ink/40">No other active members yet.</p>
            ) : (
              members.map((m) => (
                <label key={m.id} className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-ink/80 hover:bg-paper">
                  <input
                    type="checkbox"
                    checked={inviteeIds.includes(m.id)}
                    onChange={() => toggleInvitee(m.id)}
                    className="h-4 w-4 rounded border-ink/30 text-blue-700 focus:ring-blue-700/30"
                  />
                  {m.name}
                </label>
              ))
            )}
          </div>
        )}
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
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Schedule Meeting"}
        </button>
        <button
          type="button"
          onClick={() => (isEdit ? onDone?.() : setOpen(false))}
          className="text-sm font-medium text-ink/50 hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
