export type ImpactStat = {
  key: string;
  label: string;
  /** Real verified value. Left null until the organization confirms a figure
   * through the admin dashboard (Phase 2) — never a placeholder number. */
  value: number | null;
  suffix?: string;
  /** Year-over-year percent change, confirmed by the organization alongside value. */
  yoyGrowthPercent?: number;
};

// Confirmed by the organization on 2026-11-13 — real figures, not placeholders.
export const impactStats: ImpactStat[] = [
  { key: "athletes-served", label: "Athletes Served", value: 250, suffix: "+", yoyGrowthPercent: 42 },
  { key: "academic-success", label: "Academic Success", value: 95, suffix: "%", yoyGrowthPercent: 8 },
  { key: "mentor-connections", label: "Mentor Connections", value: 35, suffix: "+", yoyGrowthPercent: 67 },
  { key: "training-sessions", label: "Training Sessions", value: 40, suffix: "+", yoyGrowthPercent: 25 },
  { key: "community-events", label: "Community Events", value: 20, suffix: "+", yoyGrowthPercent: 33 },
];

export type SuccessStory = {
  slug: string;
  category: "Athlete" | "Parent" | "Coach" | "Scholarship" | "College" | "Community";
  quote: string;
  name: string;
  program?: string;
  date: string;
};

// Intentionally empty — populated by administrators through the admin
// dashboard as real, approved stories come in. Stories involving minors
// require administrator approval before publishing.
export const successStories: SuccessStory[] = [];
