"use client";

import { useState } from "react";
import { Field, TextInput, TextArea, Select, HoneypotField } from "@/components/forms/fields";
import { FormStatus } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";
import { postForm, type SubmitState } from "@/lib/forms-client";
import { contactReasons } from "@/lib/validation";

const initial = {
  name: "",
  email: "",
  phone: "",
  inquiryType: "",
  message: "",
};

export function ContactForm({ initialReason }: { initialReason?: string }) {
  const [form, setForm] = useState({
    ...initial,
    inquiryType: contactReasons.includes(initialReason as (typeof contactReasons)[number])
      ? (initialReason as string)
      : "",
  });
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

    const result = await postForm("/api/forms/contact", { ...form, website });

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
        <Field label="Name" htmlFor="ct-name" required error={fieldErrors.name}>
          <TextInput id="ct-name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
        </Field>
        <Field label="Email" htmlFor="ct-email" required error={fieldErrors.email}>
          <TextInput
            id="ct-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </Field>
        <Field label="Phone" htmlFor="ct-phone" hint="Optional">
          <TextInput id="ct-phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </Field>
        <Field label="Inquiry Type" htmlFor="ct-type" required error={fieldErrors.inquiryType}>
          <Select id="ct-type" required value={form.inquiryType} onChange={(e) => update("inquiryType", e.target.value)}>
            <option value="" disabled>
              Select a reason
            </option>
            {contactReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Message" htmlFor="ct-message" required error={fieldErrors.message}>
        <TextArea id="ct-message" required value={form.message} onChange={(e) => update("message", e.target.value)} />
      </Field>

      <Button type="submit" size="lg" disabled={state.status === "submitting"} className="self-start">
        {state.status === "submitting" ? "Sending…" : "Send Message"}
      </Button>

      <FormStatus state={state} />
    </form>
  );
}
