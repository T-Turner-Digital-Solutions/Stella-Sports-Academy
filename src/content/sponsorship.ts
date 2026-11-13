import { Users, Award, Trophy, Medal, Crown, type LucideIcon } from "lucide-react";

export type SponsorshipTier = {
  name: string;
  price: string;
  tagline: string;
  benefits: string[];
  icon: LucideIcon;
  featured?: boolean;
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
