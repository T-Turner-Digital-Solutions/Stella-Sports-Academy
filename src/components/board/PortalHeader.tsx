import { Logo } from "@/components/layout/Logo";
import { PortalUserMenu } from "@/components/board/PortalUserMenu";
import { getCurrentAdminSession } from "@/lib/auth";

export async function PortalHeader() {
  const session = await getCurrentAdminSession();
  const roleLabel = session?.role === "owner" ? "Administrator" : "Board Member";

  return (
    <header className="relative overflow-hidden border-b border-ink/10 bg-white">
      {/* Diagonal brand accent, top-right — matches the reference design */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-24 hidden h-40 w-32 bg-gradient-to-br from-blue-400 to-blue-700 sm:block"
        style={{ clipPath: "polygon(60% 0, 100% 0, 40% 100%, 0 100%)" }}
      />
      <div className="relative flex items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="hidden h-6 w-px bg-ink/15 sm:block" />
          <span className="font-portal-heading hidden text-base text-ink sm:block">Board Management Portal</span>
        </div>
        <PortalUserMenu roleLabel={roleLabel} />
      </div>
    </header>
  );
}
