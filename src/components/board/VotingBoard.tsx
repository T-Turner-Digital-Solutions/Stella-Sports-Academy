"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Scale,
  Shield,
  FileSignature,
  FolderOpen,
  Search,
  Plus,
  Upload,
  Rocket,
  Printer,
  Mail,
  Download,
  History,
  ClipboardCheck,
  Check,
  X,
  Minus,
} from "lucide-react";
import { StatCard } from "@/components/board/StatCard";
import { formatDate, cn } from "@/lib/utils";
import type { BoardVote, BoardVoteResponse, VoteCategory, VoteStatus } from "@/lib/board-votes";

const CATEGORIES = [
  { key: "all", label: "All Votes & Approvals", icon: FileText },
  { key: "resolutions", label: "Resolutions", icon: Scale },
  { key: "policies", label: "Policies", icon: Shield },
  { key: "contracts", label: "Contracts", icon: FileSignature },
  { key: "other", label: "Other", icon: FolderOpen },
] as const;

const STATUS_STYLES: Record<VoteStatus, string> = {
  pending: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
  withdrawn: "bg-ink/10 text-ink/50",
};

const STATUS_LABELS: Record<VoteStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  declined: "Rejected",
  withdrawn: "Closed",
};

function tally(responses: BoardVoteResponse[]) {
  return {
    approve: responses.filter((r) => r.response === "approve").length,
    decline: responses.filter((r) => r.response === "decline").length,
    abstain: responses.filter((r) => r.response === "abstain").length,
  };
}

export function VotingBoard({
  votes,
  responsesByVote,
  currentUserId,
  isOwner,
}: {
  votes: BoardVote[];
  responsesByVote: Record<string, BoardVoteResponse[]>;
  currentUserId: string;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]["key"]>("all");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const [category, setCategory] = useState<VoteCategory>("resolutions");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [creating, setCreating] = useState(false);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 5000);
  }

  const filtered = useMemo(() => {
    return votes.filter((v) => {
      if (activeCategory !== "all" && v.category !== activeCategory) return false;
      if (search.trim() && !v.title.toLowerCase().includes(search.trim().toLowerCase())) return false;
      return true;
    });
  }, [votes, activeCategory, search]);

  const counts = {
    active: votes.filter((v) => v.status === "pending").length,
    approved: votes.filter((v) => v.status === "approved").length,
    rejected: votes.filter((v) => v.status === "declined").length,
    closed: votes.filter((v) => v.status === "withdrawn").length,
  };

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch("/api/board/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, title, description, dueDate }),
    });
    const data = await res.json().catch(() => ({}));
    setCreating(false);
    if (!res.ok) {
      showNotice(data.message || "Could not create it.");
      return;
    }
    setTitle("");
    setDescription("");
    setDueDate("");
    setShowForm(false);
    router.refresh();
  }

  async function handleRespond(voteId: string, response: "approve" | "decline" | "abstain") {
    setPendingAction(voteId + response);
    await fetch(`/api/board/votes/${voteId}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response }),
    });
    router.refresh();
    setPendingAction(null);
  }

  async function handleSetStatus(voteId: string, status: VoteStatus) {
    setPendingAction(voteId + status);
    await fetch(`/api/board/votes/${voteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setPendingAction(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={ClipboardCheck} label="Active Votes" value={counts.active} />
        <StatCard icon={Scale} label="Approved" value={counts.approved} />
        <StatCard icon={Shield} label="Rejected" value={counts.rejected} />
        <StatCard icon={FolderOpen} label="Closed" value={counts.closed} />
      </div>

      {notice && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">{notice}</div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setActiveCategory(c.key)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                  activeCategory === c.key ? "bg-blue-700 text-white" : "border border-ink/10 bg-white text-ink/70 hover:bg-paper"
                )}
              >
                <c.icon className="h-4 w-4" />
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
            <input
              type="search"
              placeholder="Search votes, resolutions, or approvals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-ink/15 bg-white py-2.5 pl-9 pr-4 text-sm text-ink focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
            />
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-ink/10 bg-white">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="bg-blue-900 text-xs font-bold uppercase tracking-wide text-white/80">
                  <th className="px-4 py-3">Title / Subject</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Responses</th>
                  <th className="px-4 py-3">Your Vote</th>
                  {isOwner && <th className="px-4 py-3">Decide</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={isOwner ? 7 : 6} className="px-4 py-14 text-center">
                      <ClipboardCheck className="mx-auto h-10 w-10 text-ink/20" strokeWidth={1.5} />
                      <p className="font-semibold mt-3 text-base text-[#0b1f3a]">No Votes or Approvals Yet</p>
                      <p className="mt-1 text-sm text-ink/50">
                        {isOwner
                          ? "Create a new vote, resolution, or approval using the panel on the right."
                          : "Nothing has been put up for a vote yet."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((v) => {
                    const responses = responsesByVote[v.id] ?? [];
                    const t = tally(responses);
                    const mine = responses.find((r) => r.admin_user_id === currentUserId)?.response ?? null;
                    return (
                      <tr key={v.id} className="border-b border-ink/5 last:border-0 align-top">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-ink">{v.title}</p>
                          {v.description && <p className="mt-0.5 max-w-xs text-xs text-ink/50">{v.description}</p>}
                        </td>
                        <td className="px-4 py-3 capitalize text-ink/70">{v.category}</td>
                        <td className="px-4 py-3 text-ink/70">{v.due_date ? formatDate(v.due_date) : "—"}</td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase", STATUS_STYLES[v.status])}>
                            {STATUS_LABELS[v.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-ink/60">
                          {t.approve} approve · {t.decline} decline · {t.abstain} abstain
                        </td>
                        <td className="px-4 py-3">
                          {v.status === "pending" ? (
                            <div className="flex gap-1">
                              <button
                                type="button"
                                title="Approve"
                                onClick={() => handleRespond(v.id, "approve")}
                                disabled={pendingAction === v.id + "approve"}
                                className={cn(
                                  "flex h-7 w-7 items-center justify-center rounded-full border transition-colors",
                                  mine === "approve" ? "border-green-600 bg-green-100 text-green-700" : "border-ink/15 text-ink/40 hover:bg-paper"
                                )}
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Decline"
                                onClick={() => handleRespond(v.id, "decline")}
                                disabled={pendingAction === v.id + "decline"}
                                className={cn(
                                  "flex h-7 w-7 items-center justify-center rounded-full border transition-colors",
                                  mine === "decline" ? "border-red-600 bg-red-100 text-red-700" : "border-ink/15 text-ink/40 hover:bg-paper"
                                )}
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Abstain"
                                onClick={() => handleRespond(v.id, "abstain")}
                                disabled={pendingAction === v.id + "abstain"}
                                className={cn(
                                  "flex h-7 w-7 items-center justify-center rounded-full border transition-colors",
                                  mine === "abstain" ? "border-ink/40 bg-ink/10 text-ink/70" : "border-ink/15 text-ink/40 hover:bg-paper"
                                )}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-ink/40">Closed</span>
                          )}
                        </td>
                        {isOwner && (
                          <td className="px-4 py-3">
                            {v.status === "pending" ? (
                              <div className="flex flex-col gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleSetStatus(v.id, "approved")}
                                  className="text-xs font-semibold text-green-700 hover:underline"
                                >
                                  Mark Approved
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetStatus(v.id, "declined")}
                                  className="text-xs font-semibold text-red-700 hover:underline"
                                >
                                  Mark Rejected
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetStatus(v.id, "withdrawn")}
                                  className="text-xs font-medium text-ink/40 hover:underline"
                                >
                                  Withdraw
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetStatus(v.id, "pending")}
                                className="text-xs font-medium text-ink/40 hover:underline"
                              >
                                Reopen
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {isOwner && (
            <div className="rounded-xl border border-ink/10 bg-white p-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <Plus className="h-4 w-4 text-blue-700" />
                </span>
                <p className="font-semibold text-base text-[#0b1f3a]">Create New Vote / Approval</p>
              </div>
              <p className="mt-2 text-sm text-ink/50">Start a new board vote, resolution, or approval.</p>
              {showForm ? (
                <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-2.5">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VoteCategory)}
                    className="rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-blue-700 focus:outline-none"
                  >
                    <option value="resolutions">Resolution</option>
                    <option value="policies">Policy</option>
                    <option value="contracts">Contract</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-blue-700 focus:outline-none"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description (optional)"
                    rows={2}
                    className="resize-none rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-blue-700 focus:outline-none"
                  />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-blue-700 focus:outline-none"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={creating}
                      className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
                    >
                      {creating ? "Creating…" : "Create"}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="text-sm font-medium text-ink/50 hover:text-ink">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
                >
                  <Plus className="h-4 w-4" />
                  Create Vote / Approval
                </button>
              )}
            </div>
          )}

          <div className="rounded-xl border border-ink/10 bg-white p-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Upload className="h-4 w-4 text-blue-700" />
              </span>
              <p className="font-semibold text-base text-[#0b1f3a]">Upload for Board Vote</p>
            </div>
            <p className="mt-2 text-sm text-ink/50">
              Upload a document (e.g. resolution, contract, policy) for board review and vote.
            </p>
            <button
              type="button"
              onClick={() => showNotice("Document upload for voting is coming in a later stage of the portal.")}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink/70 transition-colors hover:bg-paper"
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </button>
          </div>

          <div className="rounded-xl border border-ink/10 bg-white p-5">
            <div className="flex items-center gap-2.5">
              <Rocket className="h-4 w-4 text-blue-700" />
              <p className="font-semibold text-base text-[#0b1f3a]">Quick Actions</p>
            </div>
            <div className="mt-3 flex flex-col divide-y divide-ink/5">
              {[
                { icon: Printer, label: "Print Vote Summary" },
                { icon: Mail, label: "Email Vote / Approval" },
                { icon: Download, label: "Download Record" },
                { icon: History, label: "View Voting History" },
              ].map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => showNotice("Not built yet — coming in a later stage of the portal.")}
                  className="flex items-center justify-between gap-2 py-2.5 text-left text-sm font-medium text-ink/70 transition-colors hover:text-blue-700"
                >
                  <span className="flex items-center gap-2.5">
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
