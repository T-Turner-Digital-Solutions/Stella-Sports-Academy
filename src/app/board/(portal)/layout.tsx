import { PortalHeader } from "@/components/board/PortalHeader";
import { PortalSidebar, PortalMobileNav } from "@/components/board/PortalSidebar";
import { getCurrentAdminSession } from "@/lib/auth";

export default async function BoardPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentAdminSession();
  const isOwner = session?.role === "owner";

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f9fc]">
      <PortalHeader />
      <PortalMobileNav isOwner={isOwner} />
      <div className="flex flex-1">
        <PortalSidebar isOwner={isOwner} />
        <main className="flex min-w-0 flex-1 flex-col py-5 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
