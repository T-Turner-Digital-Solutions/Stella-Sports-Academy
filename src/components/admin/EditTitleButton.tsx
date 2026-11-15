"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

/** Owner-only inline editor for a board member's official position (e.g.
 * "Vice President"), shown under their name on the board portal's
 * personalized welcome message. */
export function EditTitleButton({ id, title }: { id: string; title: string | null }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title ?? "");
  const [pending, setPending] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    await fetch("/api/admin/team", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title: value.trim() }),
    });
    setPending(false);
    setEditing(false);
    router.refresh();
  }

  if (editing) {
    return (
      <form onSubmit={handleSave} className="flex items-center gap-2">
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. Vice President"
          className="w-40 rounded-lg border border-ink/15 px-2 py-1 text-sm text-ink focus:border-red-700 focus:outline-none focus:ring-2 focus:ring-red-700/15"
        />
        <button type="submit" disabled={pending} className="text-xs font-semibold text-red-700 hover:underline disabled:opacity-50">
          {pending ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={() => setEditing(false)} className="text-xs font-medium text-ink/40 hover:text-ink">
          Cancel
        </button>
      </form>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="flex items-center gap-1.5 text-ink/70 hover:text-ink"
    >
      {title || <span className="text-ink/40">Not set</span>}
      <Pencil className="h-3 w-3 flex-shrink-0 text-ink/30" />
    </button>
  );
}
