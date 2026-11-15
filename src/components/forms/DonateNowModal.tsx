"use client";

import { useRef, useState } from "react";
import { X, ExternalLink } from "lucide-react";
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

export function DonateNowModal() {
  const [open, setOpen] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(initial);
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function close() {
    setOpen(false);
    setForm(initial);
    setFieldErrors({});
    setState({ status: "idle" });
    if (logoInputRef.current) logoInputRef.current.value = "";
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
      const res = await fetch("/api/forms/corporate-donate-now", { method: "POST", body });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setState({ status: "error", message: data.message || "Something went wrong. Please try again." });
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        return;
      }

      setState({ status: "success", message: data.message || "Thank you!" });
      window.location.href = ZEFFY_GENERAL_DONATION_URL;
    } catch {
      setState({ status: "error", message: "Network error. Please check your connection and try again." });
    }
  }

  return (
    <>
      <Button type="button" size="lg" className="inline-flex items-center gap-2" onClick={() => setOpen(true)}>
        Donate Now
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-ink/60 p-4 pt-16 sm:pt-24"
          onClick={close}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-ink/10 bg-white p-6 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Donate Now</p>
                <h2 className="mt-1 font-display text-xl uppercase tracking-wide text-ink">Corporate Donation</h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-paper hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
              <HoneypotField value={website} onChange={setWebsite} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Company / Organization" htmlFor="d-company" required error={fieldErrors.companyName}>
                  <TextInput
                    id="d-company"
                    required
                    value={form.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                  />
                </Field>
                <Field label="Contact Name" htmlFor="d-contact" required error={fieldErrors.contactName}>
                  <TextInput
                    id="d-contact"
                    required
                    value={form.contactName}
                    onChange={(e) => update("contactName", e.target.value)}
                  />
                </Field>
                <Field label="Email" htmlFor="d-email" required error={fieldErrors.email}>
                  <TextInput
                    id="d-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </Field>
                <Field label="Phone" htmlFor="d-phone" hint="Optional">
                  <TextInput id="d-phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                </Field>
              </div>

              <Field label="Sponsorship Level" htmlFor="d-tier" hint="Optional">
                <Select id="d-tier" value={form.interestedTier} onChange={(e) => update("interestedTier", e.target.value)}>
                  <option value="">Not sure yet</option>
                  {stellarNightsSponsorshipTiers.map((tier) => (
                    <option key={tier.level} value={tier.level}>
                      {tier.level} — {tier.commitment}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Message" htmlFor="d-message" hint="Optional">
                <TextArea id="d-message" value={form.message} onChange={(e) => update("message", e.target.value)} />
              </Field>

              <Field
                label="Company Logo"
                htmlFor="d-logo"
                required
                error={fieldErrors.logo}
                hint="PNG, JPG, SVG, or WebP, up to 2 MB — used to recognize your sponsorship."
              >
                <input
                  ref={logoInputRef}
                  id="d-logo"
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
                className="inline-flex items-center justify-center gap-2"
              >
                {state.status === "submitting" ? "Submitting…" : "Donate with Zeffy to Receive Your Donation Letter"}
                {state.status !== "submitting" && <ExternalLink className="h-4 w-4" />}
              </Button>

              <FormStatus state={state} />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
