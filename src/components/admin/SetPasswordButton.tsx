"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";

/** Owner-only. Sets a board member's password directly and activates their
 * account immediately — no email required. For when email delivery can't
 * be relied on in the moment and someone needs in right now. The owner is
 * responsible for sharing the password with that person some other way
 * (phone, in person, etc.). */
export function SetPasswordButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await fetch("/api/admin/team", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password: value }),
    });
    const data = await res.json().catch(() => ({}));
    setPending(false);
    if (!res.ok) {
      setError(data.message || "Could not set the password.");
      return;
    }
    setDone(true);
    setEditing(false);
    router.refresh();
  }

  if (done) {
    return <span className="text-sm font-semibold text-green-700">Password set!</span>;
  }

  if (editing) {
    return (
      <form onSubmit={handleSave} className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            autoFocus
            type="text"
            required
            minLength={8}
            placeholder={`Password for ${name}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-48 rounded-lg border border-ink/15 px-2 py-1 text-sm text-ink focus:border-red-700 focus:outline-none focus:ring-2 focus:ring-red-700/15"
          />
          <button type="submit" disabled={pending} className="text-xs font-semibold text-red-700 hover:underline disabled:opacity-50">
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setValue("");
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
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"
    >
      <KeyRound className="h-3.5 w-3.5" />
      Set Password
    </button>
  );
}
