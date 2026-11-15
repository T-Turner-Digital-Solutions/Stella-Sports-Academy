"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderOpen,
  CalendarClock,
  BarChart3,
  CheckSquare,
  Users,
  CalendarDays,
  NotebookPen,
  MessageCircle,
  HelpCircle,
  Video,
  Settings,
  LayoutGrid,
  FileSignature,
  HeartHandshake,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/admin/LogoutButton";

const navItems = [
  { href: "/board/dashboard", label: "Dashboard", icon: Home },
  { href: "/board/corporate-records", label: "Corporate Records", icon: FolderOpen },
  { href: "/board/meetings", label: "Board Meetings", icon: CalendarClock },
  { href: "/board/minutes", label: "Meeting Minutes", icon: FileSignature },
  { href: "/board/financials", label: "Financials", icon: BarChart3 },
  { href: "/board/corporate-donations", label: "Zeffy Corporate Donations", icon: HeartHandshake },
  { href: "/board/voting", label: "Voting & Approvals", icon: CheckSquare },
  { href: "/board/operations", label: "Board Operations", icon: Users },
  { href: "/board/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/board/notes", label: "My Notes", icon: NotebookPen },
  { href: "/board/messages", label: "Messages", icon: MessageCircle },
  { href: "/board/open-questions", label: "Open Questions", icon: HelpCircle },
  { href: "/board/external-meetings", label: "External Meetings", icon: Video },
];

export function PortalSidebar({ isOwner = false }: { isOwner?: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-ink/10 bg-white py-6 lg:flex">
      <nav className="flex flex-1 flex-col gap-1 px-3">
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

      <div className="mt-4 flex flex-col gap-1 border-t border-ink/10 px-3 pt-4">
        {isOwner && (
          <Link
            href="/admin"
            className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
          >
            <LayoutGrid className="h-4 w-4 flex-shrink-0" />
            Website Administration
          </Link>
        )}
        <Link
          href="/admin/change-password"
          className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-paper hover:text-ink"
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
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

/** Horizontal, scrollable equivalent of the sidebar for narrow screens,
 * where the sidebar itself is hidden — without this, a phone/tablet
 * visitor has no way to move between sections at all. Account Settings and
 * Sign Out are reachable from the header's account menu on every size, so
 * they're left out here to keep this bar scannable. */
export function PortalMobileNav({ isOwner = false }: { isOwner?: boolean }) {
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
      {isOwner && (
        <Link
          href="/admin"
          className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700"
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          Website Administration
        </Link>
      )}
    </nav>
  );
}
