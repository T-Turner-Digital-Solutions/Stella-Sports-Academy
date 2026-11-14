import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Board Members Login" };

export default function BoardLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <Suspense fallback={null}>
        <LoginForm
          heading="Board Members Login"
          description="Stellar Sports Academy — private access for board members."
          defaultRedirect="/board"
          theme="blue"
        />
      </Suspense>
    </div>
  );
}
