"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Field, TextInput } from "@/components/forms/fields";
import { FormStatus } from "@/components/forms/FormStatus";
import { postForm, type SubmitState } from "@/lib/forms-client";

const THEMES = {
  red: {
    badge: "bg-red-100",
    icon: "text-red-700",
    heading: "font-display uppercase tracking-wide",
    button: "bg-red-700 hover:bg-red-800",
    link: "text-red-700",
  },
  blue: {
    badge: "bg-blue-100",
    icon: "text-blue-700",
    heading: "font-portal-heading",
    button: "bg-blue-700 hover:bg-blue-800",
    link: "text-blue-700",
  },
} as const;

export function LoginForm({
  heading = "Admin Sign In",
  description = "Stellar Sports Academy — internal review access only.",
  defaultRedirect = "/admin",
  theme = "red",
}: {
  heading?: string;
  description?: string;
  defaultRedirect?: string;
  /** "blue" matches the board portal's branding; "red" matches the admin backend. */
  theme?: "red" | "blue";
}) {
  const t = THEMES[theme];
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ status: "submitting" });

    const result = await postForm("/api/admin/login", { email, password });

    if (result.ok) {
      const redirect = searchParams.get("redirect") || defaultRedirect;
      router.push(redirect);
      router.refresh();
    } else {
      setState({ status: "error", message: result.message });
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className={`flex h-12 w-12 items-center justify-center rounded-full ${t.badge}`}>
          <ShieldCheck className={`h-6 w-6 ${t.icon}`} />
        </span>
        <h1 className={`${t.heading} text-2xl text-ink`}>{heading}</h1>
        <p className="text-sm text-ink/60">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-6">
        <Field label="Email" htmlFor="admin-email" required>
          <TextInput
            id="admin-email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Password" htmlFor="admin-password" required>
          <TextInput
            id="admin-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <button
          type="submit"
          disabled={state.status === "submitting"}
          className={`rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${t.button}`}
        >
          {state.status === "submitting" ? "Signing in…" : "Sign In"}
        </button>
        <FormStatus state={state} />
      </form>
      <p className="mt-4 text-center text-sm text-ink/60">
        <Link href="/admin/forgot-password" className={`font-semibold hover:underline ${t.link}`}>
          Forgot your password?
        </Link>
      </p>
    </div>
  );
}
