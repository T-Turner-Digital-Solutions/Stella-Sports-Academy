import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { isDatabaseConfigured } from "@/lib/db";
import {
  createOwnerFromBootstrap,
  findAdminUserByEmail,
  getAdminUserCount,
  touchLastLogin,
  type AdminRole,
} from "@/lib/admin-users";

export const SESSION_COOKIE = "stellar_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 hours

export type AdminSession = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
};

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

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

export async function createSessionToken(session: AdminSession) {
  const key = getSecretKey();
  if (!key) throw new Error("SESSION_SECRET is not configured");

  return new SignJWT({ email: session.email, name: session.name, role: session.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setSubject(session.id)
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(key);
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  const key = getSecretKey();
  if (!key) return null;

  try {
    const { payload } = await jwtVerify(token, key);
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    const role: AdminRole = payload.role === "owner" ? "owner" : "member";
    return {
      id: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "",
      role,
    };
  } catch {
    return null;
  }
}

/** Reads and verifies the session cookie for the current request. Use in
 * server components/route handlers that need to know who's signed in (e.g.
 * to gate owner-only actions) — proxy.ts already blocks unauthenticated
 * requests from reaching these at all. */
export async function getCurrentAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
};
