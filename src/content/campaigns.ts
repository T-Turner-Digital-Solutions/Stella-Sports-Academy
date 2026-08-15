export type CampaignDesignation =
  | "general"
  | "sponsor-an-athlete"
  | "athletic-programs"
  | "academic-programs"
  | "scholarship-fund"
  | "equipment-fund"
  | "current-campaign"
  | "greatest-need";

export type CampaignUpdate = {
  date: string;
  title: string;
  body: string;
};

export type Campaign = {
  slug: string;
  designation: CampaignDesignation;
  title: string;
  summary: string;
  story: string[];
  /**
   * Fundraising figures are intentionally real, not illustrative. Until the
   * organization supplies verified totals and a board-approved goal through
   * the admin dashboard (Phase 2), raised/donorCount stay at 0 and goalCents
   * stays null rather than showing an invented number.
   */
  goalCents: number | null;
  raisedCents: number;
  donorCount: number;
  status: "active" | "planned";
  deadline: string | null;
  updates: CampaignUpdate[];
};

export const campaigns: Campaign[] = [
  {
    slug: "sponsor-an-athlete",
    designation: "sponsor-an-athlete",
    title: "Sponsor an Athlete",
    summary:
      "Cover the cost of training, equipment, academic support, and mentorship for a young athlete who couldn't otherwise afford it.",
    story: [
      "Many of the young athletes Stellar works with face real financial barriers to quality coaching, equipment, and academic support. Sponsoring an athlete helps close that gap directly.",
      "Your sponsorship goes toward training, equipment, academic resources, and mentorship — the full picture of what it takes for a young athlete to succeed on the field and in the classroom.",
    ],
    goalCents: null,
    raisedCents: 0,
    donorCount: 0,
    status: "active",
    deadline: null,
    updates: [],
  },
  {
    slug: "equipment-fund",
    designation: "equipment-fund",
    title: "Stellar Equipment Fund",
    summary:
      "Help provide the training gear, uniforms, and safety equipment Stellar athletes need to train and compete safely.",
    story: [
      "Quality equipment isn't optional — it's part of how we keep athletes safe and give them the tools to develop properly.",
      "The Equipment Fund supports everything from training gear to safety equipment across Stellar's athletic programs.",
    ],
    goalCents: null,
    raisedCents: 0,
    donorCount: 0,
    status: "active",
    deadline: null,
    updates: [],
  },
  {
    slug: "summer-training",
    designation: "current-campaign",
    title: "Summer Training Fund",
    summary:
      "Support intensive summer training sessions focused on skill development, conditioning, and performance.",
    story: [
      "Summer is a critical development window for young athletes. This fund supports extended training access, coaching, and conditioning during the summer months.",
    ],
    goalCents: null,
    raisedCents: 0,
    donorCount: 0,
    status: "active",
    deadline: null,
    updates: [],
  },
];

export const plannedCampaignNames = [
  "College Scholarship Fund",
  "Youth Football Development",
  "Baseball Development Program",
  "Academic Success Fund",
  "Leadership Program",
  "Community Outreach",
  "Training Facility Fund",
];

export const designationLabels: Record<CampaignDesignation, string> = {
  general: "General Fund",
  "sponsor-an-athlete": "Sponsor an Athlete",
  "athletic-programs": "Athletic Programs",
  "academic-programs": "Academic Programs",
  "scholarship-fund": "Scholarship Fund",
  "equipment-fund": "Equipment Fund",
  "current-campaign": "Current Campaign",
  "greatest-need": "Greatest Need",
};
