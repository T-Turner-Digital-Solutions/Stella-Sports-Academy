export const presetAmounts = [25, 50, 100, 250, 500, 1000];

export const donationFrequencies = [
  { value: "one-time", label: "One-Time" },
  { value: "monthly", label: "Monthly" },
] as const;

export type DonationFrequency = (typeof donationFrequencies)[number]["value"];

export const donationDesignations = [
  { value: "general", label: "General Fund" },
  { value: "sponsor-an-athlete", label: "Sponsor an Athlete" },
  { value: "athletic-programs", label: "Athletic Programs" },
  { value: "academic-programs", label: "Academic Programs" },
  { value: "scholarship-fund", label: "Scholarship Fund" },
  { value: "equipment-fund", label: "Equipment Fund" },
  { value: "current-campaign", label: "Current Campaign" },
  { value: "greatest-need", label: "Greatest Need" },
] as const;

export type DonationDesignation = (typeof donationDesignations)[number]["value"];
