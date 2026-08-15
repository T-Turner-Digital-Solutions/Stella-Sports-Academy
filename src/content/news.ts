export type NewsCategory =
  | "Athlete Achievements"
  | "Program Announcements"
  | "Events"
  | "Community Partnerships"
  | "Sponsor Announcements"
  | "Fundraising Updates"
  | "Grant Announcements"
  | "Scholarship News";

export type NewsPost = {
  slug: string;
  title: string;
  category: NewsCategory;
  date: string;
  excerpt: string;
  body: string[];
};

// Intentionally empty until the organization publishes real updates through
// the admin dashboard (Phase 2).
export const newsPosts: NewsPost[] = [];

export type StellarEvent = {
  slug: string;
  title: string;
  type:
    | "Training Camp"
    | "Clinic"
    | "Fundraiser"
    | "Community Event"
    | "Scholarship Event"
    | "Registration Event"
    | "Sponsor Event";
  date: string;
  time: string;
  location: string;
  description: string;
  registrationUrl?: string;
};

// Intentionally empty until real events are scheduled and confirmed.
export const events: StellarEvent[] = [];
