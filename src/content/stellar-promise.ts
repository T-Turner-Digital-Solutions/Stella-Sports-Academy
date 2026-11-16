import { Dumbbell, GraduationCap, Handshake, Users, Compass } from "lucide-react";

export type StellarPromisePillar = {
  key: string;
  title: string;
  description: string;
  icon: typeof Dumbbell;
};

// Replaces the earlier numeric "Our Impact" stats on the homepage — Stellar
// is still in its development stage, so this section speaks to what the
// organization is building toward rather than figures that haven't been
// verified yet. See src/content/impact.ts for the /impact page's real,
// organization-confirmed figures, which this does not replace.
export const stellarPromisePillars: StellarPromisePillar[] = [
  {
    key: "athletic-development",
    title: "Athletic Development",
    description: "Building skills, discipline, and confidence.",
    icon: Dumbbell,
  },
  {
    key: "academic-excellence",
    title: "Academic Excellence",
    description: "Supporting success beyond the game.",
    icon: GraduationCap,
  },
  {
    key: "mentorship",
    title: "Mentorship",
    description: "Connecting youth with guidance and leadership.",
    icon: Handshake,
  },
  {
    key: "community-impact",
    title: "Community Impact",
    description: "Creating access and meaningful opportunities.",
    icon: Users,
  },
  {
    key: "lasting-opportunity",
    title: "Lasting Opportunity",
    description: "Preparing young athletes for success in sports and in life.",
    icon: Compass,
  },
];
