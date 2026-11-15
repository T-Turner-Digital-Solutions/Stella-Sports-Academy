"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Field, TextInput } from "@/components/forms/fields";
import { FormStatus } from "@/components/forms/FormStatus";
import { postForm, type SubmitState } from "@/lib/forms-client";

const THEMES = {
  red: { badge: "bg-red-100", icon: "text-red-700", link: "text-red-700", button: "bg-red-700 hover:bg-red-800" },
  blue: { badge: "bg-blue-100", icon: "text-blue-700", link: "text-blue-700", button: "bg-blue-700 hover:bg-blue-800" },
} as const;

export function ForgotPasswordForm({
  loginHref = "/admin/login",
  loginLabel = "Back to sign in",
  theme = "red",
  heading = "Reset Password",
  description = "Enter your account email and we'll send a link to set a new password.",
  note,
  buttonLabel = "Send Reset Link",
}: {
  loginHref?: string;
  loginLabel?: string;
  /** "blue" matches the board portal's branding; "red" matches the admin backend. */
  theme?: "red" | "blue";
  heading?: string;
  description?: string;
  /** Extra line shown under the description — used on the board activation
   * page to make clear this only works for accounts the owner already
   * approved, not public self-registration. */
  note?: string;
  buttonLabel?: string;
}) {
  const t = THEMES[theme];
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
        <span className={`flex h-12 w-12 items-center justify-center rounded-full ${t.badge}`}>
          <KeyRound className={`h-6 w-6 ${t.icon}`} />
        </span>
        <h1 className="font-display text-2xl uppercase tracking-wide text-ink">{heading}</h1>
        <p className="text-sm text-ink/60">{description}</p>
        {note && <p className="text-xs text-ink/45">{note}</p>}
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
        <button
          type="submit"
          disabled={state.status === "submitting"}
          className={`rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${t.button}`}
        >
          {state.status === "submitting" ? "Sending…" : buttonLabel}
        </button>
        <FormStatus state={state} />
      </form>

      <p className="mt-4 text-center text-sm text-ink/60">
        <Link href={loginHref} className={`font-semibold hover:underline ${t.link}`}>
          {loginLabel}
        </Link>
      </p>
    </div>
  );
}
