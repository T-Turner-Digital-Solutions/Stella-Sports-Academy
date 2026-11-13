import { cn, formatDate } from "@/lib/utils";
import type { AdminUserRecord } from "@/lib/admin-users";
import { ToggleAdminActiveButton } from "@/components/admin/ToggleAdminActiveButton";

function memberStatus(user: AdminUserRecord) {
  if (!user.active) return { label: "Deactivated", className: "bg-ink/5 text-ink/40" };
  if (!user.password_hash) return { label: "Invite Pending", className: "bg-paper-dim text-ink/70" };
  return { label: "Active", className: "bg-red-100 text-red-700" };
}

export function TeamTable({
  members,
  currentUserId,
  canManage,
}: {
  members: AdminUserRecord[];
  currentUserId: string;
  canManage: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-wide text-ink/45">
            <th className="px-5 py-3">Name</th>
            <th className="px-5 py-3">Email</th>
            <th className="px-5 py-3">Role</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Last Sign In</th>
            {canManage && <th className="px-5 py-3">&nbsp;</th>}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => {
            const status = memberStatus(member);
            return (
              <tr key={member.id} className="border-b border-ink/5 last:border-0 hover:bg-paper">
                <td className="px-5 py-4 font-semibold text-ink">
                  {member.name}
                  {member.id === currentUserId && <span className="ml-2 text-xs font-normal text-ink/40">(you)</span>}
                </td>
                <td className="px-5 py-4 text-ink/70">{member.email}</td>
                <td className="px-5 py-4 text-ink/70 capitalize">{member.role}</td>
                <td className="px-5 py-4">
                  <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide", status.className)}>
                    {status.label}
                  </span>
                </td>
                <td className="px-5 py-4 text-ink/50">
                  {member.last_login_at ? formatDate(member.last_login_at) : "Never"}
                </td>
                {canManage && (
                  <td className="px-5 py-4">
                    {member.id !== currentUserId && (
                      <ToggleAdminActiveButton id={member.id} active={member.active} />
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
