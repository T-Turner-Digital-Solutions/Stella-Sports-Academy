import Image from "next/image";
import { PortalUserMenu } from "@/components/board/PortalUserMenu";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { findAdminUserById, formatPositionLabel } from "@/lib/admin-users";

export async function PortalHeader() {
  const session = await getCurrentAdminSession();
  const member = isDatabaseConfigured() && session ? await findAdminUserById(session.id) : null;
  const roleLabel = member ? formatPositionLabel(member) : session?.role === "owner" ? "Administrator" : "Board Member";

  return (
    <header className="bg-[#0b1f3a]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
            <Image src="/brand/stella-mark.png" alt="" width={1514} height={730} className="h-6 w-auto" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold uppercase tracking-wide text-white">Stellar Sports Academy</p>
            <p className="truncate text-xs text-white/60">Board Management Portal</p>
          </div>
        </div>
        <PortalUserMenu roleLabel={roleLabel} light />
      </div>
    </header>
  );
}
