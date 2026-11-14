import { getDb } from "@/lib/db";

export type GoalCategory = "contributions" | "grants" | "sponsorships" | "total_revenue";

export type YearGoals = {
  year: number;
  contributions_cents: number;
  grants_cents: number;
  sponsorships_cents: number;
  total_revenue_cents: number;
};

export type GoalChange = {
  id: string;
  created_at: string;
  year: number;
  category: GoalCategory;
  previous_cents: number;
  new_cents: number;
  changed_by: string | null;
  changed_by_name: string | null;
};

const CATEGORIES: GoalCategory[] = ["contributions", "grants", "sponsorships", "total_revenue"];

/** Every year from 2026 through the later of 2031 or the furthest year any
 * goal has actually been set for — so "add future years" (point 6) just
 * means saving a goal for a new year, no separate "add year" step needed. */
export async function listFinancialGoalYears(): Promise<YearGoals[]> {
  const db = getDb();
  const result = db
    ? await db.query<{ year: number; category: GoalCategory; goal_cents: number }>(
        `SELECT year, category, goal_cents FROM financial_goals`
      )
    : { rows: [] };

  const maxYear = result.rows.reduce((max, r) => Math.max(max, r.year), 2031);
  const byYear = new Map<number, YearGoals>();
  for (let year = 2026; year <= maxYear; year++) {
    byYear.set(year, { year, contributions_cents: 0, grants_cents: 0, sponsorships_cents: 0, total_revenue_cents: 0 });
  }
  for (const row of result.rows) {
    const entry = byYear.get(row.year);
    if (!entry) continue;
    if (row.category === "contributions") entry.contributions_cents = row.goal_cents;
    if (row.category === "grants") entry.grants_cents = row.goal_cents;
    if (row.category === "sponsorships") entry.sponsorships_cents = row.goal_cents;
    if (row.category === "total_revenue") entry.total_revenue_cents = row.goal_cents;
  }
  return Array.from(byYear.values()).sort((a, b) => a.year - b.year);
}

/** Saves all four categories for one year in a single "Save Changes" action.
 * Only categories whose value actually changed get a history row. */
export async function saveYearGoals(data: {
  year: number;
  contributionsCents: number;
  grantsCents: number;
  sponsorshipsCents: number;
  totalRevenueCents: number;
  changedBy: string;
}) {
  const db = getDb();
  if (!db) return false;

  const changedBy = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.changedBy)
    ? data.changedBy
    : null;

  const values: Record<GoalCategory, number> = {
    contributions: data.contributionsCents,
    grants: data.grantsCents,
    sponsorships: data.sponsorshipsCents,
    total_revenue: data.totalRevenueCents,
  };

  for (const category of CATEGORIES) {
    const newCents = values[category];
    const existing = await db.query<{ goal_cents: number }>(
      `SELECT goal_cents FROM financial_goals WHERE year = $1 AND category = $2`,
      [data.year, category]
    );
    const previousCents = existing.rows[0]?.goal_cents ?? 0;

    await db.query(
      `INSERT INTO financial_goals (year, category, goal_cents, updated_by)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (year, category)
       DO UPDATE SET goal_cents = $3, updated_at = now(), updated_by = $4`,
      [data.year, category, newCents, changedBy]
    );

    if (newCents !== previousCents) {
      await db.query(
        `INSERT INTO financial_goal_changes (year, category, previous_cents, new_cents, changed_by)
         VALUES ($1, $2, $3, $4, $5)`,
        [data.year, category, previousCents, newCents, changedBy]
      );
    }
  }
  return true;
}

export async function listGoalChangeHistory(limit = 25): Promise<GoalChange[]> {
  const db = getDb();
  if (!db) return [];
  const result = await db.query<GoalChange>(
    `SELECT c.id, c.created_at, c.year, c.category, c.previous_cents, c.new_cents, c.changed_by,
            u.name AS changed_by_name
     FROM financial_goal_changes c
     LEFT JOIN admin_users u ON u.id = c.changed_by
     ORDER BY c.created_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}
