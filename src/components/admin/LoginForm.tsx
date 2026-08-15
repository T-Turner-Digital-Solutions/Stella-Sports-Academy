"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Field, TextInput } from "@/components/forms/fields";
import { FormStatus } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";
import { postForm, type SubmitState } from "@/lib/forms-client";

export function LoginForm() {
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
      const redirect = searchParams.get("redirect") || "/admin";
      router.push(redirect);
      router.refresh();
    } else {
      setState({ status: "error", message: result.message });
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <ShieldCheck className="h-6 w-6 text-red-700" />
        </span>
        <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Admin Sign In</h1>
        <p className="text-sm text-ink/60">Stellar Sports Academy — internal review access only.</p>
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
        <Button type="submit" size="md" disabled={state.status === "submitting"}>
          {state.status === "submitting" ? "Signing in…" : "Sign In"}
        </Button>
        <FormStatus state={state} />
      </form>
    </div>
  );
}
