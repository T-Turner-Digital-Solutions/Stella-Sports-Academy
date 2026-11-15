import { PortalHeader } from "@/components/board/PortalHeader";
import { PortalSidebar, PortalMobileNav } from "@/components/board/PortalSidebar";

export default function BoardPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f9fc]">
      <PortalHeader />
      <PortalMobileNav />
      <div className="flex flex-1">
        <PortalSidebar />
        <main className="flex min-w-0 flex-1 flex-col py-5 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
