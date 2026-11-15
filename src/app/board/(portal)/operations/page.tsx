import type { Metadata } from "next";
import Link from "next/link";
import { Users, KeyRound, ArrowRight, ClipboardList, CalendarDays, Lightbulb } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { StatCard } from "@/components/board/StatCard";
import { OperationsTabs } from "@/components/board/OperationsTabs";
import { isDatabaseConfigured } from "@/lib/db";
import { getCurrentAdminSession } from "@/lib/auth";
import { listBoardSuggestions } from "@/lib/board-suggestions";
import { listAdminUsers, formatPositionLabel } from "@/lib/admin-users";
import { MigrationPendingNotice } from "@/components/board/MigrationPendingNotice";
import { MigrationNotAppliedError } from "@/lib/migration-guard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Board Operations" };

export default async function BoardOperationsPage() {
  const dbReady = isDatabaseConfigured();
  const session = await getCurrentAdminSession();

  let suggestions: Awaited<ReturnType<typeof listBoardSuggestions>> = [];
  let suggestionsUnavailable = false;
  if (dbReady) {
    try {
      suggestions = await listBoardSuggestions();
    } catch (error) {
      if (!(error instanceof MigrationNotAppliedError)) throw error;
      suggestionsUnavailable = true;
    }
  }
  const openSuggestions = suggestions.filter((s) => s.status !== "completed" && s.status !== "declined").length;
  // Real approved accounts, not the static public-site leadership file —
  // name and position only, nothing an active member couldn't already see
  // about themselves and their fellow members. No add/invite/delete
  // controls here; account management stays owner-only under Website
  // Administration -> Board Members.
  const members = dbReady ? (await listAdminUsers()).filter((m) => m.active) : [];

  return (
    <Container>
      <PortalPageHero
        title="Board Operations"
        description="Manage board activities, committee work, operational tasks, and continuous improvement."
      />
      <div className="mt-6">
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={ClipboardList} label="Open Tasks" value={0} />
          <StatCard icon={Users} label="Active Committees" value={0} />
          <StatCard icon={CalendarDays} label="Upcoming Events" value={0} />
          <StatCard icon={Lightbulb} label="Suggestions" value={suggestionsUnavailable ? "—" : openSuggestions} />
        </div>

        {suggestionsUnavailable ? (
          <MigrationPendingNotice feature="Suggestions" />
        ) : (
          <OperationsTabs suggestions={suggestions} isOwner={session?.role === "owner"} />
        )}

        <section className="mt-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
              <Users className="h-4 w-4 text-blue-700" />
            </span>
            <h2 className="font-semibold text-lg text-[#0b1f3a]">Board Directory</h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {members.length === 0 ? (
              <p className="text-sm text-ink/50">No active board member accounts yet.</p>
            ) : (
              members.map((member) => (
                <div key={member.id} className="rounded-xl border border-ink/10 bg-white p-5">
                  <p className="font-semibold text-ink">{member.name}</p>
                  <p className="mt-0.5 text-sm text-ink/60">{formatPositionLabel(member)}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-8">
          <Link
            href="/admin/change-password"
            className="group flex items-center gap-4 rounded-xl border border-ink/10 bg-white p-5 transition-colors hover:border-blue-200"
          >
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
              <KeyRound className="h-5 w-5 text-blue-700" />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-base text-[#0b1f3a]">Account Settings</p>
              <p className="mt-0.5 text-sm text-ink/60">Update your name and password.</p>
            </div>
            <ArrowRight className="h-4 w-4 text-ink/40 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>
      </div>
    </Container>
  );
}
