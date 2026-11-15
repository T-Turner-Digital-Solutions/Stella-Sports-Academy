import { redirect } from "next/navigation";
import { AdminSidebar, AdminMobileNav } from "@/components/admin/AdminSidebar";
import { PortalHeader } from "@/components/board/PortalHeader";
import { getCurrentAdminSession } from "@/lib/auth";

// Website Administration (donations, applications, sponsorships, contact
// submissions, document uploads, financial goals, board member accounts) is
// owner-only — the Board Portal is every member's shared workspace, this is
// the organization's back office. A non-owner who navigates here directly is
// sent back to their actual home instead of seeing an empty shell.
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentAdminSession();
  if (!session || session.role !== "owner") {
    redirect("/board");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f9fc]">
      <PortalHeader subtitle="Website Administration" />
      <AdminMobileNav />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="min-w-0 flex-1 overflow-x-hidden px-6 py-8 sm:px-10 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
