import { Suspense } from "react";
import type { Metadata } from "next";
import { AcceptInviteForm } from "@/components/admin/AcceptInviteForm";

export const metadata: Metadata = { title: "Set Your Password" };

export default function BoardAcceptInvitePage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <Suspense fallback={null}>
        <AcceptInviteForm theme="blue" afterAcceptRedirect="/board" />
      </Suspense>
    </div>
  );
}
