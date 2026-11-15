"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

/** Owner-only inline editor for correcting a board member's email address
 * (e.g. a typo on the original invite). */
export function EditEmailButton({ id, email }: { id: string; email: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(email);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await fetch("/api/admin/team", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email: value.trim() }),
    });
    const data = await res.json().catch(() => ({}));
    setPending(false);
    if (!res.ok) {
      setError(data.message || "Could not update the email.");
      return;
    }
    setEditing(false);
    router.refresh();
  }

  if (editing) {
    return (
      <form onSubmit={handleSave} className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            autoFocus
            type="email"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-56 rounded-lg border border-ink/15 px-2 py-1 text-sm text-ink focus:border-red-700 focus:outline-none focus:ring-2 focus:ring-red-700/15"
          />
          <button type="submit" disabled={pending} className="text-xs font-semibold text-red-700 hover:underline disabled:opacity-50">
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setValue(email);
              setError(null);
            }}
            className="text-xs font-medium text-ink/40 hover:text-ink"
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-xs font-medium text-red-700">{error}</p>}
      </form>
    );
  }

  return (
    <button type="button" onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-ink/70 hover:text-ink">
      {email}
      <Pencil className="h-3 w-3 flex-shrink-0 text-ink/30" />
    </button>
  );
}
