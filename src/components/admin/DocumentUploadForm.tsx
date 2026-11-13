"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Field, TextInput, TextArea, Select } from "@/components/forms/fields";
import { FormStatus } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";
import type { SubmitState } from "@/lib/forms-client";
import { DOCUMENT_CATEGORY_LABELS, type DocumentCategory } from "@/lib/board-documents-shared";

const CATEGORIES = Object.keys(DOCUMENT_CATEGORY_LABELS) as DocumentCategory[];

export function DocumentUploadForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<DocumentCategory>("corporate-record-book");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setState({ status: "error", message: "Choose a PDF to upload." });
      return;
    }

    setState({ status: "submitting" });

    const body = new FormData();
    body.set("file", file);
    body.set("category", category);
    body.set("title", title);
    body.set("description", description);

    try {
      const res = await fetch("/api/admin/documents", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState({ status: "error", message: data.message || "Something went wrong. Please try again." });
        return;
      }
      setState({ status: "success", message: data.message || "Document uploaded." });
      setTitle("");
      setDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    } catch {
      setState({ status: "error", message: "Network error. Please check your connection and try again." });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
          <Upload className="h-4 w-4 text-red-700" />
        </span>
        <h2 className="font-display text-lg uppercase tracking-wide text-ink">Upload a Record</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Category" htmlFor="doc-category" required>
          <Select
            id="doc-category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value as DocumentCategory)}
          >
            {CATEGORIES.map((key) => (
              <option key={key} value={key}>
                {DOCUMENT_CATEGORY_LABELS[key]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Title" htmlFor="doc-title" required>
          <TextInput id="doc-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
      </div>

      <Field label="Description" htmlFor="doc-description" hint="Optional — shown to board members alongside the file.">
        <TextArea id="doc-description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>

      <Field label="File" htmlFor="doc-file" required hint="PDF only, up to 4 MB.">
        <input
          ref={fileInputRef}
          id="doc-file"
          type="file"
          accept="application/pdf"
          required
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink file:mr-4 file:rounded-full file:border-0 file:bg-red-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-red-700"
        />
      </Field>

      <Button type="submit" size="md" disabled={state.status === "submitting"} className="self-start">
        {state.status === "submitting" ? "Uploading…" : "Upload"}
      </Button>
      <FormStatus state={state} />
    </form>
  );
}
