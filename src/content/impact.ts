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
