import type { Metadata } from "next";
import Image from "next/image";
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
    <Container className="py-8">
      <div className="relative grid grid-cols-1 items-center gap-6 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-blue-100 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1fr_auto]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-50 sm:block"
          style={{
            background:
              "radial-gradient(circle at 85% 20%, rgba(59,130,246,0.35), transparent 45%), radial-gradient(circle at 60% 70%, rgba(37,99,235,0.25), transparent 50%)",
          }}
        />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
            Welcome{session?.name ? `, ${session.name}` : ""}
          </p>
          <h1 className="font-portal-heading mt-2 text-3xl text-ink sm:text-4xl">
            Stellar Sports Academy
            <br />
            <span className="text-blue-700">Board Member Portal</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-ink/60">
            Everything you need to govern, collaborate, and support the academy.
          </p>
          <div className="mt-5 h-1 w-16 rounded-full bg-blue-700" />
        </div>
        <div aria-hidden className="relative hidden w-48 justify-self-center lg:block lg:justify-self-end">
          <Image
            src="/brand/stella-lockup.png"
            alt=""
            width={1514}
            height={932}
            className="h-auto w-full drop-shadow-[0_0_30px_rgba(37,99,235,0.35)]"
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <SectionTile key={section.href} {...section} />
        ))}
      </div>
    </Container>
  );
}
