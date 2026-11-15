/** Postgres "undefined_column" (42703) or "undefined_table" (42P01) —
 * thrown when code queries a column/table that only exists after a
 * migration that hasn't been applied to this database yet. Distinct from a
 * genuinely empty result: callers should surface this explicitly ("this
 * feature needs a pending database update") rather than silently showing
 * an empty list, which would misleadingly look like "there's just nothing
 * here yet." */
export class MigrationNotAppliedError extends Error {
  constructor(message = "This feature needs a database update that hasn't been applied yet.") {
    super(message);
    this.name = "MigrationNotAppliedError";
  }
}

export function isMigrationNotAppliedError(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("code" in error)) return false;
  return error.code === "42703" || error.code === "42P01";
}
