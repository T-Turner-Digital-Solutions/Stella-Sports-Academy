/** Pure, client-safe helpers for admin/board-member accounts — zero
 * dependency on @/lib/db (and therefore `pg`), so client components can
 * import these without pulling the Node-only database driver into the
 * browser bundle. DB-backed reads/writes live in @/lib/admin-users, which
 * re-exports these for existing server-side call sites. */

export type AdminRole = "owner" | "member";

/** First name only, for a friendly "Welcome, X!" greeting. */
export function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

/** The label shown under a board member's name on the portal — their real
 * official position, set by an owner from /admin/team. Never guessed from
 * a name; falls back to a generic label only when no title has been set
 * yet. */
export function formatPositionLabel(user: { role: AdminRole; title: string | null }) {
  const title = user.title?.trim();
  if (user.role === "owner") {
    return title ? `Owner / Administrator • ${title}` : "Owner / Administrator";
  }
  return title || "Board Member";
}
