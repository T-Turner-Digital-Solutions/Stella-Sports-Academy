export type SponsorshipTier = {
  name: string;
  tagline: string;
  benefits: string[];
  featured?: boolean;
};

export const sponsorshipTiers: SponsorshipTier[] = [
  {
    name: "Community Sponsor",
    tagline: "Entry-level support for local businesses and individuals",
    benefits: ["Website recognition", "Social media recognition"],
  },
  {
    name: "Bronze Sponsor",
    tagline: "Growing your visibility while supporting Steller athletes",
    benefits: [
      "Website recognition",
      "Social media recognition",
      "Event recognition",
    ],
  },
  {
    name: "Silver Sponsor",
    tagline: "Meaningful, visible support across Steller's programs",
    benefits: [
      "Website recognition",
      "Social media recognition",
      "Event recognition",
      "Sponsor logo placement",
    ],
    featured: true,
  },
  {
    name: "Gold Sponsor",
    tagline: "Program-level partnership with elevated recognition",
    benefits: [
      "Website recognition",
      "Social media recognition",
      "Event recognition",
      "Sponsor logo placement",
      "Program sponsorship",
    ],
  },
  {
    name: "Champion Sponsor",
    tagline: "Steller's highest level of corporate partnership",
    benefits: [
      "Website recognition",
      "Social media recognition",
      "Event recognition",
      "Sponsor logo placement",
      "Program sponsorship",
      "Event sponsorship",
    ],
  },
];

export const athleteSponsorshipOptions = [
  {
    amount: "$25/month",
    description: "Contributes toward training access and program materials.",
  },
  {
    amount: "$50/month",
    description: "Contributes toward training, equipment, and academic resources.",
  },
  {
    amount: "$100/month",
    description: "Contributes toward training, equipment, academic support, and mentorship.",
  },
  {
    amount: "Full Athlete Sponsorship",
    description: "Covers the full range of an athlete's program costs. Contact us to discuss.",
  },
];

// Populated by administrators as partnerships are confirmed — no partner
// names are invented here.
export type Partner = {
  name: string;
  category: "Corporate" | "Community" | "School" | "Grant";
  logoUrl?: string;
  url?: string;
};

export const partners: Partner[] = [];
