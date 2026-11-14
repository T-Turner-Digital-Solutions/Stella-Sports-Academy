import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { LogoutButton } from "@/components/admin/LogoutButton";

export function PortalHeader() {
  return (
    <header className="border-b border-ink/10 bg-white">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="hidden h-6 w-px bg-ink/15 sm:block" />
          <span className="hidden font-display text-sm uppercase tracking-wide text-blue-700 sm:block">
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
    </header>
  );
}
