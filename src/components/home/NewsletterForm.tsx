"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextInput, CheckboxField, HoneypotField } from "@/components/forms/fields";
import { FormStatus } from "@/components/forms/FormStatus";
import { postForm, type SubmitState } from "@/lib/forms-client";

export function NewsletterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ status: "submitting" });

    const result = await postForm("/api/forms/newsletter", {
      firstName,
      lastName,
      email,
      consent,
      website,
    });

    if (result.ok) {
      setState({ status: "success", message: result.message });
      setFirstName("");
      setLastName("");
      setEmail("");
      setConsent(false);
    } else {
      setState({ status: "error", message: result.message });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <HoneypotField value={website} onChange={setWebsite} />
      <div className="grid gap-3 sm:grid-cols-2">
        <TextInput
          aria-label="First name"
          placeholder="First name"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextInput
          aria-label="Last name"
          placeholder="Last name"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <TextInput
        aria-label="Email address"
        type="email"
        placeholder="Email address"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <CheckboxField
        id="newsletter-consent"
        label="I'd like to receive email updates from Stellar Sports Academy."
        required
        checked={consent}
        onChange={(e) => setConsent(e.target.checked)}
      />
      <Button type="submit" variant="primary" disabled={state.status === "submitting"} className="self-start">
        {state.status === "submitting" ? "Signing up…" : "Join the List"}
      </Button>
      <FormStatus state={state} />
    </form>
  );
}
