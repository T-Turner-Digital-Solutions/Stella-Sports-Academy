"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Video } from "lucide-react";
import { Field, TextInput, TextArea } from "@/components/forms/fields";
import { FormStatus } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";
import { postForm, type SubmitState } from "@/lib/forms-client";

export function BoardMeetingForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [zoomUrl, setZoomUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ status: "submitting" });

    const result = await postForm("/api/admin/board-meetings", {
      title,
      scheduledAt: new Date(scheduledAt).toISOString(),
      zoomUrl,
      notes,
    });

    if (result.ok) {
      setState({ status: "success", message: result.message });
      setTitle("");
      setScheduledAt("");
      setZoomUrl("");
      setNotes("");
      router.refresh();
    } else {
      setState({ status: "error", message: result.message });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
          <Video className="h-4 w-4 text-red-700" />
        </span>
        <h2 className="font-display text-lg uppercase tracking-wide text-ink">Schedule a Zoom Meeting</h2>
      </div>

      <Field label="Meeting Title" htmlFor="meeting-title" required>
        <TextInput id="meeting-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Date & Time" htmlFor="meeting-datetime" required>
          <TextInput
            id="meeting-datetime"
            type="datetime-local"
            required
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </Field>
        <Field label="Zoom Link" htmlFor="meeting-zoom-url" required hint="The real Zoom meeting URL board members will click to join.">
          <TextInput
            id="meeting-zoom-url"
            type="url"
            required
            placeholder="https://zoom.us/j/..."
            value={zoomUrl}
            onChange={(e) => setZoomUrl(e.target.value)}
          />
        </Field>
      </div>

      <Field label="Notes" htmlFor="meeting-notes" hint="Optional — agenda, dial-in info, etc.">
        <TextArea id="meeting-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>

      <Button type="submit" size="md" disabled={state.status === "submitting"} className="self-start">
        {state.status === "submitting" ? "Scheduling…" : "Schedule Meeting"}
      </Button>
      <FormStatus state={state} />
    </form>
  );
}
