"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, Plus, X } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { BoardSuggestion, SuggestionCategory, SuggestionStatus } from "@/lib/board-suggestions";

const CATEGORY_LABELS: Record<SuggestionCategory, string> = {
  fundraising: "Fundraising",
  programs: "Programs & Services",
  facilities: "Facilities",
  events: "Events & Outreach",
  partnerships: "Partnerships",
  other: "Other",
};

const STATUS_LABELS: Record<SuggestionStatus, string> = {
  submitted: "New",
  under_review: "Under Review",
  approved: "Approved",
  declined: "Declined",
  in_progress: "In Progress",
  completed: "Completed",
};

const STATUS_STYLES: Record<SuggestionStatus, string> = {
  submitted: "bg-blue-100 text-blue-700",
  under_review: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  declined: "bg-ink/10 text-ink/50",
  in_progress: "bg-green-100 text-green-700",
  completed: "bg-purple-100 text-purple-700",
};

const ALL_STATUSES = Object.keys(STATUS_LABELS) as SuggestionStatus[];
const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as SuggestionCategory[];

function SubmitSuggestionForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [category, setCategory] = useState<SuggestionCategory>("other");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    const res = await fetch("/api/board/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, title, description }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      router.refresh();
      onClose();
    } else {
      setStatus("error");
      setError(data.message || "Could not submit your suggestion.");
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-ink/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-portal-heading text-lg text-ink">Submit a Suggestion</h3>
          <button type="button" onClick={onClose} className="text-ink/40 hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-ink">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SuggestionCategory)}
              className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink focus:border-blue-700 focus:outline-none"
            >
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-ink">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink focus:border-blue-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink">Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink focus:border-blue-700 focus:outline-none"
            />
          </div>
          {status === "error" && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 hover:shadow-md disabled:opacity-50"
          >
            {status === "submitting" ? "Submitting…" : "Submit Suggestion"}
          </button>
        </form>
      </div>
    </div>
  );
}

export function BoardSuggestions({ suggestions, isOwner }: { suggestions: BoardSuggestion[]; isOwner: boolean }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: SuggestionStatus) {
    setUpdating(id);
    const res = await fetch(`/api/board/suggestions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) router.refresh();
    setUpdating(null);
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
            <Lightbulb className="h-4 w-4 text-blue-700" />
          </span>
          <div>
            <h2 className="font-portal-heading text-lg text-ink">Board Suggestions</h2>
            <p className="text-sm text-ink/50">Share ideas, improvements, and opportunities for the academy.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Submit a Suggestion
        </button>
      </div>

      <div className="mt-4">
        {suggestions.length === 0 ? (
          <EmptyState
            theme="blue"
            variant="flat"
            icon={Lightbulb}
            title="No Suggestions Yet"
            description="Ideas submitted by board members will appear here."
          />
        ) : (
          <div className="flex flex-col divide-y divide-ink/5">
            {suggestions.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{s.title}</p>
                  <p className="text-xs text-ink/50">{CATEGORY_LABELS[s.category]}</p>
                </div>
                {isOwner ? (
                  <select
                    value={s.status}
                    disabled={updating === s.id}
                    onChange={(e) => handleStatusChange(s.id, e.target.value as SuggestionStatus)}
                    className={`flex-shrink-0 rounded-full border-0 px-3 py-1.5 text-xs font-semibold ${STATUS_STYLES[s.status]}`}
                  >
                    {ALL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {STATUS_LABELS[st]}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${STATUS_STYLES[s.status]}`}>
                    {STATUS_LABELS[s.status]}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && <SubmitSuggestionForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
