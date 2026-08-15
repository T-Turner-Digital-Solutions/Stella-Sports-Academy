"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserRound, HeartHandshake, Building2, MessageSquare, Gift, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/admin/LogoutButton";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/donations", label: "Donations", icon: Gift },
  { href: "/admin/applications", label: "Athlete Applications", icon: UserRound },
  { href: "/admin/volunteers", label: "Volunteers", icon: HeartHandshake },
  { href: "/admin/sponsorships", label: "Sponsorships", icon: Building2 },
  { href: "/admin/contact", label: "Contact Submissions", icon: MessageSquare },
  { href: "/admin/team", label: "Board Members", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-shrink-0 flex-col bg-ink text-white">
      <div className="px-5 py-6">
        <p className="font-display text-lg uppercase tracking-wide text-white">Stellar Admin</p>
        <p className="mt-1 text-xs text-white/45">Submission review</p>
      </div>
      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-red-700 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <LogoutButton />
      </div>
    </aside>
  );
}
