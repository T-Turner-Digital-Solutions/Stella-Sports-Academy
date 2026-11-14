import type { Metadata } from "next";
import Link from "next/link";
import { Users, KeyRound, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { leadership } from "@/content/leadership";

export const metadata: Metadata = { title: "Board Operations" };

export default function BoardOperationsPage() {
  return (
    <Container>
      <PortalPageHero title="Board Operations" description="Directory, tasks, committees, and policies." />

      <section>
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
            <Users className="h-4 w-4 text-blue-700" />
          </span>
          <h2 className="font-display text-lg uppercase tracking-wide text-ink">Board Directory</h2>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {leadership.map((leader) => (
            <div key={leader.name} className="rounded-2xl border border-ink/10 bg-white p-5">
              <p className="font-semibold text-ink">{leader.name}</p>
              <p className="mt-0.5 text-sm text-ink/60">{leader.roleLabel}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <Link
          href="/admin/change-password"
          className="group flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-5 transition-shadow hover:shadow-md"
        >
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
            <KeyRound className="h-5 w-5 text-blue-700" />
          </span>
          <div className="flex-1">
            <p className="font-display text-base uppercase tracking-wide text-ink">Account Settings</p>
            <p className="mt-0.5 text-sm text-ink/60">Update your name and password.</p>
          </div>
          <ArrowRight className="h-4 w-4 text-ink/40 transition-transform group-hover:translate-x-1" />
        </Link>
      </section>

      <section className="mt-8">
        <EmptyState
          icon={Users}
          title="Committees, Tasks & Policies Coming Soon"
          description="Committee assignments, task tracking, and confidentiality/conflict-of-interest acknowledgments will be added in a later stage of the portal."
        />
      </section>
    </Container>
  );
}
