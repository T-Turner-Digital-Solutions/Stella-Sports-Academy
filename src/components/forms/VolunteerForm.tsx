"use client";

import { useState } from "react";
import { Field, TextInput, TextArea, Select, CheckboxField, HoneypotField } from "@/components/forms/fields";
import { FormStatus } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";
import { postForm, type SubmitState } from "@/lib/forms-client";
import { volunteerCategories } from "@/lib/validation";

const initial = {
  name: "",
  email: "",
  phone: "",
  areaOfInterest: "",
  experience: "",
  availability: "",
  message: "",
};

export function VolunteerForm() {
  const [form, setForm] = useState(initial);
  const [consent, setConsent] = useState(false);
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

    const result = await postForm("/api/forms/volunteer", { ...form, consent, website });

    if (result.ok) {
      setState({ status: "success", message: result.message });
      setForm(initial);
      setConsent(false);
    } else {
      setState({ status: "error", message: result.message });
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <HoneypotField value={website} onChange={setWebsite} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="v-name" required error={fieldErrors.name}>
          <TextInput id="v-name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
        </Field>
        <Field label="Email" htmlFor="v-email" required error={fieldErrors.email}>
          <TextInput
            id="v-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </Field>
        <Field label="Phone" htmlFor="v-phone" required error={fieldErrors.phone}>
          <TextInput
            id="v-phone"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </Field>
        <Field label="Area of Interest" htmlFor="v-interest" required error={fieldErrors.areaOfInterest}>
          <Select
            id="v-interest"
            required
            value={form.areaOfInterest}
            onChange={(e) => update("areaOfInterest", e.target.value)}
          >
            <option value="" disabled>
              Select an area
            </option>
            {volunteerCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Relevant Experience" htmlFor="v-experience" hint="Optional">
        <TextArea id="v-experience" value={form.experience} onChange={(e) => update("experience", e.target.value)} />
      </Field>

      <Field label="Availability" htmlFor="v-availability" required error={fieldErrors.availability}>
        <TextInput
          id="v-availability"
          required
          placeholder="e.g. Weeknights, Saturday mornings…"
          value={form.availability}
          onChange={(e) => update("availability", e.target.value)}
        />
      </Field>

      <Field label="Message" htmlFor="v-message" hint="Optional">
        <TextArea id="v-message" value={form.message} onChange={(e) => update("message", e.target.value)} />
      </Field>

      <CheckboxField
        id="volunteer-consent"
        required
        checked={consent}
        onChange={(e) => setConsent(e.target.checked)}
        error={fieldErrors.consent}
        label="I consent to Stella Sports Academy contacting me about volunteer opportunities."
      />

      <Button type="submit" size="lg" disabled={state.status === "submitting"} className="self-start">
        {state.status === "submitting" ? "Submitting…" : "Submit Application"}
      </Button>

      <FormStatus state={state} />
    </form>
  );
}
