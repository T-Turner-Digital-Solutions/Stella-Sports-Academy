"use client";

import { useState } from "react";
import { Field, TextInput, TextArea, Select, HoneypotField } from "@/components/forms/fields";
import { FormStatus } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";
import { postForm, type SubmitState } from "@/lib/forms-client";
import { sponsorshipTiers } from "@/content/sponsorship";

const initial = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  interestedTier: "",
  message: "",
};

export function CorporateSponsorshipForm() {
  const [form, setForm] = useState(initial);
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ status: "submitting" });
    setFieldErrors({});

    const result = await postForm("/api/forms/corporate-sponsorship", { ...form, website });

    if (result.ok) {
      setState({ status: "success", message: result.message });
      setForm(initial);
    } else {
      setState({ status: "error", message: result.message });
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <HoneypotField value={website} onChange={setWebsite} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company / Organization" htmlFor="c-company" required error={fieldErrors.companyName}>
          <TextInput
            id="c-company"
            required
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
          />
        </Field>
        <Field label="Contact Name" htmlFor="c-contact" required error={fieldErrors.contactName}>
          <TextInput
            id="c-contact"
            required
            value={form.contactName}
            onChange={(e) => update("contactName", e.target.value)}
          />
        </Field>
        <Field label="Email" htmlFor="c-email" required error={fieldErrors.email}>
          <TextInput
            id="c-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </Field>
        <Field label="Phone" htmlFor="c-phone" hint="Optional">
          <TextInput id="c-phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </Field>
      </div>

      <Field label="Interested Sponsorship Level" htmlFor="c-tier" hint="Optional">
        <Select id="c-tier" value={form.interestedTier} onChange={(e) => update("interestedTier", e.target.value)}>
          <option value="">Not sure yet</option>
          {sponsorshipTiers.map((tier) => (
            <option key={tier.name} value={tier.name}>
              {tier.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Message" htmlFor="c-message" hint="Optional">
        <TextArea id="c-message" value={form.message} onChange={(e) => update("message", e.target.value)} />
      </Field>

      <Button type="submit" size="lg" disabled={state.status === "submitting"} className="self-start">
        {state.status === "submitting" ? "Submitting…" : "Become a Corporate Sponsor"}
      </Button>

      <FormStatus state={state} />
    </form>
  );
}
