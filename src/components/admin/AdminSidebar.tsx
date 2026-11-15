"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, UserRound, HeartHandshake, Building2, MessageSquare, Gift, Users, KeyRound, FileText, BarChart3, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/admin/LogoutButton";

// Board Meetings is deliberately absent here — scheduling, editing, and
// cancelling meetings lives only in the Board Portal (/board/meetings),
// which the owner already sees invite-restriction-free. A second entry
// here would just be a duplicate doorway to the same page.
const navItems = [
  { href: "/admin", label: "Website Administration", icon: LayoutGrid, exact: true },
  { href: "/admin/donations", label: "Donations", icon: Gift },
  { href: "/admin/applications", label: "Athlete Applications", icon: UserRound },
  { href: "/admin/volunteers", label: "Volunteers", icon: HeartHandshake },
  { href: "/admin/sponsorships", label: "Sponsorships", icon: Building2 },
  { href: "/admin/contact", label: "Contact Submissions", icon: MessageSquare },
  { href: "/admin/documents", label: "Corporate Records (Manage)", icon: FileText },
  { href: "/admin/financial-goals", label: "Financial Goals", icon: BarChart3 },
  { href: "/admin/team", label: "Board Members", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-ink/10 bg-white py-6 lg:flex">
      <div className="px-3 pb-4">
        <Link
          href="/board"
          className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 flex-shrink-0" />
          Back to Board Portal
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-red-700 text-white" : "text-ink/70 hover:bg-paper hover:text-ink"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 flex flex-col gap-1 border-t border-ink/10 px-3 pt-4">
        <Link
          href="/admin/change-password"
          className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-paper hover:text-ink"
        >
          <KeyRound className="h-4 w-4 flex-shrink-0" />
          Account Settings
        </Link>
        <LogoutButton
          redirectTo="/board/login"
          className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium text-ink/70 transition-colors hover:bg-paper hover:text-ink"
        />
      </div>
    </aside>
  );
}

/** Narrow-screen equivalent of the sidebar — same "Back to Board Portal"
 * escape hatch plus a horizontally-scrollable version of the same nav. */
export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <div className="border-b border-ink/10 bg-white px-4 py-3">
        <Link href="/board" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
          <ArrowLeft className="h-4 w-4" />
          Back to Board Portal
        </Link>
      </div>
      <nav className="flex gap-2 overflow-x-auto border-b border-ink/10 bg-white px-4 py-3">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors",
                active ? "bg-red-700 text-white" : "bg-paper text-ink/70"
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
