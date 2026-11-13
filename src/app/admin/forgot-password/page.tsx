import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/admin/ForgotPasswordForm";

export const metadata: Metadata = { title: "Reset Password" };

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <ForgotPasswordForm loginHref="/admin/login" />
    </div>
  );
}
