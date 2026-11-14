"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, KeyRound, Globe, UserCircle2 } from "lucide-react";
import { LogoutButton } from "@/components/admin/LogoutButton";

export function PortalUserMenu({ roleLabel }: { roleLabel: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        aria-label="Notifications"
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-paper hover:text-ink"
      >
        <Bell className="h-5 w-5" />
      </button>
      <span className="hidden h-6 w-px bg-ink/15 sm:block" />
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-blue-700"
        >
          <UserCircle2 className="h-6 w-6 text-ink/70" strokeWidth={1.5} />
          <span className="hidden sm:inline">{roleLabel}</span>
          <ChevronDown className={`h-4 w-4 text-ink/50 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-ink/10 bg-white py-1.5 shadow-lg">
            <Link
              href="/admin/change-password"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-paper hover:text-ink"
              onClick={() => setOpen(false)}
            >
              <KeyRound className="h-4 w-4" />
              Account Settings
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-paper hover:text-ink"
              onClick={() => setOpen(false)}
            >
              <Globe className="h-4 w-4" />
              Back to Website
            </Link>
            <div className="my-1 h-px bg-ink/10" />
            <LogoutButton
              redirectTo="/board/login"
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-ink/70 transition-colors hover:bg-paper hover:text-ink"
            />
          </div>
        )}
      </div>
    </div>
  );
}
