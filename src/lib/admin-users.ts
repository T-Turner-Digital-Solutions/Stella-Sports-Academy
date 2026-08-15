import crypto from "crypto";
import { getDb } from "@/lib/db";

export type AdminRole = "owner" | "member";

export type AdminUserRecord = {
  id: string;
  created_at: string;
  email: string;
  name: string;
  role: AdminRole;
  password_hash: string | null;
  invite_token: string | null;
  invite_expires_at: string | null;
  active: boolean;
  last_login_at: string | null;
};

const INVITE_DURATION = "7 days";

export async function getAdminUserCount() {
  const db = getDb();
  if (!db) return 0;
  const result = await db.query<{ count: string }>(`SELECT count(*) FROM admin_users`);
  return Number(result.rows[0]?.count ?? 0);
}

export async function findAdminUserByEmail(email: string) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query<AdminUserRecord>(
    `SELECT * FROM admin_users WHERE lower(email) = lower($1)`,
    [email]
  );
  return result.rows[0] ?? null;
}

export async function findAdminUserById(id: string) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query<AdminUserRecord>(`SELECT * FROM admin_users WHERE id = $1`, [id]);
  return result.rows[0] ?? null;
}

export async function findAdminUserByInviteToken(token: string) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query<AdminUserRecord>(
    `SELECT * FROM admin_users WHERE invite_token = $1 AND invite_expires_at > now()`,
    [token]
  );
  return result.rows[0] ?? null;
}

/** Creates the first admin account from ADMIN_EMAIL/ADMIN_PASSWORD_HASH the
 * first time those credentials are used to sign in. Only ever called when
 * admin_users is empty — see verifyAdminCredentials in @/lib/auth. */
export async function createOwnerFromBootstrap(email: string, passwordHash: string) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query<AdminUserRecord>(
    `INSERT INTO admin_users (email, name, role, password_hash, active)
     VALUES ($1, $2, 'owner', $3, true)
     ON CONFLICT (email) DO NOTHING
     RETURNING *`,
    [email.trim().toLowerCase(), "Owner", passwordHash]
  );
  return result.rows[0] ?? null;
}

export async function createInvite(data: { email: string; name: string; role: AdminRole }) {
  const db = getDb();
  if (!db) return null;
  const token = crypto.randomBytes(24).toString("hex");
  const result = await db.query<AdminUserRecord>(
    `INSERT INTO admin_users (email, name, role, invite_token, invite_expires_at, active)
     VALUES ($1, $2, $3, $4, now() + interval '${INVITE_DURATION}', true)
     RETURNING *`,
    [data.email.trim().toLowerCase(), data.name, data.role, token]
  );
  return result.rows[0] ?? null;
}

export async function acceptInvite(token: string, passwordHash: string) {
  const db = getDb();
  if (!db) return null;
  const result = await db.query<AdminUserRecord>(
    `UPDATE admin_users
     SET password_hash = $1, invite_token = NULL, invite_expires_at = NULL
     WHERE invite_token = $2 AND invite_expires_at > now()
     RETURNING *`,
    [passwordHash, token]
  );
  return result.rows[0] ?? null;
}

export async function listAdminUsers() {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<AdminUserRecord>(`SELECT * FROM admin_users ORDER BY created_at ASC`);
  return result.rows;
}

export async function setAdminUserActive(id: string, active: boolean) {
  const db = getDb();
  if (!db) return false;
  await db.query(`UPDATE admin_users SET active = $1 WHERE id = $2`, [active, id]);
  return true;
}

export async function touchLastLogin(id: string) {
  const db = getDb();
  if (!db) return;
  await db.query(`UPDATE admin_users SET last_login_at = now() WHERE id = $1`, [id]);
}
