import { PortalHeader } from "@/components/board/PortalHeader";
import { PortalSidebar, PortalMobileNav } from "@/components/board/PortalSidebar";

export default function BoardPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader />
      <PortalMobileNav />
      <div className="flex flex-1">
        <PortalSidebar />
        <main className="flex-1 py-10">{children}</main>
      </div>
    </div>
  );
}
