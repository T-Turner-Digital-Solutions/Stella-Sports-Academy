import type { Metadata } from "next";
import { Users } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/db";
import { listAdminUsers } from "@/lib/admin-users";
import { getCurrentAdminSession } from "@/lib/auth";
import { DbNotConfigured } from "@/components/admin/DbNotConfigured";
import { TeamTable } from "@/components/admin/TeamTable";
import { InviteForm } from "@/components/admin/InviteForm";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Board Members" };

export default async function AdminTeamPage() {
  const dbReady = isDatabaseConfigured();
  const session = await getCurrentAdminSession();
  const members = dbReady ? await listAdminUsers() : [];
  const isOwner = session?.role === "owner";

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Board Members</h1>
      <p className="mt-1 text-sm text-ink/60">Everyone with access to this admin section.</p>

      <div className="mt-8 flex flex-col gap-6">
        {!dbReady ? (
          <DbNotConfigured />
        ) : (
          <>
            {isOwner && <InviteForm />}
            {members.length === 0 ? (
              <EmptyState icon={Users} title="No Board Members Yet" description="Board member accounts will appear here." />
            ) : (
              <TeamTable members={members} currentUserId={session?.id ?? ""} canManage={isOwner} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
