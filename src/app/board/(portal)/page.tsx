import type { Metadata } from "next";
import { LayoutGrid, FolderOpen, CalendarClock, BarChart3, CheckSquare, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTile } from "@/components/board/SectionTile";
import { getCurrentAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Board Portal" };

const SECTIONS = [
  {
    href: "/board/dashboard",
    icon: LayoutGrid,
    title: "Dashboard",
    description: "Updates, action items, and key announcements",
  },
  {
    href: "/board/corporate-records",
    icon: FolderOpen,
    title: "Corporate Records",
    description: "Official record book, bylaws, and governance",
  },
  {
    href: "/board/meetings",
    icon: CalendarClock,
    title: "Board Meetings",
    description: "Agendas, minutes, and meeting schedule",
  },
  {
    href: "/board/financials",
    icon: BarChart3,
    title: "Financials",
    description: "Budgets, reports, and financial updates",
  },
  {
    href: "/board/voting",
    icon: CheckSquare,
    title: "Voting & Approvals",
    description: "Resolutions, decisions, and acknowledgments",
  },
  {
    href: "/board/operations",
    icon: Users,
    title: "Board Operations",
    description: "Directory, tasks, committees, and policies",
  },
] as const;

export default async function BoardPortalHubPage() {
  const session = await getCurrentAdminSession();

  return (
    <Container>
      <div className="overflow-hidden rounded-2xl bg-ink px-6 py-10 text-white sm:px-10 sm:py-14">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-300">
          Welcome{session?.name ? `, ${session.name}` : ""}
        </p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-wide text-white sm:text-4xl">
          Stellar Sports Academy
          <br />
          <span className="text-blue-400">Board Member Portal</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm text-white/60">
          Everything you need to govern, collaborate, and support the academy.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <SectionTile key={section.href} {...section} />
        ))}
      </div>
    </Container>
  );
}
