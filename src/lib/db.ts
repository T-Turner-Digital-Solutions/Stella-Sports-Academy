import { Pool } from "pg";

let pool: Pool | null = null;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

/** Returns null when DATABASE_URL isn't configured — callers must handle
 * that gracefully (e.g. skip persistence, or show a clear setup message in
 * the admin UI) rather than pretending data exists. */
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
