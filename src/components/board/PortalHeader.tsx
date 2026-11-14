import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { LogoutButton } from "@/components/admin/LogoutButton";

export function PortalHeader() {
  return (
    <header className="relative overflow-hidden border-b border-ink/10 bg-white">
      {/* Diagonal brand accent, top-right — matches the reference design */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-10 hidden h-32 w-40 bg-gradient-to-br from-blue-400 to-blue-700 opacity-90 sm:block"
        style={{ clipPath: "polygon(55% 0, 100% 0, 45% 100%, 0 100%)" }}
      />
      <div className="relative flex items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="hidden h-6 w-px bg-ink/15 sm:block" />
          <span className="hidden font-display text-sm uppercase tracking-wide text-ink sm:block">
            Board Management Portal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-ink/60 hover:text-ink">
            Back to Website
          </Link>
          <Link
            href="/admin/change-password"
            className="flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-ink"
          >
            <KeyRound className="h-4 w-4" />
            Account Settings
          </Link>
          <LogoutButton
            redirectTo="/board/login"
            className="flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-ink"
          />
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700" />
    </header>
  );
}
