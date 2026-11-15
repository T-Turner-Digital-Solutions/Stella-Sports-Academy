"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Send } from "lucide-react";
import { formatRelativeDayTime } from "@/lib/utils";
import { formatPositionLabel, type AdminRole } from "@/lib/admin-users-shared";

export type MessageItem = {
  id: string;
  created_at: string;
  admin_user_id: string;
  body: string;
  author_name: string;
  author_role: AdminRole;
  author_title: string | null;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

export function MessageBoard({
  messages,
  currentUserId,
  isOwner,
}: {
  messages: MessageItem[];
  currentUserId: string;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    const res = await fetch("/api/board/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    const data = await res.json().catch(() => ({}));
    setSending(false);
    if (!res.ok) {
      setError(data.message || "Could not post the message.");
      return;
    }
    setBody("");
    router.refresh();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch("/api/board/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSend} className="flex flex-col gap-2 rounded-xl border border-ink/10 bg-white p-4">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share an update with the board…"
          rows={2}
          className="w-full resize-none rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
        />
        {error && <p className="text-xs font-medium text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={sending || !body.trim()}
          className="inline-flex items-center gap-2 self-end rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
          {sending ? "Posting…" : "Post Message"}
        </button>
      </form>

      {messages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink/15 bg-paper p-6 text-center text-sm text-ink/50">
          No messages yet — be the first to share an update.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <div key={m.id} className="flex items-start gap-3 rounded-xl border border-ink/10 bg-white p-4">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                {initials(m.author_name)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <p className="font-semibold text-sm text-[#0b1f3a]">
                    {m.author_name}
                    <span className="ml-1.5 font-normal text-ink/40">
                      {formatPositionLabel({ role: m.author_role, title: m.author_title })}
                    </span>
                  </p>
                  <p className="text-xs text-ink/40">{formatRelativeDayTime(m.created_at)}</p>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-ink/80">{m.body}</p>
              </div>
              {(isOwner || m.admin_user_id === currentUserId) && (
                <button
                  type="button"
                  onClick={() => handleDelete(m.id)}
                  disabled={deletingId === m.id}
                  aria-label="Delete message"
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-ink/30 transition-colors hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
