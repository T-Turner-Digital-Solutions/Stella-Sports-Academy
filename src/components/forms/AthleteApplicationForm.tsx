"use client";

import { useMemo, useState } from "react";
import {
  Field,
  TextInput,
  TextArea,
  Select,
  CheckboxField,
  CheckboxGroup,
  HoneypotField,
} from "@/components/forms/fields";
import { FormStatus } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";
import { postForm, type SubmitState } from "@/lib/forms-client";
import { programInterestValues } from "@/lib/validation";

const initial = {
  athleteFirstName: "",
  athleteLastName: "",
  dateOfBirth: "",
  school: "",
  grade: "",
  sport: "",
  position: "",
  currentTeam: "",
  parentName: "",
  parentEmail: "",
  parentPhone: "",
  financialAssistance: "" as "" | "yes" | "no",
  additionalInfo: "",
};

function calculateAge(dob: string) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 0 && age < 100 ? age : null;
}

export function AthleteApplicationForm() {
  const [form, setForm] = useState(initial);
  const [programInterest, setProgramInterest] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const age = useMemo(() => calculateAge(form.dateOfBirth), [form.dateOfBirth]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleInterest(value: string) {
    setProgramInterest((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ status: "submitting" });
    setFieldErrors({});

    const result = await postForm("/api/forms/athlete-application", {
      ...form,
      programInterest,
      consent,
      website,
    });

    if (result.ok) {
      setState({ status: "success", message: result.message });
      setForm(initial);
      setProgramInterest([]);
      setConsent(false);
    } else {
      setState({ status: "error", message: result.message });
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <HoneypotField value={website} onChange={setWebsite} />

      <fieldset className="flex flex-col gap-5">
        <legend className="font-display text-xl uppercase tracking-wide text-ink">Athlete Information</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="First Name" htmlFor="athleteFirstName" required error={fieldErrors.athleteFirstName}>
            <TextInput
              id="athleteFirstName"
              required
              value={form.athleteFirstName}
              onChange={(e) => update("athleteFirstName", e.target.value)}
            />
          </Field>
          <Field label="Last Name" htmlFor="athleteLastName" required error={fieldErrors.athleteLastName}>
            <TextInput
              id="athleteLastName"
              required
              value={form.athleteLastName}
              onChange={(e) => update("athleteLastName", e.target.value)}
            />
          </Field>
          <Field label="Date of Birth" htmlFor="dateOfBirth" required error={fieldErrors.dateOfBirth}>
            <TextInput
              id="dateOfBirth"
              type="date"
              required
              value={form.dateOfBirth}
              onChange={(e) => update("dateOfBirth", e.target.value)}
            />
          </Field>
          <Field label="Age" htmlFor="age" hint="Calculated automatically from date of birth">
            <TextInput id="age" value={age ?? ""} readOnly disabled placeholder="—" />
          </Field>
          <Field label="School" htmlFor="school" required error={fieldErrors.school}>
            <TextInput id="school" required value={form.school} onChange={(e) => update("school", e.target.value)} />
          </Field>
          <Field label="Grade" htmlFor="grade" required error={fieldErrors.grade}>
            <TextInput id="grade" required value={form.grade} onChange={(e) => update("grade", e.target.value)} />
          </Field>
          <Field label="Sport" htmlFor="sport" required error={fieldErrors.sport}>
            <TextInput id="sport" required value={form.sport} onChange={(e) => update("sport", e.target.value)} />
          </Field>
          <Field label="Position" htmlFor="position" hint="Optional">
            <TextInput id="position" value={form.position} onChange={(e) => update("position", e.target.value)} />
          </Field>
          <Field label="Current Team" htmlFor="currentTeam" hint="If applicable" className="sm:col-span-2">
            <TextInput
              id="currentTeam"
              value={form.currentTeam}
              onChange={(e) => update("currentTeam", e.target.value)}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="font-display text-xl uppercase tracking-wide text-ink">Parent / Guardian</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Parent / Guardian Name" htmlFor="parentName" required error={fieldErrors.parentName} className="sm:col-span-2">
            <TextInput
              id="parentName"
              required
              value={form.parentName}
              onChange={(e) => update("parentName", e.target.value)}
            />
          </Field>
          <Field label="Email" htmlFor="parentEmail" required error={fieldErrors.parentEmail}>
            <TextInput
              id="parentEmail"
              type="email"
              required
              value={form.parentEmail}
              onChange={(e) => update("parentEmail", e.target.value)}
            />
          </Field>
          <Field label="Phone" htmlFor="parentPhone" required error={fieldErrors.parentPhone}>
            <TextInput
              id="parentPhone"
              type="tel"
              required
              value={form.parentPhone}
              onChange={(e) => update("parentPhone", e.target.value)}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="font-display text-xl uppercase tracking-wide text-ink">Program Interest</legend>
        <CheckboxGroup
          legend="Select all that apply"
          name="programInterest"
          options={programInterestValues}
          selected={programInterest}
          onToggle={toggleInterest}
          error={fieldErrors.programInterest}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="font-display text-xl uppercase tracking-wide text-ink">Financial Assistance</legend>
        <Field label="Is financial assistance being requested?" htmlFor="financialAssistance" required error={fieldErrors.financialAssistance}>
          <Select
            id="financialAssistance"
            required
            value={form.financialAssistance}
            onChange={(e) => update("financialAssistance", e.target.value as "yes" | "no")}
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Select>
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="font-display text-xl uppercase tracking-wide text-ink">Additional Information</legend>
        <Field label="Anything else we should know?" htmlFor="additionalInfo">
          <TextArea
            id="additionalInfo"
            value={form.additionalInfo}
            onChange={(e) => update("additionalInfo", e.target.value)}
          />
        </Field>
      </fieldset>

      <CheckboxField
        id="application-consent"
        required
        checked={consent}
        onChange={(e) => setConsent(e.target.checked)}
        error={fieldErrors.consent}
        label="I am the parent/guardian of the athlete named above and I consent to submitting this application to Steller Sports Academy. I understand this information will be kept confidential and reviewed by authorized program staff only."
      />

      <Button type="submit" size="lg" disabled={state.status === "submitting"} className="self-start">
        {state.status === "submitting" ? "Submitting…" : "Submit Application"}
      </Button>

      <FormStatus state={state} />
    </form>
  );
}
