"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ToggleAdminActiveButton({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    await fetch("/api/admin/team", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !active }),
    });
    setPending(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-sm font-semibold text-red-700 hover:underline disabled:opacity-50"
    >
      {pending ? "Working…" : active ? "Deactivate" : "Reactivate"}
    </button>
  );
}
