import { getDb } from "@/lib/db";

const WINDOW_MINUTES = 10;
const MAX_SUBMISSIONS_PER_WINDOW = 5;

/** Netlify sets this header to the visitor's real IP ahead of any proxy —
 * x-forwarded-for is the fallback for environments without it (e.g. local
 * dev), where it's attacker-settable but there's no real traffic to abuse. */
export function getClientIp(request: Request): string | null {
  const nf = request.headers.get("x-nf-client-connection-ip");
  if (nf) return nf;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return null;
}

/** True if this IP has already made MAX_SUBMISSIONS_PER_WINDOW or more
 * Contact form submissions in the last WINDOW_MINUTES. Counts every stored
 * submission from that IP, quarantined ones included — this throttles
 * volume, independent of the spam-content classifier below it. */
export async function isContactRateLimited(ip: string | null): Promise<boolean> {
  if (!ip) return false;
  const db = getDb();
  if (!db) return false;

  const result = await db.query<{ count: string }>(
    `SELECT count(*) FROM contact_submissions
     WHERE ip_address = $1 AND created_at > now() - ($2 || ' minutes')::interval`,
    [ip, String(WINDOW_MINUTES)]
  );
  const count = Number(result.rows[0]?.count ?? 0);
  return count >= MAX_SUBMISSIONS_PER_WINDOW;
}
