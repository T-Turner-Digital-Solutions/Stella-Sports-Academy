import type { Metadata } from "next";
import Link from "next/link";
import { Users, KeyRound, ArrowRight, ClipboardList, CalendarDays, Lightbulb } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { StatCard } from "@/components/board/StatCard";
import { OperationsTabs } from "@/components/board/OperationsTabs";
import { leadership } from "@/content/leadership";
import { isDatabaseConfigured } from "@/lib/db";
import { getCurrentAdminSession } from "@/lib/auth";
import { listBoardSuggestions } from "@/lib/board-suggestions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Board Operations" };

export default async function BoardOperationsPage() {
  const dbReady = isDatabaseConfigured();
  const session = await getCurrentAdminSession();
  const suggestions = dbReady ? await listBoardSuggestions() : [];
  const openSuggestions = suggestions.filter((s) => s.status !== "completed" && s.status !== "declined").length;

  return (
    <>
      <PortalPageHero
        title="Board Operations"
        description="Manage board activities, committee work, operational tasks, and continuous improvement."
      />
      <Container className="py-8">
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={ClipboardList} label="Open Tasks" value={0} />
          <StatCard icon={Users} label="Active Committees" value={0} />
          <StatCard icon={CalendarDays} label="Upcoming Events" value={0} />
          <StatCard icon={Lightbulb} label="Suggestions" value={openSuggestions} />
        </div>

        <OperationsTabs suggestions={suggestions} isOwner={session?.role === "owner"} />

        <section className="mt-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
              <Users className="h-4 w-4 text-blue-700" />
            </span>
            <h2 className="font-portal-heading text-lg text-ink">Board Directory</h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {leadership.map((leader) => (
              <div key={leader.name} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                <p className="font-semibold text-ink">{leader.name}</p>
                <p className="mt-0.5 text-sm text-ink/60">{leader.roleLabel}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <Link
            href="/admin/change-password"
            className="group flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
              <KeyRound className="h-5 w-5 text-blue-700" />
            </span>
            <div className="flex-1">
              <p className="font-portal-heading text-base text-ink">Account Settings</p>
              <p className="mt-0.5 text-sm text-ink/60">Update your name and password.</p>
            </div>
            <ArrowRight className="h-4 w-4 text-ink/40 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>
      </Container>
    </>
  );
}
