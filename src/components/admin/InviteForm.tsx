"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Field, TextInput, Select } from "@/components/forms/fields";
import { FormStatus } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";
import { postForm, type SubmitState } from "@/lib/forms-client";

export function InviteForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"owner" | "member">("member");
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ status: "submitting" });

    const result = await postForm("/api/admin/invite", { name, email, role });

    if (result.ok) {
      setState({ status: "success", message: result.message });
      setName("");
      setEmail("");
      setRole("member");
      router.refresh();
    } else {
      setState({ status: "error", message: result.message });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-6"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
          <UserPlus className="h-4 w-4 text-red-700" />
        </span>
        <h2 className="font-display text-lg uppercase tracking-wide text-ink">Invite a Board Member</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="invite-name" required>
          <TextInput id="invite-name" required value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Email" htmlFor="invite-email" required>
          <TextInput
            id="invite-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
      </div>

      <Field
        label="Role"
        htmlFor="invite-role"
        hint="Owners can invite and deactivate other board members; members can review submissions and donations only."
      >
        <Select
          id="invite-role"
          value={role}
          onChange={(e) => setRole(e.target.value as "owner" | "member")}
        >
          <option value="member">Member</option>
          <option value="owner">Owner</option>
        </Select>
      </Field>

      <Button type="submit" size="md" disabled={state.status === "submitting"} className="self-start">
        {state.status === "submitting" ? "Sending Invite…" : "Send Invite"}
      </Button>
      <FormStatus state={state} />
    </form>
  );
}
