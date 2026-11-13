import { Pool } from "pg";

let pool: Pool | null = null;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

/** Returns null when DATABASE_URL isn't configured — callers must handle
 * that gracefully (e.g. skip persistence, or show a clear setup message in
 * the admin UI) rather than pretending data exists.
 *
 * DATABASE_URL points at Stellar's Supabase project via the transaction
 * pooler connection string (aws-0-<region>.pooler.supabase.com — not the
 * db.<ref>.supabase.co direct-connection host, which needs IPv6 and isn't
 * reachable from Netlify Functions) as of 2026-11-13. Rotating the value
 * requires a fresh deploy before it takes effect — Netlify Functions read
 * env vars at deploy time, not per-request. */
export function getDb(): Pool | null {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
      max: 5,
    });
  }
  return pool;
}
