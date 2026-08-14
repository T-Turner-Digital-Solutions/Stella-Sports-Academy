import { z } from "zod";

export const newsletterSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Enter a valid email address").max(200),
  consent: z.literal(true, {
    error: "Please confirm you'd like to receive communications from Steller",
  }),
  website: z.string().max(0).optional(), // honeypot
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const contactReasons = [
  "General Inquiry",
  "Donation Question",
  "Athlete Programs",
  "Sponsorship",
  "Volunteer",
  "Partnership",
  "Media",
  "Other",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  inquiryType: z.enum(contactReasons, { error: "Select an inquiry type" }),
  message: z.string().trim().min(10, "Please share a few more details").max(4000),
  website: z.string().max(0).optional(), // honeypot
});
export type ContactInput = z.infer<typeof contactSchema>;

export const volunteerCategories = [
  "Coach",
  "Trainer",
  "Mentor",
  "Tutor",
  "Event Volunteer",
  "Fundraising Volunteer",
  "Administrative Volunteer",
  "Community Outreach",
  "Other",
] as const;

export const volunteerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
  areaOfInterest: z.enum(volunteerCategories, { error: "Select an area of interest" }),
  experience: z.string().trim().max(4000).optional().or(z.literal("")),
  availability: z.string().trim().min(1, "Let us know your general availability").max(1000),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  consent: z.literal(true, { error: "Please confirm the consent statement" }),
  website: z.string().max(0).optional(), // honeypot
});
export type VolunteerInput = z.infer<typeof volunteerSchema>;

export const programInterestValues = [
  "Athletic Training",
  "Academic Support",
  "Mentorship",
  "Leadership Development",
  "College Preparation",
  "Scholarship Assistance",
  "Other",
] as const;

export const athleteApplicationSchema = z.object({
  athleteFirstName: z.string().trim().min(1, "First name is required").max(100),
  athleteLastName: z.string().trim().min(1, "Last name is required").max(100),
  dateOfBirth: z.string().trim().min(1, "Date of birth is required"),
  school: z.string().trim().min(1, "School is required").max(200),
  grade: z.string().trim().min(1, "Grade is required").max(50),
  sport: z.string().trim().min(1, "Sport is required").max(100),
  position: z.string().trim().max(100).optional().or(z.literal("")),
  currentTeam: z.string().trim().max(200).optional().or(z.literal("")),
  parentName: z.string().trim().min(1, "Parent/guardian name is required").max(150),
  parentEmail: z.string().trim().email("Enter a valid email address").max(200),
  parentPhone: z.string().trim().min(7, "Enter a valid phone number").max(30),
  programInterest: z
    .array(z.enum(programInterestValues))
    .min(1, "Select at least one program of interest"),
  financialAssistance: z.enum(["yes", "no"], {
    error: "Let us know if financial assistance is being requested",
  }),
  additionalInfo: z.string().trim().max(4000).optional().or(z.literal("")),
  consent: z.literal(true, {
    error: "Parent/guardian consent is required to submit an application",
  }),
  website: z.string().max(0).optional(), // honeypot
});
export type AthleteApplicationInput = z.infer<typeof athleteApplicationSchema>;

export const donationCheckoutSchema = z.object({
  amountCents: z
    .number()
    .int()
    .min(500, "Minimum donation is $5")
    .max(100_000_00, "For gifts over $100,000, please contact us directly"),
  frequency: z.enum(["one-time", "monthly"]),
  designation: z.string().trim().min(1).max(100),
  donorName: z.string().trim().min(1, "Name is required").max(150),
  donorEmail: z.string().trim().email("Enter a valid email address").max(200),
  anonymous: z.boolean(),
  dedication: z.string().trim().max(500).optional().or(z.literal("")),
});
export type DonationCheckoutInput = z.infer<typeof donationCheckoutSchema>;

export const corporateSponsorshipSchema = z.object({
  companyName: z.string().trim().min(1, "Company/organization name is required").max(200),
  contactName: z.string().trim().min(1, "Contact name is required").max(150),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  interestedTier: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  website: z.string().max(0).optional(), // honeypot
});
export type CorporateSponsorshipInput = z.infer<typeof corporateSponsorshipSchema>;
