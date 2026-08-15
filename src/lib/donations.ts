import { getDb } from "@/lib/db";

export type DonationFrequency = "one-time" | "monthly";

export type DonationRecord = {
  id: string;
  created_at: string;
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
  donor_name: string;
  donor_email: string | null;
  amount_cents: number;
  currency: string;
  frequency: DonationFrequency;
  designation: string;
  anonymous: boolean;
  receipt_emailed_at: string | null;
};

export type DonationTotals = {
  yearTotalCents: number;
  yearCount: number;
  allTimeTotalCents: number;
  allTimeCount: number;
};

/** Idempotent on stripe_session_id — Stripe retries webhook deliveries, so a
 * duplicate checkout.session.completed event must not create a duplicate row. */
export async function insertDonation(data: {
  stripeSessionId: string;
  stripePaymentIntentId?: string | null;
  donorName: string;
  donorEmail?: string | null;
  amountCents: number;
  currency?: string;
  frequency: DonationFrequency;
  designation: string;
  anonymous: boolean;
}) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query<{ id: string }>(
    `INSERT INTO donations
      (stripe_session_id, stripe_payment_intent_id, donor_name, donor_email, amount_cents,
       currency, frequency, designation, anonymous)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (stripe_session_id) DO NOTHING
     RETURNING id`,
    [
      data.stripeSessionId,
      data.stripePaymentIntentId || null,
      data.donorName,
      data.donorEmail || null,
      data.amountCents,
      data.currency || "usd",
      data.frequency,
      data.designation,
      data.anonymous,
    ]
  );
  return result.rows[0]?.id;
}

export async function markDonationReceiptSent(stripeSessionId: string) {
  const db = getDb();
  if (!db) return;
  await db.query(`UPDATE donations SET receipt_emailed_at = now() WHERE stripe_session_id = $1`, [
    stripeSessionId,
  ]);
}

export async function listDonations() {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<DonationRecord>(`SELECT * FROM donations ORDER BY created_at DESC`);
  return result.rows;
}

export async function getDonationTotals(): Promise<DonationTotals | null> {
  const db = getDb();
  if (!db) return null;
  const result = await db.query<{
    year_total: string;
    year_count: string;
    all_time_total: string;
    all_time_count: string;
  }>(
    `SELECT
       COALESCE(SUM(amount_cents) FILTER (WHERE created_at >= date_trunc('year', now())), 0) AS year_total,
       COUNT(*) FILTER (WHERE created_at >= date_trunc('year', now())) AS year_count,
       COALESCE(SUM(amount_cents), 0) AS all_time_total,
       COUNT(*) AS all_time_count
     FROM donations`
  );
  const row = result.rows[0];
  return {
    yearTotalCents: Number(row?.year_total ?? 0),
    yearCount: Number(row?.year_count ?? 0),
    allTimeTotalCents: Number(row?.all_time_total ?? 0),
    allTimeCount: Number(row?.all_time_count ?? 0),
  };
}
