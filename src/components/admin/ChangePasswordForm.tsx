"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Field, TextInput } from "@/components/forms/fields";
import { FormStatus } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";
import { postForm, type SubmitState } from "@/lib/forms-client";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setState({ status: "error", message: "New passwords don't match." });
      return;
    }
    setState({ status: "submitting" });

    const result = await postForm("/api/admin/change-password", { currentPassword, newPassword });

    if (result.ok) {
      setState({ status: "success", message: result.message });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setState({ status: "error", message: result.message });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
          <KeyRound className="h-4 w-4 text-red-700" />
        </span>
        <h2 className="font-display text-lg uppercase tracking-wide text-ink">Change Password</h2>
      </div>

      <Field label="Current Password" htmlFor="current-password" required>
        <TextInput
          id="current-password"
          type="password"
          required
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </Field>
      <Field label="New Password" htmlFor="new-password" required hint="At least 8 characters.">
        <TextInput
          id="new-password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </Field>
      <Field label="Confirm New Password" htmlFor="confirm-new-password" required>
        <TextInput
          id="confirm-new-password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Field>

      <Button type="submit" size="md" disabled={state.status === "submitting"} className="self-start">
        {state.status === "submitting" ? "Updating…" : "Update Password"}
      </Button>
      <FormStatus state={state} />
    </form>
  );
}
