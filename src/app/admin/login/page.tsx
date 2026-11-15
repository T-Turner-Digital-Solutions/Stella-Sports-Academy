import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign In" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <Suspense fallback={null}>
        {/* The Board Management Portal is every signed-in account's primary
            workspace now, Website Administration a secondary area reached
            from inside it — so a plain sign-in (no ?redirect=) lands here
            regardless of which login page was used. */}
        <LoginForm defaultRedirect="/board" />
      </Suspense>
    </div>
  );
}
