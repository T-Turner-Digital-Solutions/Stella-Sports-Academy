// NOTE: url/email/phone are sourced from environment variables so nothing
// unverified is hard-coded into the public site. Set these in .env.local
// (see README) before launch — the fallbacks below are placeholders only.
export const site = {
  name: "Stellar Sports Academy",
  shortName: "Stellar",
  orgType: "501(c)(3) Nonprofit Organization",
  tagline: "Empowering Young Athletes. Building Champions for Life.",
  description:
    "Stellar Sports Academy is a nonprofit empowering young athletes through athletic training, academic support, mentorship, leadership development, and life skills. We help youth build confidence, discipline, and opportunity—on the field, in the classroom, and in life.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.example.org",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  ein: "42-3248861",
  social: {
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "",
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "",
    twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || "",
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || "",
  },
};

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Programs",
    href: "/programs",
    children: [
      { label: "All Programs", href: "/programs", description: "See the full picture" },
      { label: "Athletic Development", href: "/programs/athletic-development" },
      { label: "Academic Support", href: "/programs/academic-support" },
      { label: "Life Skills & Personal Development", href: "/programs/life-skills" },
      { label: "Mentorship", href: "/programs/mentorship" },
      { label: "Athlete Application", href: "/apply", description: "Apply to join Stellar" },
    ],
  },
  {
    label: "Campaigns",
    href: "/campaigns",
  },
  {
    label: "Get Involved",
    href: "/get-involved",
    children: [
      { label: "Overview", href: "/get-involved" },
      { label: "Sponsor an Athlete", href: "/get-involved/sponsor-an-athlete" },
      { label: "Corporate Sponsorship", href: "/get-involved/corporate-sponsorship" },
      { label: "Volunteer", href: "/get-involved/volunteer" },
      { label: "Events", href: "/events" },
    ],
  },
  { label: "Our Impact", href: "/impact" },
  {
    label: "Transparency",
    href: "/transparency",
    children: [
      { label: "Governance & Financials", href: "/transparency" },
      { label: "Meeting Minutes", href: "/transparency/meeting-minutes" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  organization: [
    { label: "About Stellar", href: "/about" },
    { label: "Our Programs", href: "/programs" },
    { label: "Our Impact", href: "/impact" },
    { label: "News", href: "/news" },
    { label: "Events", href: "/events" },
    { label: "Contact", href: "/contact" },
  ],
  getInvolved: [
    { label: "Donate", href: "/donate" },
    { label: "Sponsor an Athlete", href: "/get-involved/sponsor-an-athlete" },
    { label: "Corporate Sponsorship", href: "/get-involved/corporate-sponsorship" },
    { label: "Volunteer", href: "/get-involved/volunteer" },
    { label: "Athlete Application", href: "/apply" },
  ],
  transparency: [
    { label: "Governance & Financials", href: "/transparency" },
    { label: "Meeting Minutes", href: "/transparency/meeting-minutes" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Donation Policy", href: "/donation-policy" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
};
