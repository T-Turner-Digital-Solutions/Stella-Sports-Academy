import { PortalHeader } from "@/components/board/PortalHeader";
import { PortalSidebar, PortalMobileNav } from "@/components/board/PortalSidebar";
import { PortalWaveFooter } from "@/components/board/PortalWaveFooter";

export default function BoardPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader />
      <PortalMobileNav />
      <div className="flex flex-1">
        <PortalSidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          {children}
          <PortalWaveFooter />
        </main>
      </div>
    </div>
  );
}
