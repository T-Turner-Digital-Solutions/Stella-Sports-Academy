import {
  Dumbbell,
  GraduationCap,
  Compass,
  Handshake,
} from "lucide-react";

export type Program = {
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  icon: typeof Dumbbell;
  heroDescription: string;
  offerings: string[];
};

export const programs: Program[] = [
  {
    slug: "athletic-development",
    name: "Athletic Development",
    shortName: "Athletic Development",
    summary:
      "Skills training, strength and conditioning, and performance development across multiple sports.",
    icon: Dumbbell,
    heroDescription:
      "Steller athletes train with a focus on fundamentals, physical development, and injury prevention — building the athletic foundation that carries into every sport and every stage of competition.",
    offerings: [
      "Baseball skills development",
      "Football skills development",
      "Strength and conditioning",
      "Speed and agility",
      "Injury prevention education",
      "Sports performance assessments",
      "Leadership through athletics",
    ],
  },
  {
    slug: "academic-support",
    name: "Academic Support",
    shortName: "Academic Support",
    summary:
      "Accountability, tutoring support, and college and career readiness so athletes succeed in the classroom.",
    icon: GraduationCap,
    heroDescription:
      "Athletic success and academic success go hand in hand. Steller keeps athletes accountable in the classroom while preparing them for the next step — college, career, and beyond.",
    offerings: [
      "Academic accountability",
      "Progress monitoring",
      "Goal setting",
      "Study skills",
      "Time management",
      "Academic eligibility guidance",
      "College readiness",
      "Career readiness",
      "Scholarship guidance",
      "Educational workshops",
    ],
  },
  {
    slug: "life-skills",
    name: "Life Skills & Personal Development",
    shortName: "Life Skills",
    summary:
      "Character, communication, financial literacy, and resilience — the skills that outlast a season.",
    icon: Compass,
    heroDescription:
      "Sports are the platform — life is the goal. Steller builds the character, decision-making, and resilience young athletes carry with them long after their playing days.",
    offerings: [
      "Character development",
      "Leadership skills",
      "Communication",
      "Financial literacy",
      "Personal responsibility",
      "Decision-making",
      "Mental wellness",
      "Resilience",
      "Career exploration",
      "Workforce readiness",
      "Life planning beyond sports",
    ],
  },
  {
    slug: "mentorship",
    name: "Mentorship",
    shortName: "Mentorship",
    summary:
      "One-on-one connections with coaches, trainers, former athletes, and community leaders.",
    icon: Handshake,
    heroDescription:
      "Every athlete benefits from someone in their corner. Steller connects young athletes with mentors who guide, encourage, and open doors — on the field and off.",
    offerings: [
      "Coaches",
      "Trainers",
      "Former athletes",
      "Community leaders",
      "Business professionals",
      "Educators",
      "Academic mentors",
    ],
  },
];

export const programInterestOptions = [
  "Athletic Training",
  "Academic Support",
  "Mentorship",
  "Leadership Development",
  "College Preparation",
  "Scholarship Assistance",
  "Other",
];
