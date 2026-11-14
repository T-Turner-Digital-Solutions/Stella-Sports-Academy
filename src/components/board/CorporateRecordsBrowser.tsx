"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileText, FolderOpen, Scale, ShieldCheck, Gavel, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StatCard } from "@/components/board/StatCard";
import {
  DOCUMENT_CATEGORY_LABELS,
  RECORD_GROUP_LABELS,
  RECORD_GROUP_DESCRIPTIONS,
  categoryToGroup,
  type BoardDocument,
  type RecordGroup,
} from "@/lib/board-documents-shared";

const SIDEBAR_GROUPS: RecordGroup[] = ["formation", "governance", "resolutions", "compliance", "other"];

export function CorporateRecordsBrowser({
  documents,
  acknowledgedIds,
}: {
  documents: BoardDocument[];
  acknowledgedIds: string[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState<RecordGroup | "all">("all");
  const [acking, setAcking] = useState<string | null>(null);
  const acknowledged = new Set(acknowledgedIds);

  const featured = documents.find((d) => d.category === "corporate-record-book");

  const countsByGroup = useMemo(() => {
    const counts: Record<RecordGroup, number> = {
      "corporate-record-book": 0,
      formation: 0,
      governance: 0,
      resolutions: 0,
      compliance: 0,
      other: 0,
    };
    for (const d of documents) counts[categoryToGroup(d.category)]++;
    return counts;
  }, [documents]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return documents.filter((d) => {
      if (activeGroup !== "all" && categoryToGroup(d.category) !== activeGroup) return false;
      if (!q) return true;
      return d.title.toLowerCase().includes(q) || DOCUMENT_CATEGORY_LABELS[d.category].toLowerCase().includes(q);
    });
  }, [documents, search, activeGroup]);

  async function handleAcknowledge(id: string) {
    setAcking(id);
    const res = await fetch(`/api/board/documents/${id}/acknowledge`, { method: "POST" });
    if (res.ok) router.refresh();
    setAcking(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={FolderOpen} label="Total Records" value={documents.length} />
        <StatCard icon={Scale} label="Governing Documents" value={countsByGroup.governance} />
        <StatCard icon={ShieldCheck} label="Compliance Filings" value={countsByGroup.compliance} />
        <StatCard icon={Gavel} label="Resolutions" value={countsByGroup.resolutions} />
      </div>

      {featured && (
        <Link
          href={`/board/documents/${featured.id}`}
          className="flex items-center gap-4 rounded-xl border-2 border-blue-700 bg-blue-50 p-5 transition-shadow"
        >
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-700">
            <FileText className="h-6 w-6 text-white" />
          </span>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Featured</p>
            <p className="font-semibold text-lg text-[#0b1f3a]">{featured.title}</p>
            <p className="text-sm text-ink/60">Version {featured.version} &middot; Effective {formatDate(featured.effective_date)}</p>
          </div>
          {acknowledged.has(featured.id) && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-blue-700">
              <CheckCircle2 className="h-4 w-4" />
              Acknowledged
            </span>
          )}
        </Link>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-semibold text-lg text-[#0b1f3a]">Corporate Records Library</h2>
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
              <input
                type="search"
                placeholder="Search records..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-ink/15 bg-white py-2 pl-9 pr-4 text-sm text-ink focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-ink/10 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="bg-blue-900 text-xs font-bold uppercase tracking-wide text-white/80">
                  <th className="px-4 py-3">Document Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Effective Date</th>
                  <th className="px-4 py-3">Version</th>
                  <th className="px-4 py-3">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-14 text-center">
                      <FileText className="mx-auto h-10 w-10 text-ink/20" strokeWidth={1.5} />
                      <p className="font-semibold mt-3 text-base text-[#0b1f3a]">
                        {documents.length === 0 ? "No Records Available" : "No Records Found"}
                      </p>
                      <p className="mt-1 text-sm text-ink/50">
                        {documents.length === 0
                          ? "Corporate records will appear here once they are uploaded and approved."
                          : "Try a different search or category."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((d, i) => (
                    <tr key={d.id} className={`border-b border-ink/5 last:border-0 ${i % 2 === 1 ? "bg-blue-50/40" : ""}`}>
                      <td className="px-4 py-3 font-semibold text-ink">{d.title}</td>
                      <td className="px-4 py-3 text-ink/60">{DOCUMENT_CATEGORY_LABELS[d.category]}</td>
                      <td className="px-4 py-3 text-ink/60">{formatDate(d.effective_date)}</td>
                      <td className="px-4 py-3 text-ink/60">v{d.version}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/board/documents/${d.id}`}
                            className="rounded-full bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-800"
                          >
                            View
                          </Link>
                          {acknowledged.has(d.id) ? (
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-blue-700" aria-label="Acknowledged" />
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAcknowledge(d.id)}
                              disabled={acking === d.id}
                              className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:bg-paper disabled:opacity-50"
                            >
                              {acking === d.id ? "Saving…" : "Acknowledge"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-[#0b1f3a]">Record Categories</h2>
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setActiveGroup("all")}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                activeGroup === "all" ? "border-blue-700 bg-blue-50" : "border-ink/10 bg-white hover:bg-paper"
              }`}
            >
              <span className="font-semibold text-ink">All Records</span>
              <span className="text-ink/50">{documents.length}</span>
            </button>
            {SIDEBAR_GROUPS.map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => setActiveGroup(group)}
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                  activeGroup === group ? "border-blue-700 bg-blue-50" : "border-ink/10 bg-white hover:bg-paper"
                }`}
              >
                <span>
                  <span className="block font-semibold text-ink">{RECORD_GROUP_LABELS[group]}</span>
                  <span className="block text-xs text-ink/50">{RECORD_GROUP_DESCRIPTIONS[group]}</span>
                </span>
                <span className="flex-shrink-0 text-ink/50">{countsByGroup[group]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
