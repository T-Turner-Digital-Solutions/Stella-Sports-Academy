"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Send, Lock, Users, ChevronDown, Reply } from "lucide-react";
import { formatRelativeDayTime } from "@/lib/utils";
import { formatPositionLabel, type AdminRole } from "@/lib/admin-users-shared";

export type MessageItem = {
  id: string;
  created_at: string;
  admin_user_id: string;
  body: string;
  recipient_ids: string[] | null;
  recipient_names: string[] | null;
  parent_message_id: string | null;
  author_name: string;
  author_role: AdminRole;
  author_title: string | null;
};

type Member = { id: string; name: string };

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

export function MessageBoard({
  messages,
  members,
  currentUserId,
  isOwner,
}: {
  messages: MessageItem[];
  members: Member[];
  currentUserId: string;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [recipientIds, setRecipientIds] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recipientNames = useMemo(
    () => members.filter((m) => recipientIds.includes(m.id)).map((m) => m.name),
    [members, recipientIds]
  );

  // Group into threads: a top-level message plus any replies to it. A
  // reply whose parent isn't in the current window (e.g. it scrolled past
  // the fetch limit) still renders fine — it just surfaces as its own
  // top-level item instead of nested, rather than disappearing.
  const { threads, repliesByParent } = useMemo(() => {
    const byId = new Map(messages.map((m) => [m.id, m]));
    const replies = new Map<string, MessageItem[]>();
    const topLevel: MessageItem[] = [];
    for (const m of messages) {
      if (m.parent_message_id && byId.has(m.parent_message_id)) {
        const list = replies.get(m.parent_message_id) ?? [];
        list.push(m);
        replies.set(m.parent_message_id, list);
      } else {
        topLevel.push(m);
      }
    }
    for (const list of replies.values()) list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return { threads: topLevel, repliesByParent: replies };
  }, [messages]);

  function toggleRecipient(id: string) {
    setRecipientIds((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    const res = await fetch("/api/board/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, recipientIds: recipientIds.length > 0 ? recipientIds : undefined }),
    });
    const data = await res.json().catch(() => ({}));
    setSending(false);
    if (!res.ok) {
      setError(data.message || "Could not post the message.");
      return;
    }
    setBody("");
    setRecipientIds([]);
    setPickerOpen(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSend} className="flex flex-col gap-3 rounded-xl border border-ink/10 bg-white p-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setPickerOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:bg-paper"
          >
            {recipientIds.length === 0 ? (
              <>
                <Users className="h-3.5 w-3.5" />
                Everyone
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5 text-blue-700" />
                {recipientNames.join(", ")}
              </>
            )}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          {pickerOpen && (
            <div className="absolute left-0 top-full z-10 mt-2 w-64 rounded-xl border border-ink/10 bg-white p-2 shadow-lg">
              <button
                type="button"
                onClick={() => setRecipientIds([])}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-ink/70 hover:bg-paper"
              >
                <Users className="h-4 w-4" />
                Everyone (public to the board)
              </button>
              <div className="my-1 h-px bg-ink/10" />
              {members.length === 0 ? (
                <p className="px-2.5 py-2 text-xs text-ink/40">No other active members yet.</p>
              ) : (
                members.map((m) => (
                  <label
                    key={m.id}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-ink/80 hover:bg-paper"
                  >
                    <input
                      type="checkbox"
                      checked={recipientIds.includes(m.id)}
                      onChange={() => toggleRecipient(m.id)}
                      className="h-4 w-4 rounded border-ink/30 text-blue-700 focus:ring-blue-700/30"
                    />
                    {m.name}
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={recipientIds.length > 0 ? "Write a private message…" : "Share an update with the board…"}
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
          {sending ? "Posting…" : recipientIds.length > 0 ? "Send Privately" : "Post Message"}
        </button>
      </form>

      {threads.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink/15 bg-paper p-6 text-center text-sm text-ink/50">
          No messages yet — be the first to share an update.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {threads.map((m) => (
            <Thread
              key={m.id}
              message={m}
              replies={repliesByParent.get(m.id) ?? []}
              currentUserId={currentUserId}
              isOwner={isOwner}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MessageRow({
  message,
  currentUserId,
  isOwner,
  onDeleted,
}: {
  message: MessageItem;
  currentUserId: string;
  isOwner: boolean;
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const isPrivate = message.recipient_ids !== null;

  async function handleDelete() {
    setDeleting(true);
    await fetch("/api/board/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: message.id }),
    });
    onDeleted();
    setDeleting(false);
  }

  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
        {initials(message.author_name)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2">
          <p className="font-semibold text-sm text-[#0b1f3a]">
            {message.author_name}
            <span className="ml-1.5 font-normal text-ink/40">
              {formatPositionLabel({ role: message.author_role, title: message.author_title })}
            </span>
          </p>
          <p className="text-xs text-ink/40">{formatRelativeDayTime(message.created_at)}</p>
        </div>
        {isPrivate && (
          <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-blue-700">
            <Lock className="h-3 w-3" />
            Private {message.recipient_names && message.recipient_names.length > 0 ? `to ${message.recipient_names.join(", ")}` : ""}
          </p>
        )}
        <p className="mt-1 whitespace-pre-wrap text-sm text-ink/80">{message.body}</p>
      </div>
      {(message.admin_user_id === currentUserId || (isOwner && !isPrivate)) && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          aria-label="Delete message"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-ink/30 transition-colors hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function Thread({
  message,
  replies,
  currentUserId,
  isOwner,
}: {
  message: MessageItem;
  replies: MessageItem[];
  currentUserId: string;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [replying, setReplying] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    const res = await fetch("/api/board/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: replyBody, parentMessageId: message.id }),
    });
    const data = await res.json().catch(() => ({}));
    setSending(false);
    if (!res.ok) {
      setError(data.message || "Could not send the reply.");
      return;
    }
    setReplyBody("");
    setReplying(false);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-4">
      <MessageRow message={message} currentUserId={currentUserId} isOwner={isOwner} onDeleted={() => router.refresh()} />

      {replies.length > 0 && (
        <div className="mt-3 flex flex-col gap-3 border-l-2 border-ink/10 pl-4">
          {replies.map((r) => (
            <MessageRow key={r.id} message={r} currentUserId={currentUserId} isOwner={isOwner} onDeleted={() => router.refresh()} />
          ))}
        </div>
      )}

      <div className="mt-3 pl-1">
        {replying ? (
          <form onSubmit={handleReply} className="flex flex-col gap-2">
            <textarea
              autoFocus
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Write a reply…"
              rows={2}
              className="w-full resize-none rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
            />
            {error && <p className="text-xs font-medium text-red-700">{error}</p>}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={sending || !replyBody.trim()}
                className="rounded-full bg-blue-700 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
              >
                {sending ? "Sending…" : "Send Reply"}
              </button>
              <button type="button" onClick={() => setReplying(false)} className="text-xs font-medium text-ink/50 hover:text-ink">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setReplying(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-ink/50 hover:text-blue-700"
          >
            <Reply className="h-3.5 w-3.5" />
            Reply
          </button>
        )}
      </div>
    </div>
  );
}
