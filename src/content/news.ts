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

export const events: StellarEvent[] = [
  {
    slug: "stellar-nights-2026",
    title: "Stellar Nights",
    type: "Community Event",
    date: "2026-12-17",
    time: "6:00 PM – 9:00 PM",
    location: "Pinnacle Financial, 569 Brookwood Village Ste 705, Birmingham, AL 35209",
    description:
      "An evening of purpose, possibility & impact. Join us for a special holiday gathering as we celebrate the launch of Stellar Sports Academy and the bright future of young athletes.",
  },
];
