import Link from "next/link";
import type { Metadata } from "next";
import { UserRound, HeartHandshake, Building2, MessageSquare, ArrowRight } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/db";
import { getSubmissionCounts } from "@/lib/submissions";
import { DbNotConfigured } from "@/components/admin/DbNotConfigured";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard" };

const cards = [
  { key: "applications", label: "Athlete Applications", href: "/admin/applications", icon: UserRound },
  { key: "volunteers", label: "Volunteer Applications", href: "/admin/volunteers", icon: HeartHandshake },
  { key: "sponsorships", label: "Sponsorship Inquiries", href: "/admin/sponsorships", icon: Building2 },
  { key: "contact", label: "Contact Submissions", href: "/admin/contact", icon: MessageSquare },
] as const;

export default async function AdminDashboardPage() {
  const dbReady = isDatabaseConfigured();
  const counts = dbReady ? await getSubmissionCounts() : null;

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/60">Review and manage everything submitted through the public site.</p>

      <div className="mt-8">
        {!dbReady ? (
          <DbNotConfigured />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => {
              const stat = counts?.[card.key];
              return (
                <Link
                  key={card.key}
                  href={card.href}
                  className="group flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
                      <card.icon className="h-5 w-5 text-red-700" />
                    </span>
                    {stat && stat.new > 0 && (
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-700 px-1.5 text-xs font-bold text-white">
                        {stat.new}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-display text-3xl text-ink">{stat?.total ?? 0}</p>
                    <p className="mt-1 text-sm font-medium text-ink/60">{card.label}</p>
                  </div>
                  <span className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-red-700">
                    Review
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
