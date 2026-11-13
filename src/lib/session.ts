import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { AdminRole } from "@/lib/admin-users";

/**
 * Session-token verification only — deliberately has ZERO dependency on
 * @/lib/db or @/lib/admin-users (which pull in `pg`, a Node-only package
 * using raw TCP sockets). src/proxy.ts imports from this file, and Next.js's
 * proxy/middleware gets bundled by @netlify/plugin-nextjs as a Netlify Edge
 * Function (a Deno-based runtime) regardless of Next's own "Node.js by
 * default" framing for proxy.ts — `pg` can't run there, and even importing
 * it transitively breaks the edge-function bundling step with an opaque
 * "exit code 2" build failure. Keep it that way: anything proxy.ts needs
 * belongs here; anything that touches the database or bcryptjs belongs in
 * @/lib/auth instead, which only ever runs from Node-runtime API routes.
 */
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
