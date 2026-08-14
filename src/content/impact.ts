export type ImpactStat = {
  key: string;
  label: string;
  /** Real verified value. Left null until the organization confirms a figure
   * through the admin dashboard (Phase 2) — never a placeholder number. */
  value: number | null;
  suffix?: string;
};

export const impactStats: ImpactStat[] = [
  { key: "athletes-served", label: "Athletes Served", value: null },
  { key: "training-hours", label: "Training Hours", value: null },
  { key: "mentor-connections", label: "Mentor Connections", value: null },
  { key: "scholarships-awarded", label: "Scholarships Awarded", value: null },
  { key: "community-service-hours", label: "Community Service Hours", value: null },
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
