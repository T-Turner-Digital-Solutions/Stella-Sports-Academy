"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EventPopupModal } from "@/components/layout/EventPopupModal";

/** The admin and board sections have their own layout/chrome (see
 * src/app/admin/layout.tsx and src/app/board/layout.tsx) — skip the public
 * nav/footer there instead of nesting one inside the other. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandalone = pathname?.startsWith("/admin") || pathname?.startsWith("/board");

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <>
      <EventPopupModal />
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
