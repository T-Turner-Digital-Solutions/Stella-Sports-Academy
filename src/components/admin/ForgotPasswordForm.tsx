"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Field, TextInput } from "@/components/forms/fields";
import { FormStatus } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";
import { postForm, type SubmitState } from "@/lib/forms-client";

export function ForgotPasswordForm({ loginHref = "/admin/login" }: { loginHref?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ status: "submitting" });

    const result = await postForm("/api/admin/forgot-password", { email });
    setState({ status: result.ok ? "success" : "error", message: result.message });
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <KeyRound className="h-6 w-6 text-red-700" />
        </span>
        <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Reset Password</h1>
        <p className="text-sm text-ink/60">
          Enter your account email and we&rsquo;ll send a link to set a new password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-6">
        <Field label="Email" htmlFor="forgot-email" required>
          <TextInput
            id="forgot-email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Button type="submit" size="md" disabled={state.status === "submitting"}>
          {state.status === "submitting" ? "Sending…" : "Send Reset Link"}
        </Button>
        <FormStatus state={state} />
      </form>

      <p className="mt-4 text-center text-sm text-ink/60">
        <Link href={loginHref} className="font-semibold text-red-700 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
