"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

// Stellar Nights — Dec 17, 2026, 6–9 PM. Stop showing the popup once the
// event day has passed; update (or remove) this block for the next event.
const EVENT_EXPIRES_AT = new Date("2026-12-18T00:00:00");
const DISMISS_KEY = "stellar-nights-2026-popup-dismissed";

export function EventPopupModal() {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (Date.now() >= EVENT_EXPIRES_AT.getTime()) return;

    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      // localStorage unavailable (private browsing, etc.) — show the popup anyway.
    }

    // Deferred a tick so this isn't a synchronous setState-in-effect (avoids
    // the cascading-render lint rule) — the modal still only ever appears
    // after mount, so there's no SSR/hydration mismatch either way.
    queueMicrotask(() => setOpen(true));
  }, []);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function close() {
    setOpen(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Ignore — worst case the popup reappears next visit.
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Stellar Nights event invitation"
        className="relative w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/60 text-white transition-colors hover:bg-ink/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X className="h-5 w-5" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/events/stellar-nights-2026.jpg"
          alt="You're invited to Stellar Nights — an evening of purpose, possibility, and impact. Thursday, December 17, 6:00–9:00 PM at Pinnacle Financial, 569 Brookwood Village Ste 705, Birmingham, AL 35209."
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}
