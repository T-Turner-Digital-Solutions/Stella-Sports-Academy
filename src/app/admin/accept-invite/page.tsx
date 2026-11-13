import { Suspense } from "react";
import type { Metadata } from "next";
import { AcceptInviteForm } from "@/components/admin/AcceptInviteForm";

export const metadata: Metadata = { title: "Accept Invite" };

export default function AcceptInvitePage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <Suspense fallback={null}>
        <AcceptInviteForm />
      </Suspense>
    </div>
  );
}
