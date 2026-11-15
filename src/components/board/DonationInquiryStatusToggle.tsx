"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { SubmissionStatus } from "@/lib/submissions";

export function DonationInquiryStatusToggle({ id, status }: { id: string; status: SubmissionStatus }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function setStatus(next: SubmissionStatus) {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/board/donation-inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Could not update status.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {status !== "reviewed" ? (
          <Button type="button" size="md" disabled={pending} onClick={() => setStatus("reviewed")} className="flex-shrink-0">
            <Check className="h-4 w-4" />
            Mark Reviewed
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="md"
            disabled={pending}
            onClick={() => setStatus("new")}
            className="flex-shrink-0 border border-ink/15"
          >
            <RotateCcw className="h-4 w-4" />
            Mark as New
          </Button>
        )}
        {status !== "archived" && (
          <Button
            type="button"
            variant="ghost"
            size="md"
            disabled={pending}
            onClick={() => setStatus("archived")}
            className="flex-shrink-0 border border-ink/15"
          >
            Archive
          </Button>
        )}
      </div>
      {error && <p className="text-xs font-medium text-red-700">{error}</p>}
    </div>
  );
}
