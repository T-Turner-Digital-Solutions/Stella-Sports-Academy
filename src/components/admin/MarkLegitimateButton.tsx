"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function MarkLegitimateButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function markLegitimate() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/admin/contact-quarantine", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Could not update this submission.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" size="md" disabled={pending} onClick={markLegitimate} className="flex-shrink-0">
        <ShieldCheck className="h-4 w-4" />
        Mark Legitimate
      </Button>
      {error && <p className="text-xs font-medium text-red-700">{error}</p>}
    </div>
  );
}
