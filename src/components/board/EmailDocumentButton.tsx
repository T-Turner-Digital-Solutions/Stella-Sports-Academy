"use client";

import { useState } from "react";
import { Mail, X } from "lucide-react";

export function EmailDocumentButton({ documentId }: { documentId: string }) {
  const [open, setOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const res = await fetch(`/api/board/documents/${documentId}/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientEmail, message }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus("error");
      setError(data.message || "Could not send the email. Please try again.");
      return;
    }
    setStatus("sent");
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
      >
        <Mail className="h-4 w-4" />
        Email
      </button>
    );
  }

  return (
    <div className="absolute right-0 top-full z-10 mt-2 w-80 rounded-xl border border-ink/10 bg-white p-4 text-left shadow-lg">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm uppercase tracking-wide text-ink">Email Document</p>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-ink/40 hover:text-ink">
          <X className="h-4 w-4" />
        </button>
      </div>

      {status === "sent" ? (
        <p className="mt-3 text-sm text-ink/70">Sent to {recipientEmail}.</p>
      ) : (
        <form onSubmit={handleSend} className="mt-3 flex flex-col gap-2.5">
          <input
            type="email"
            required
            placeholder="Recipient's board email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-red-700 focus:outline-none focus:ring-2 focus:ring-red-700/15"
          />
          <textarea
            placeholder="Optional message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-red-700 focus:outline-none focus:ring-2 focus:ring-red-700/15"
          />
          <p className="text-xs text-ink/40">Can only be sent to an active board member or administrator account.</p>
          {error && <p className="text-xs font-medium text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : "Send"}
          </button>
        </form>
      )}
    </div>
  );
}
