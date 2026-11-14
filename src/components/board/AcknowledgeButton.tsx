"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export function AcknowledgeButton({ documentId, initiallyAcknowledged }: { documentId: string; initiallyAcknowledged: boolean }) {
  const router = useRouter();
  const [acknowledged, setAcknowledged] = useState(initiallyAcknowledged);
  const [saving, setSaving] = useState(false);

  async function handleClick() {
    setSaving(true);
    const res = await fetch(`/api/board/documents/${documentId}/acknowledge`, { method: "POST" });
    if (res.ok) {
      setAcknowledged(true);
      router.refresh();
    }
    setSaving(false);
  }

  if (acknowledged) {
    return (
      <span className="flex items-center gap-1.5 text-sm font-medium text-ink/50">
        <CheckCircle2 className="h-4 w-4 text-red-700" />
        Acknowledged
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={saving}
      className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/70 transition-colors hover:bg-paper disabled:opacity-50"
    >
      {saving ? "Saving…" : "I Acknowledge"}
    </button>
  );
}
