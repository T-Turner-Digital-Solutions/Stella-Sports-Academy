"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import { Field, TextInput } from "@/components/forms/fields";
import { FormStatus } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";
import { postForm, type SubmitState } from "@/lib/forms-client";

export function ProfileNameForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ status: "submitting" });
    const result = await postForm("/api/admin/profile", { name });
    if (result.ok) {
      setState({ status: "success", message: result.message });
      router.refresh();
    } else {
      setState({ status: "error", message: result.message });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
          <UserRound className="h-4 w-4 text-red-700" />
        </span>
        <h2 className="font-display text-lg uppercase tracking-wide text-ink">Your Name</h2>
      </div>

      <Field label="Name" htmlFor="profile-name" required hint="Shown on the board portal and in the member list.">
        <TextInput id="profile-name" required value={name} onChange={(e) => setName(e.target.value)} />
      </Field>

      <Button type="submit" size="md" disabled={state.status === "submitting"} className="self-start">
        {state.status === "submitting" ? "Saving…" : "Save Name"}
      </Button>
      <FormStatus state={state} />
    </form>
  );
}
