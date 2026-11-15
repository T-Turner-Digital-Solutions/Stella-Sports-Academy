"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Ban, RotateCcw } from "lucide-react";
import type { BoardMeeting } from "@/lib/board-meetings";
import { MeetingForm } from "@/components/board/MeetingForm";

type Member = { id: string; name: string };

export function MeetingCardActions({ meeting, members }: { meeting: BoardMeeting; members: Member[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);

  async function setStatus(status: "cancelled" | "scheduled") {
    const confirmed =
      status === "cancelled"
        ? window.confirm(`Cancel "${meeting.title}"? It stays in meeting history and everyone invited is notified.`)
        : true;
    if (!confirmed) return;
    setPending(true);
    await fetch("/api/admin/board-meetings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: meeting.id, status }),
    });
    router.refresh();
    setPending(false);
  }

  if (editing) {
    return (
      <div className="mt-4">
        <MeetingForm meeting={meeting} members={members} onDone={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div className="mt-4 flex items-center gap-4">
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="flex items-center gap-1.5 text-xs font-semibold text-ink/50 hover:text-ink"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </button>
      {meeting.status === "cancelled" ? (
        <button
          type="button"
          onClick={() => setStatus("scheduled")}
          disabled={pending}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline disabled:opacity-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reopen Meeting
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setStatus("cancelled")}
          disabled={pending}
          className="flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:underline disabled:opacity-50"
        >
          <Ban className="h-3.5 w-3.5" />
          Cancel Meeting
        </button>
      )}
    </div>
  );
}
