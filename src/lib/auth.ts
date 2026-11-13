import bcrypt from "bcryptjs";
import { isDatabaseConfigured } from "@/lib/db";
import {
  createOwnerFromBootstrap,
  findAdminUserByEmail,
  getAdminUserCount,
  touchLastLogin,
} from "@/lib/admin-users";
import {
  SESSION_COOKIE,
  createSessionToken,
  verifySessionToken,
  getCurrentAdminSession,
  sessionCookieOptions,
  type AdminSession,
} from "@/lib/session";

// Re-exported for existing call sites (API routes, server components) — all
// Node-runtime, so depending on this module (and transitively on `pg` via
// @/lib/db and @/lib/admin-users) is fine there. src/proxy.ts must NOT import
// from this file — see the comment in @/lib/session for why.
export { SESSION_COOKIE, createSessionToken, verifySessionToken, getCurrentAdminSession, sessionCookieOptions };
export type { AdminSession };

/** Login is "configured" once SESSION_SECRET is set and there's at least one
 * way to actually authenticate: either a Postgres-backed admin_users table
 * (accounts created via bootstrap + invites), or — with no database — the
 * single ADMIN_EMAIL/ADMIN_PASSWORD_HASH account from before board accounts
 * existed. */
export function isAuthConfigured() {
  if (!process.env.SESSION_SECRET) return false;
  if (isDatabaseConfigured()) return true;
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH);
}

/**
 * Verifies a login attempt. With a database configured, accounts live in
 * admin_users (see @/lib/admin-users) — the first account is bootstrapped
 * from ADMIN_EMAIL/ADMIN_PASSWORD_HASH the first time those credentials are
 * used, as long as admin_users is still empty; every account after that
 * comes from an owner's invite (see /admin/team). Without a database, this
 * falls back to the single env-configured admin account.
 */
export async function verifyAdminCredentials(email: string, password: string): Promise<AdminSession | null> {
  if (isDatabaseConfigured()) {
    const user = await findAdminUserByEmail(email);
    if (user) {
      if (!user.active || !user.password_hash) return null;
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return null;
      await touchLastLogin(user.id);
      return { id: user.id, email: user.email, name: user.name, role: user.role };
    }

    const envEmail = process.env.ADMIN_EMAIL;
    const envHash = process.env.ADMIN_PASSWORD_HASH;
    if (!envEmail || !envHash) return null;
    if (email.trim().toLowerCase() !== envEmail.trim().toLowerCase()) return null;
    if ((await getAdminUserCount()) > 0) return null; // bootstrap only applies before the first account exists
    if (!(await bcrypt.compare(password, envHash))) return null;

    const created = await createOwnerFromBootstrap(envEmail, envHash);
    if (!created) return null;
    await touchLastLogin(created.id);
    return { id: created.id, email: created.email, name: created.name, role: created.role };
  }

  const envEmail = process.env.ADMIN_EMAIL;
  const envHash = process.env.ADMIN_PASSWORD_HASH;
  if (!envEmail || !envHash) return null;
  if (email.trim().toLowerCase() !== envEmail.trim().toLowerCase()) return null;
  const valid = await bcrypt.compare(password, envHash);
  return valid ? { id: "env-admin", email: envEmail, name: "Admin", role: "owner" } : null;
}
