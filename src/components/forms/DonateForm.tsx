"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Field, TextInput, TextArea, Select, CheckboxField } from "@/components/forms/fields";
import { FormStatus } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";
import { postForm, type SubmitState } from "@/lib/forms-client";
import { presetAmounts, donationDesignations, type DonationFrequency, type DonationDesignation } from "@/content/donation";

export function DonateForm({
  initialDesignation,
  initialAmount,
  initialFrequency,
}: {
  initialDesignation?: string;
  initialAmount?: number;
  initialFrequency?: DonationFrequency;
}) {
  const [frequency, setFrequency] = useState<DonationFrequency>(initialFrequency ?? "one-time");
  const [amount, setAmount] = useState<number | null>(initialAmount ?? 100);
  const [customAmount, setCustomAmount] = useState("");
  const [designation, setDesignation] = useState<DonationDesignation>(
    (initialDesignation as DonationDesignation) &&
      donationDesignations.some((d) => d.value === initialDesignation)
      ? (initialDesignation as DonationDesignation)
      : "greatest-need"
  );
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [dedication, setDedication] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const effectiveAmount = customAmount ? Math.round(parseFloat(customAmount) * 100) : amount ? amount * 100 : 0;

  function selectPreset(value: number) {
    setAmount(value);
    setCustomAmount("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!effectiveAmount || effectiveAmount < 500) {
      setState({ status: "error", message: "Please select or enter a donation amount of at least $5." });
      return;
    }

    setState({ status: "submitting" });

    const result = await postForm("/api/donations/checkout", {
      amountCents: effectiveAmount,
      frequency,
      designation,
      donorName,
      donorEmail,
      anonymous,
      dedication,
    });

    if (!result.ok) {
      setState({ status: "error", message: result.message });
      return;
    }

    const url = result.data.url;
    if (typeof url === "string") {
      window.location.href = url;
    } else {
      setState({ status: "success", message: result.message });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div>
        <p className="mb-3 text-sm font-semibold text-ink">Frequency</p>
        <div className="inline-flex rounded-full border border-ink/15 bg-white p-1">
          {(["one-time", "monthly"] as DonationFrequency[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                frequency === f ? "bg-red-700 text-white" : "text-ink/60 hover:text-ink"
              )}
            >
              {f === "one-time" ? "One-Time" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-ink">Amount</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => selectPreset(preset)}
              className={cn(
                "rounded-xl border px-3 py-3 text-sm font-semibold transition-colors",
                amount === preset && !customAmount
                  ? "border-red-700 bg-red-100 text-red-700"
                  : "border-ink/15 text-ink/70 hover:border-red-700/40"
              )}
            >
              ${preset}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <TextInput
            type="number"
            min={5}
            step="0.01"
            placeholder="Custom amount ($)"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setAmount(null);
            }}
          />
        </div>
      </div>

      <Field label="Designate this gift to" htmlFor="designation">
        <Select
          id="designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value as DonationDesignation)}
        >
          {donationDesignations.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your Name" htmlFor="donorName" required>
          <TextInput id="donorName" required value={donorName} onChange={(e) => setDonorName(e.target.value)} />
        </Field>
        <Field label="Email" htmlFor="donorEmail" required>
          <TextInput
            id="donorEmail"
            type="email"
            required
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
          />
        </Field>
      </div>

      <Field label="Dedicate this gift (optional)" htmlFor="dedication" hint="e.g. In honor of, in memory of…">
        <TextArea id="dedication" value={dedication} onChange={(e) => setDedication(e.target.value)} />
      </Field>

      <CheckboxField
        id="anonymous"
        checked={anonymous}
        onChange={(e) => setAnonymous(e.target.checked)}
        label="Make this an anonymous donation"
      />

      <Button type="submit" size="lg" disabled={state.status === "submitting"}>
        {state.status === "submitting"
          ? "Redirecting to secure checkout…"
          : `Donate ${effectiveAmount ? `$${(effectiveAmount / 100).toLocaleString()}` : ""} ${frequency === "monthly" ? "Monthly" : "Now"}`}
      </Button>

      <p className="text-xs text-ink/45">
        Payment is processed securely by Stripe. Stella never stores your card details.
      </p>

      <FormStatus state={state} />
    </form>
  );
}
