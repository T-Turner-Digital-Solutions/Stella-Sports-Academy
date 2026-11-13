"use client";

import { LogOut } from "lucide-react";

export function LogoutButton({
  redirectTo = "/admin/login",
  className,
}: {
  redirectTo?: string;
  className?: string;
}) {
  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    // A full page navigation, not router.push — the login/board pages can be
    // cached by the Next.js client router from before sign-out, and
    // navigating through it can land back on a stale authenticated render
    // even though the cookie was actually cleared. Reloading the page from
    // the server guarantees it sees the request with no session cookie.
    window.location.href = redirectTo;
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={
        className ??
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
      }
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </button>
  );
}
