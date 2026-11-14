import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { ProfileNameForm } from "@/components/admin/ProfileNameForm";
import { getCurrentAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Account Settings" };

export default async function ChangePasswordPage() {
  const session = await getCurrentAdminSession();

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Account Settings</h1>
      <p className="mt-1 text-sm text-ink/60">Your name and password for this account.</p>
      <div className="mt-8 flex flex-col gap-6">
        <ProfileNameForm initialName={session?.name ?? ""} />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
