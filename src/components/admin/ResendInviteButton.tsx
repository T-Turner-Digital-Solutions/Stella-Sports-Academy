"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Only relevant for an account that hasn't accepted its invite yet — sends
 * a fresh invite email with a new 7-day link, for when the original was
 * missed, bounced, or expired. */
export function ResendInviteButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleClick() {
    setPending(true);
    const res = await fetch("/api/admin/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPending(false);
    if (res.ok) {
      setSent(true);
      router.refresh();
    }
  }

  if (sent) {
    return <span className="text-sm font-semibold text-green-700">Sent!</span>;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-sm font-semibold text-blue-700 hover:underline disabled:opacity-50"
    >
      {pending ? "Sending…" : "Resend Invite"}
    </button>
  );
}
