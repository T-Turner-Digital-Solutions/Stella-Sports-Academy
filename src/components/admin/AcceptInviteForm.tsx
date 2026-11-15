"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Field, TextInput } from "@/components/forms/fields";
import { FormStatus } from "@/components/forms/FormStatus";
import { postForm, type SubmitState } from "@/lib/forms-client";

type InviteLookup =
  | { status: "loading" }
  | { status: "invalid" }
  | { status: "ready"; name: string; email: string };

const THEMES = {
  red: { badge: "bg-red-100", icon: "text-red-700", button: "bg-red-700 hover:bg-red-800" },
  blue: { badge: "bg-blue-100", icon: "text-blue-700", button: "bg-blue-700 hover:bg-blue-800" },
} as const;

export function AcceptInviteForm({
  theme = "red",
  afterAcceptRedirect = "/admin",
}: {
  /** "blue" matches the board portal's branding; "red" matches the admin backend. */
  theme?: "red" | "blue";
  afterAcceptRedirect?: string;
}) {
  const t = THEMES[theme];
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [lookup, setLookup] = useState<InviteLookup>(token ? { status: "loading" } : { status: "invalid" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  useEffect(() => {
    if (!token) return;
    fetch(`/api/admin/accept-invite?token=${encodeURIComponent(token)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setLookup({ status: "ready", name: data.name, email: data.email }))
      .catch(() => setLookup({ status: "invalid" }));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setState({ status: "error", message: "Passwords don't match." });
      return;
    }
    setState({ status: "submitting" });

    const result = await postForm("/api/admin/accept-invite", { token, password });

    if (result.ok) {
      router.push(afterAcceptRedirect);
      router.refresh();
    } else {
      setState({ status: "error", message: result.message });
    }
  }

  if (lookup.status === "loading") {
    return null;
  }

  if (lookup.status === "invalid") {
    return (
      <div className="mx-auto w-full max-w-sm rounded-2xl border border-ink/10 bg-white p-6 text-center">
        <p className="font-display text-lg uppercase tracking-wide text-ink">Invite Link Invalid</p>
        <p className="mt-2 text-sm text-ink/60">
          This invite link is invalid or has expired. Ask a board owner to send a new one.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className={`flex h-12 w-12 items-center justify-center rounded-full ${t.badge}`}>
          <UserPlus className={`h-6 w-6 ${t.icon}`} />
        </span>
        <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Set Your Password</h1>
        <p className="text-sm text-ink/60">
          Welcome, {lookup.name} — finish setting up your account for {lookup.email}.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-6">
        <Field label="Password" htmlFor="invite-password" required hint="At least 8 characters.">
          <TextInput
            id="invite-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field label="Confirm Password" htmlFor="invite-confirm-password" required>
          <TextInput
            id="invite-confirm-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Field>
        <button
          type="submit"
          disabled={state.status === "submitting"}
          className={`rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${t.button}`}
        >
          {state.status === "submitting" ? "Setting up…" : "Set Password & Sign In"}
        </button>
        <FormStatus state={state} />
      </form>
    </div>
  );
}
