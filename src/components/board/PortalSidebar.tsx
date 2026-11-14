"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FolderOpen, CalendarClock, BarChart3, CheckSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/board/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/board/corporate-records", label: "Corporate Records", icon: FolderOpen },
  { href: "/board/meetings", label: "Board Meetings", icon: CalendarClock },
  { href: "/board/financials", label: "Financials", icon: BarChart3 },
  { href: "/board/voting", label: "Voting & Approvals", icon: CheckSquare },
  { href: "/board/operations", label: "Board Operations", icon: Users },
];

export function PortalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-ink/10 bg-white py-6 lg:block">
      <nav className="flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-blue-700 text-white" : "text-ink/70 hover:bg-paper hover:text-ink"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

/** Horizontal, scrollable equivalent of the sidebar for narrow screens,
 * where the sidebar itself is hidden — without this, a phone/tablet
 * visitor has no way to move between sections at all. */
export function PortalMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-ink/10 bg-white px-4 py-3 lg:hidden">
      {navItems.map((item) => {
        const isActive = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors",
              isActive ? "bg-blue-700 text-white" : "bg-paper text-ink/70"
            )}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
