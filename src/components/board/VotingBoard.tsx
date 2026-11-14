"use client";

import { useState } from "react";
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
} from "lucide-react";
import { StatCard } from "@/components/board/StatCard";

const CATEGORIES = [
  { key: "all", label: "All Votes & Approvals", icon: FileText },
  { key: "resolutions", label: "Resolutions", icon: Scale },
  { key: "policies", label: "Policies", icon: Shield },
  { key: "contracts", label: "Contracts", icon: FileSignature },
  { key: "other", label: "Other", icon: FolderOpen },
] as const;

export function VotingBoard() {
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]["key"]>("all");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 5000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={ClipboardCheck} label="Active Votes" value={0} />
        <StatCard icon={Scale} label="Approved" value={0} />
        <StatCard icon={Shield} label="Rejected" value={0} />
        <StatCard icon={FolderOpen} label="Closed" value={0} />
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
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                  activeCategory === c.key ? "bg-blue-700 text-white" : "border border-ink/10 bg-white text-ink/70 hover:bg-paper"
                }`}
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
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="bg-blue-900 text-xs font-bold uppercase tracking-wide text-white/80">
                  <th className="px-4 py-3">Title / Subject</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Voting Deadline</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center">
                    <ClipboardCheck className="mx-auto h-10 w-10 text-ink/20" strokeWidth={1.5} />
                    <p className="font-semibold mt-3 text-base text-[#0b1f3a]">No Votes or Approvals Yet</p>
                    <p className="mt-1 text-sm text-ink/50">
                      Create a new vote, resolution, or approval, or upload an existing document.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-ink/10 bg-white p-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Plus className="h-4 w-4 text-blue-700" />
              </span>
              <p className="font-semibold text-base text-[#0b1f3a]">Create New Vote / Approval</p>
            </div>
            <p className="mt-2 text-sm text-ink/50">Start a new board vote, resolution, or approval.</p>
            <button
              type="button"
              onClick={() =>
                showNotice(
                  "Setting this up safely needs your bylaws' quorum, voting eligibility, and approval rules first — tell Tabitha's team and we'll wire it up."
                )
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
            >
              <Plus className="h-4 w-4" />
              Create Vote / Approval
            </button>
          </div>

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
                  onClick={() => showNotice("Nothing to show yet — this fills in once votes or approvals exist.")}
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
