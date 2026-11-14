"use client";

import { useState } from "react";
import {
  Gauge,
  ClipboardList,
  Users,
  Flag,
  CalendarDays,
  Lightbulb,
  Settings2,
  Building2,
  Handshake,
  ShieldCheck,
  Target,
} from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { BoardSuggestions } from "@/components/board/BoardSuggestions";
import type { BoardSuggestion } from "@/lib/board-suggestions";

const TABS = [
  { key: "overview", label: "Operations Overview", icon: Gauge },
  { key: "tasks", label: "Tasks & Action Items", icon: ClipboardList },
  { key: "committees", label: "Committees", icon: Users },
  { key: "programs", label: "Programs & Initiatives", icon: Flag },
  { key: "events", label: "Events", icon: CalendarDays },
  { key: "suggestions", label: "Suggestions", icon: Lightbulb },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const FOCUS_AREAS = [
  { icon: Settings2, title: "Policies & Procedures", description: "Manage and review operational policies" },
  { icon: Flag, title: "Programs", description: "Oversee academy programs and services" },
  { icon: Building2, title: "Facilities", description: "Equipment, space, and maintenance" },
  { icon: CalendarDays, title: "Events & Activities", description: "Plan and monitor board and academy events" },
  { icon: Handshake, title: "Partnerships", description: "Sponsorships, vendors, and community partners" },
  { icon: ShieldCheck, title: "Compliance", description: "Ensure organizational and regulatory compliance" },
];

export function OperationsTabs({ suggestions, isOwner }: { suggestions: BoardSuggestion[]; isOwner: boolean }) {
  const [active, setActive] = useState<TabKey>("overview");

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                isActive ? "bg-blue-700 text-white" : "border border-ink/10 bg-white text-ink/70 hover:bg-paper"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {active === "overview" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-ink/10 bg-white p-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                  <Target className="h-4 w-4 text-blue-700" />
                </span>
                <div>
                  <h2 className="font-portal-heading text-lg text-ink">Operational Focus</h2>
                  <p className="text-sm text-ink/50">Key operational areas that keep the academy running effectively.</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {FOCUS_AREAS.map((area) => (
                  <div key={area.title} className="rounded-xl border border-ink/10 bg-paper p-4">
                    <area.icon className="h-5 w-5 text-blue-700" strokeWidth={1.75} />
                    <p className="mt-2 font-semibold text-ink">{area.title}</p>
                    <p className="mt-1 text-xs text-ink/50">{area.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <BoardSuggestions suggestions={suggestions} isOwner={isOwner} />
          </div>
        )}

        {active === "suggestions" && <BoardSuggestions suggestions={suggestions} isOwner={isOwner} />}

        {(active === "tasks" || active === "committees" || active === "programs" || active === "events") && (
          <EmptyState
            theme="blue"
            icon={TABS.find((t) => t.key === active)!.icon}
            title="Coming Soon"
            description="This area of Board Operations will be built out in a later stage of the portal."
          />
        )}
      </div>
    </div>
  );
}
