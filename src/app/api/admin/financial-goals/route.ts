import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { saveYearGoals } from "@/lib/financial-goals";

const dollarsSchema = z
  .union([z.string(), z.number()])
  .transform((v) => Number(v))
  .refine((v) => Number.isFinite(v) && v >= 0, "Enter a valid, non-negative dollar amount.")
  .transform((v) => Math.round(v * 100));

const saveSchema = z.object({
  year: z.coerce.number().int().min(2026).max(2099),
  contributions: dollarsSchema,
  grants: dollarsSchema,
  sponsorships: dollarsSchema,
  totalRevenue: dollarsSchema,
});

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Set DATABASE_URL to manage financial goals." }, { status: 501 });
  }

  const session = await getCurrentAdminSession();
  if (!session || session.role !== "owner") {
    return NextResponse.json({ message: "Only the owner can edit financial goals." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = saveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message || "Enter valid goal amounts." }, { status: 400 });
  }

  const ok = await saveYearGoals({
    year: parsed.data.year,
    contributionsCents: parsed.data.contributions,
    grantsCents: parsed.data.grants,
    sponsorshipsCents: parsed.data.sponsorships,
    totalRevenueCents: parsed.data.totalRevenue,
    changedBy: session.id,
  });

  if (!ok) {
    return NextResponse.json({ message: "Could not save goals. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ message: "Goals saved." });
}
