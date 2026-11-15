"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Share2, CalendarClock, ChevronDown, X } from "lucide-react";

export type NoteItem = {
  id: string;
  created_at: string;
  updated_at: string;
  admin_user_id: string;
  title: string;
  body: string;
  shared_with: string[] | null;
  meeting_id: string | null;
  author_name: string;
  meeting_title: string | null;
};

type Member = { id: string; name: string };
type MeetingOption = { id: string; title: string };

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "America/Chicago" }).format(new Date(iso));
}

export function NotesBoard({
  notes,
  members,
  meetings,
  currentUserId,
}: {
  notes: NoteItem[];
  members: Member[];
  meetings: MeetingOption[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const ownNotes = notes.filter((n) => n.admin_user_id === currentUserId);
  const sharedWithYou = notes.filter((n) => n.admin_user_id !== currentUserId);

  return (
    <div className="flex flex-col gap-6">
      {creating ? (
        <NoteEditor
          members={members}
          meetings={meetings}
          onDone={() => {
            setCreating(false);
            router.refresh();
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 self-start rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
        >
          <Plus className="h-4 w-4" />
          New Note
        </button>
      )}

      <section>
        <h2 className="font-semibold text-base text-[#0b1f3a]">My Notes</h2>
        {ownNotes.length === 0 ? (
          <p className="mt-3 text-sm text-ink/50">You haven&apos;t written any notes yet.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {ownNotes.map((note) =>
              editingId === note.id ? (
                <NoteEditor
                  key={note.id}
                  note={note}
                  members={members}
                  meetings={meetings}
                  onDone={() => {
                    setEditingId(null);
                    router.refresh();
                  }}
                />
              ) : (
                <NoteCard
                  key={note.id}
                  note={note}
                  members={members}
                  isOwn
                  onEdit={() => setEditingId(note.id)}
                />
              )
            )}
          </div>
        )}
      </section>

      {sharedWithYou.length > 0 && (
        <section>
          <h2 className="font-semibold text-base text-[#0b1f3a]">Shared With You</h2>
          <div className="mt-3 flex flex-col gap-3">
            {sharedWithYou.map((note) => (
              <NoteCard key={note.id} note={note} members={members} isOwn={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function NoteCard({
  note,
  members,
  isOwn,
  onEdit,
}: {
  note: NoteItem;
  members: Member[];
  isOwn: boolean;
  onEdit?: () => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const sharedNames = (note.shared_with ?? [])
    .map((id) => members.find((m) => m.id === id)?.name)
    .filter(Boolean) as string[];

  async function handleDelete() {
    if (!window.confirm(`Delete "${note.title}"? This can't be undone.`)) return;
    setDeleting(true);
    await fetch(`/api/board/notes/${note.id}`, { method: "DELETE" });
    router.refresh();
    setDeleting(false);
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-sm text-[#0b1f3a]">{note.title}</p>
          {!isOwn && <p className="mt-0.5 text-xs text-ink/40">Shared by {note.author_name}</p>}
        </div>
        {isOwn && (
          <div className="flex flex-shrink-0 items-center gap-1">
            <button type="button" onClick={onEdit} aria-label="Edit note" className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/40 hover:bg-paper hover:text-ink">
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              aria-label="Delete note"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/30 hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm text-ink/70">{note.body}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-ink/40">
        <span>Updated {formatDate(note.updated_at)}</span>
        {note.meeting_title && (
          <span className="flex items-center gap-1">
            <CalendarClock className="h-3 w-3" />
            {note.meeting_title}
          </span>
        )}
        {sharedNames.length > 0 && (
          <span className="flex items-center gap-1">
            <Share2 className="h-3 w-3" />
            Shared with {sharedNames.join(", ")}
          </span>
        )}
      </div>
    </div>
  );
}

function NoteEditor({
  note,
  members,
  meetings,
  onDone,
}: {
  note?: NoteItem;
  members: Member[];
  meetings: MeetingOption[];
  onDone: () => void;
}) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [body, setBody] = useState(note?.body ?? "");
  const [sharedWith, setSharedWith] = useState<string[]>(note?.shared_with ?? []);
  const [meetingId, setMeetingId] = useState<string>(note?.meeting_id ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleShare(id: string) {
    setSharedWith((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { title, body, sharedWith, meetingId: meetingId || null };
    const res = await fetch(note ? `/api/board/notes/${note.id}` : "/api/board/notes", {
      method: note ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.message || "Could not save the note.");
      return;
    }
    onDone();
  }

  const sharedNames = members.filter((m) => sharedWith.includes(m.id)).map((m) => m.name);

  return (
    <form onSubmit={handleSave} className="rounded-xl border border-ink/10 bg-white p-5">
      <input
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm font-semibold text-ink focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your note…"
        rows={4}
        className="mt-3 w-full resize-none rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setPickerOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:bg-paper"
          >
            <Share2 className="h-3.5 w-3.5" />
            {sharedWith.length === 0 ? "Private (only you)" : `Shared: ${sharedNames.join(", ")}`}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {pickerOpen && (
            <div className="absolute left-0 top-full z-10 mt-2 w-64 rounded-xl border border-ink/10 bg-white p-2 shadow-lg">
              {members.length === 0 ? (
                <p className="px-2.5 py-2 text-xs text-ink/40">No other active members yet.</p>
              ) : (
                members.map((m) => (
                  <label key={m.id} className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-ink/80 hover:bg-paper">
                    <input
                      type="checkbox"
                      checked={sharedWith.includes(m.id)}
                      onChange={() => toggleShare(m.id)}
                      className="h-4 w-4 rounded border-ink/30 text-blue-700 focus:ring-blue-700/30"
                    />
                    {m.name}
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        {meetings.length > 0 && (
          <select
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink/70 focus:border-blue-700 focus:outline-none"
          >
            <option value="">Not attached to a meeting</option>
            {meetings.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && <p className="mt-2 text-xs font-medium text-red-700">{error}</p>}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Note"}
        </button>
        <button type="button" onClick={onDone} className="flex items-center gap-1 text-sm font-medium text-ink/50 hover:text-ink">
          <X className="h-3.5 w-3.5" />
          Cancel
        </button>
      </div>
    </form>
  );
}
