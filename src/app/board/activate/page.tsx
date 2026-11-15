import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/admin/ForgotPasswordForm";

export const metadata: Metadata = { title: "Activate Your Account" };

// For pre-approved board/team members only — the owner adds each account
// from Admin → Team before anyone can activate it (see
// createPasswordResetToken in @/lib/admin-users). This same flow also
// covers a forgotten password later on, since both are just "email me a
// secure link to set my password" for an account that already exists.
export default function ActivateAccountPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <ForgotPasswordForm
        theme="blue"
        heading="Activate Your Account"
        description="Enter the email address Stellar Sports Academy has on file for you, and we'll send a secure link to set your password."
        note="For approved board and team members only — contact the board if you believe you should have access."
        buttonLabel="Send Activation Link"
        loginHref="/board/login"
        loginLabel="Already activated your account? Member Sign In"
      />
    </div>
  );
}
