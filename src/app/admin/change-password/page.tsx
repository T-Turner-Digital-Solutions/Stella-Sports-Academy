import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const metadata: Metadata = { title: "Change Password" };

export default function ChangePasswordPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Change Password</h1>
      <p className="mt-1 text-sm text-ink/60">Update the password for your own account.</p>
      <div className="mt-8">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
