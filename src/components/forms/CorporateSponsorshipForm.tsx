"use client";

import { useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Field, TextInput, TextArea, Select, HoneypotField } from "@/components/forms/fields";
import { FormStatus } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";
import type { SubmitState } from "@/lib/forms-client";
import { stellarNightsSponsorshipTiers } from "@/content/sponsorship";
import { ZEFFY_GENERAL_DONATION_URL } from "@/content/zeffy";

const initial = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  interestedTier: "",
  message: "",
};

export function CorporateSponsorshipForm() {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(initial);
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const logo = logoInputRef.current?.files?.[0];
    if (!logo) {
      setState({ status: "error", message: "Please upload your company logo." });
      setFieldErrors({ logo: "Company logo is required." });
      return;
    }

    setState({ status: "submitting" });
    setFieldErrors({});

    const body = new FormData();
    for (const [key, value] of Object.entries(form)) body.set(key, value);
    body.set("website", website);
    body.set("logo", logo);

    try {
      const res = await fetch("/api/forms/corporate-sponsorship", { method: "POST", body });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setState({ status: "error", message: data.message || "Something went wrong. Please try again." });
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        return;
      }

      setForm(initial);
      if (logoInputRef.current) logoInputRef.current.value = "";
      setState({ status: "success", message: data.message || "Thank you — your submission was received." });
      // No dedicated fixed-amount Zeffy page exists per tier (those need
      // to be set up individually in the organization's Zeffy dashboard),
      // so every sponsor goes to the general giving page to complete their
      // gift after their inquiry is recorded.
      window.location.href = ZEFFY_GENERAL_DONATION_URL;
    } catch {
      setState({ status: "error", message: "Network error. Please check your connection and try again." });
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
          {stellarNightsSponsorshipTiers.map((tier) => (
            <option key={tier.level} value={tier.level}>
              {tier.level} — {tier.commitment}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Message" htmlFor="c-message" hint="Optional">
        <TextArea id="c-message" value={form.message} onChange={(e) => update("message", e.target.value)} />
      </Field>

      <Field
        label="Company Logo"
        htmlFor="c-logo"
        required
        error={fieldErrors.logo}
        hint="PNG, JPG, SVG, or WebP, up to 2 MB — used to recognize your sponsorship."
      >
        <input
          ref={logoInputRef}
          id="c-logo"
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          required
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink file:mr-4 file:rounded-full file:border-0 file:bg-red-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-red-700"
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={state.status === "submitting"}
        className="inline-flex items-center gap-2 self-start"
      >
        {state.status === "submitting" ? "Submitting…" : "Become a Corporate Sponsor"}
        {state.status !== "submitting" && <ExternalLink className="h-4 w-4" />}
      </Button>
      <p className="text-xs text-ink/45">
        You&rsquo;ll be taken to Stellar&rsquo;s secure Zeffy giving page to complete your sponsorship after
        submitting.
      </p>

      <FormStatus state={state} />
    </form>
  );
}
