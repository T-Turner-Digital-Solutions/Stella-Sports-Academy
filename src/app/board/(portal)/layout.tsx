import { PortalHeader } from "@/components/board/PortalHeader";

export default function BoardPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader />
      <main className="flex-1 py-10">{children}</main>
    </div>
  );
}
