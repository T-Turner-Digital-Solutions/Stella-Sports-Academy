export type LeaderRole =
  | "President"
  | "Vice President"
  | "Secretary"
  | "Treasurer"
  | "Executive Director"
  | "Board Leadership";

export type Leader = {
  name: string;
  role: LeaderRole;
  roleLabel: string;
  bio?: string;
};

// Bios intentionally omit personal/athletic history that wasn't supplied by
// the organization — nothing here is invented. Update via admin dashboard
// (Phase 2) or by editing this file directly with approved copy.
export const leadership: Leader[] = [
  {
    name: "Justin Woodall",
    role: "President",
    roleLabel: "President & Founder",
  },
  {
    name: "Tanisha Osorto",
    role: "Vice President",
    roleLabel: "Vice President",
  },
  {
    name: "Rodrigo Arias",
    role: "Secretary",
    roleLabel: "Secretary",
  },
  {
    name: "Tabitha Turner",
    role: "Treasurer",
    roleLabel: "Treasurer",
  },
  {
    name: "Natalie Woodall",
    role: "Executive Director",
    roleLabel: "Executive Director",
  },
  {
    name: "Christin Blackburn",
    role: "Board Leadership",
    roleLabel: "Strategic Marketing / Board Leadership",
  },
];

export const founder = {
  name: "Justin Woodall",
  title: "Founder & President",
};
