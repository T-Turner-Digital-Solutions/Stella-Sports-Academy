import { getDb } from "@/lib/db";

export type SubmissionStatus = "new" | "reviewed" | "archived";

export type AthleteApplicationRecord = {
  id: string;
  created_at: string;
  status: SubmissionStatus;
  reviewed_at: string | null;
  athlete_first_name: string;
  athlete_last_name: string;
  date_of_birth: string;
  school: string;
  grade: string;
  sport: string;
  position: string | null;
  current_team: string | null;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  program_interest: string[];
  financial_assistance: boolean;
  additional_info: string | null;
};

export type VolunteerApplicationRecord = {
  id: string;
  created_at: string;
  status: SubmissionStatus;
  reviewed_at: string | null;
  name: string;
  email: string;
  phone: string;
  area_of_interest: string;
  experience: string | null;
  availability: string;
  message: string | null;
};

export type SponsorshipInquiryRecord = {
  id: string;
  created_at: string;
  status: SubmissionStatus;
  reviewed_at: string | null;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  interested_tier: string | null;
  message: string | null;
};

export type ContactSubmissionRecord = {
  id: string;
  created_at: string;
  status: SubmissionStatus;
  reviewed_at: string | null;
  name: string;
  email: string;
  phone: string | null;
  inquiry_type: string;
  message: string;
};

// --- Inserts (called from public form API routes) ---

export async function insertAthleteApplication(data: {
  athleteFirstName: string;
  athleteLastName: string;
  dateOfBirth: string;
  school: string;
  grade: string;
  sport: string;
  position?: string;
  currentTeam?: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  programInterest: string[];
  financialAssistance: boolean;
  additionalInfo?: string;
}) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query(
    `INSERT INTO athlete_applications
      (athlete_first_name, athlete_last_name, date_of_birth, school, grade, sport, position,
       current_team, parent_name, parent_email, parent_phone, program_interest,
       financial_assistance, additional_info)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     RETURNING id`,
    [
      data.athleteFirstName,
      data.athleteLastName,
      data.dateOfBirth,
      data.school,
      data.grade,
      data.sport,
      data.position || null,
      data.currentTeam || null,
      data.parentName,
      data.parentEmail,
      data.parentPhone,
      data.programInterest,
      data.financialAssistance,
      data.additionalInfo || null,
    ]
  );
  return result.rows[0]?.id as string | undefined;
}

export async function insertVolunteerApplication(data: {
  name: string;
  email: string;
  phone: string;
  areaOfInterest: string;
  experience?: string;
  availability: string;
  message?: string;
}) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query(
    `INSERT INTO volunteer_applications
      (name, email, phone, area_of_interest, experience, availability, message)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING id`,
    [data.name, data.email, data.phone, data.areaOfInterest, data.experience || null, data.availability, data.message || null]
  );
  return result.rows[0]?.id as string | undefined;
}

export async function insertSponsorshipInquiry(data: {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  interestedTier?: string;
  message?: string;
}) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query(
    `INSERT INTO corporate_sponsorship_inquiries
      (company_name, contact_name, email, phone, interested_tier, message)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id`,
    [data.companyName, data.contactName, data.email, data.phone || null, data.interestedTier || null, data.message || null]
  );
  return result.rows[0]?.id as string | undefined;
}

export async function insertContactSubmission(data: {
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
}) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query(
    `INSERT INTO contact_submissions (name, email, phone, inquiry_type, message)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id`,
    [data.name, data.email, data.phone || null, data.inquiryType, data.message]
  );
  return result.rows[0]?.id as string | undefined;
}

// --- Reads/updates (called from the admin section only) ---

export async function listAthleteApplications() {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<AthleteApplicationRecord>(
    `SELECT * FROM athlete_applications ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function getAthleteApplication(id: string) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query<AthleteApplicationRecord>(
    `SELECT * FROM athlete_applications WHERE id = $1`,
    [id]
  );
  return result.rows[0] ?? null;
}

export async function listVolunteerApplications() {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<VolunteerApplicationRecord>(
    `SELECT * FROM volunteer_applications ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function listSponsorshipInquiries() {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<SponsorshipInquiryRecord>(
    `SELECT * FROM corporate_sponsorship_inquiries ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function listContactSubmissions() {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<ContactSubmissionRecord>(
    `SELECT * FROM contact_submissions ORDER BY created_at DESC`
  );
  return result.rows;
}

const TABLES_BY_TYPE = {
  application: "athlete_applications",
  volunteer: "volunteer_applications",
  sponsorship: "corporate_sponsorship_inquiries",
  contact: "contact_submissions",
} as const;

export type SubmissionType = keyof typeof TABLES_BY_TYPE;

export async function updateSubmissionStatus(
  type: SubmissionType,
  id: string,
  status: SubmissionStatus
) {
  const db = getDb();
  if (!db) return false;
  const table = TABLES_BY_TYPE[type];
  await db.query(
    `UPDATE ${table} SET status = $1, reviewed_at = CASE WHEN $1 = 'reviewed' THEN now() ELSE reviewed_at END WHERE id = $2`,
    [status, id]
  );
  return true;
}

export async function getSubmissionCounts() {
  const db = getDb();
  if (!db) return null;

  const [applications, volunteers, sponsorships, contact] = await Promise.all([
    db.query(`SELECT status, count(*) FROM athlete_applications GROUP BY status`),
    db.query(`SELECT status, count(*) FROM volunteer_applications GROUP BY status`),
    db.query(`SELECT status, count(*) FROM corporate_sponsorship_inquiries GROUP BY status`),
    db.query(`SELECT status, count(*) FROM contact_submissions GROUP BY status`),
  ]);

  const tally = (rows: { status: string; count: string }[]) => {
    const total = rows.reduce((sum, r) => sum + Number(r.count), 0);
    const newCount = rows.find((r) => r.status === "new")?.count ?? "0";
    return { total, new: Number(newCount) };
  };

  return {
    applications: tally(applications.rows),
    volunteers: tally(volunteers.rows),
    sponsorships: tally(sponsorships.rows),
    contact: tally(contact.rows),
  };
}
