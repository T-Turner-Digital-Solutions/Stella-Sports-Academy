import { Users, Award, Trophy, Medal, Crown, type LucideIcon } from "lucide-react";

export type SponsorshipTier = {
  name: string;
  price: string;
  tagline: string;
  benefits: string[];
  icon: LucideIcon;
  featured?: boolean;
  /** Zeffy has no public API for pre-filling a donation amount by URL, so a
   * fixed-amount checkout needs its own hosted Zeffy page per tier, set up
   * in the organization's Zeffy dashboard. Left undefined until the client
   * provides that tier's link — the site stays honest about what isn't
   * wired up yet rather than guessing at a URL that won't work. */
  zeffyUrl?: string;
};

export const sponsorshipTiers: SponsorshipTier[] = [
  {
    name: "Corporate Partner",
    price: "$1,000/Year",
    tagline: "Launch your corporate support for young athletes and programs.",
    icon: Users,
    benefits: ["Website recognition", "Social media recognition", "Event recognition"],
  },
  {
    name: "Bronze Corporate Sponsor",
    price: "$2,500/Year",
    tagline: "Increase your visibility and make a greater impact across our programs.",
    icon: Award,
    benefits: [
      "Website recognition",
      "Social media recognition",
      "Event recognition",
      "Sponsor logo placement",
    ],
  },
  {
    name: "Silver Corporate Sponsor",
    price: "$5,000/Year",
    tagline: "Provide meaningful, sustained support for athlete development, academics, and mentorship.",
    icon: Trophy,
    benefits: [
      "Website recognition",
      "Social media recognition",
      "Event recognition",
      "Sponsor logo placement",
      "Program sponsorship",
    ],
    featured: true,
  },
  {
    name: "Gold Corporate Sponsor",
    price: "$10,000/Year",
    tagline: "A premier partnership that helps expand programs and create new opportunities.",
    icon: Medal,
    benefits: [
      "Website recognition",
      "Social media recognition",
      "Event recognition",
      "Sponsor logo placement",
      "Program sponsorship",
    ],
  },
  {
    name: "Champion Corporate Sponsor",
    price: "$25,000/Year",
    tagline: "Our highest corporate partnership with maximum visibility, impact, and program leadership.",
    icon: Crown,
    benefits: [
      "Website recognition",
      "Social media recognition",
      "Event recognition",
      "Premier logo placement",
      "Program sponsorship",
      "Featured partner recognition",
    ],
  },
];

export type StellarNightsSponsorshipTier = {
  level: string;
  commitment: string;
  recognition: string;
};

export const stellarNightsIntro = {
  eventDate: "December 17, 2026",
  heading: "Sponsor Stellar Nights on December 17, 2026, and invest in Stellar Sports Academy beyond the event.",
  body: "Your support will help make this fundraising evening possible while advancing our state-of-the-art facility and youth programs. Each level combines event recognition with acknowledgment during the ongoing fundraising campaign.",
};

export const stellarNightsSponsorshipTiers: StellarNightsSponsorshipTier[] = [
  {
    level: "Team Player",
    commitment: "$1,000",
    recognition: "Name in the Stellar Nights sponsor listing and ongoing campaign sponsor acknowledgments.",
  },
  {
    level: "Game Changer",
    commitment: "$2,500",
    recognition: "Name on event signage and campaign materials; acknowledgment at Stellar Nights and in campaign updates.",
  },
  {
    level: "All-Star",
    commitment: "$5,000",
    recognition:
      "Logo on event signage and campaign materials; acknowledgment at Stellar Nights, in campaign updates, and at the facility opening.",
  },
  {
    level: "MVP",
    commitment: "$10,000",
    recognition:
      "Prominent logo on event and campaign materials; verbal event recognition; dedicated campaign spotlight; facility opening acknowledgment.",
  },
  {
    level: "Hall of Fame",
    commitment: "$20,000+",
    recognition:
      "Premier logo on event and campaign materials; featured acknowledgment at Stellar Nights; dedicated campaign feature; facility opening recognition.",
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
