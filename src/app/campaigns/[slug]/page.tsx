import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Users, CalendarClock, UserRound } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShareButton } from "@/components/campaigns/ShareButton";
import { campaigns } from "@/content/campaigns";
import { formatCurrency, formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return campaigns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const campaign = campaigns.find((c) => c.slug === slug);
  if (!campaign) return {};
  return { title: campaign.title, description: campaign.summary };
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = campaigns.find((c) => c.slug === slug);
  if (!campaign) notFound();

  const percent = campaign.goalCents ? (campaign.raisedCents / campaign.goalCents) * 100 : 0;

  return (
    <>
      <PageHero eyebrow="Campaign" title={campaign.title} description={campaign.summary} />

      <section className="bg-white py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-8">
            <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-red-800 via-red-700 to-ink sm:h-72">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.4) 10px, rgba(255,255,255,0.4) 11px)",
                }}
              />
              <span className="font-display relative px-6 text-center text-3xl uppercase tracking-wide text-white/90 sm:text-4xl">
                {campaign.title}
              </span>
            </div>

            <div className="prose-none flex flex-col gap-4 text-base leading-relaxed text-ink/70">
              {campaign.story.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div>
              <h2 className="font-display text-xl uppercase tracking-wide text-ink">Campaign Updates</h2>
              <div className="mt-5">
                {campaign.updates.length > 0 ? (
                  <ul className="space-y-4">
                    {campaign.updates.map((update) => (
                      <li key={update.title} className="rounded-xl border border-ink/10 bg-paper p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
                          {formatDate(update.date)}
                        </p>
                        <p className="mt-1 font-semibold text-ink">{update.title}</p>
                        <p className="mt-1 text-sm text-ink/65">{update.body}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    icon={CalendarClock}
                    title="No Updates Yet"
                    description="Check back for progress updates as this campaign moves forward."
                  />
                )}
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl uppercase tracking-wide text-ink">Recent Supporters</h2>
              <div className="mt-5">
                <EmptyState
                  icon={UserRound}
                  title="Be the First to Support This Campaign"
                  description="Donors may choose to give anonymously. Everyone who gives publicly will be listed here."
                />
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-ink/10 bg-paper p-7 lg:sticky lg:top-28">
            <Badge tone={campaign.status === "active" ? "red" : "neutral"}>
              {campaign.status === "active" ? "Active Campaign" : "Planned"}
            </Badge>

            <div className="mt-5">
              <ProgressBar percent={percent} />
              <div className="mt-3 flex items-baseline justify-between">
                <span className="font-display text-2xl text-ink">
                  {formatCurrency(campaign.raisedCents)}
                </span>
                <span className="text-sm text-ink/55">
                  {campaign.goalCents ? `of ${formatCurrency(campaign.goalCents)} goal` : "Goal to be announced"}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-ink/55">
                <Users className="h-4 w-4" />
                {campaign.donorCount} {campaign.donorCount === 1 ? "supporter" : "supporters"}
              </div>
              {campaign.deadline && (
                <div className="mt-2 flex items-center gap-1.5 text-sm text-ink/55">
                  <CalendarClock className="h-4 w-4" />
                  Ends {formatDate(campaign.deadline)}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button href={`/donate?designation=${campaign.designation}`} size="lg">
                Donate to This Campaign
              </Button>
              <ShareButton title={campaign.title} />
            </div>

            <p className="mt-5 text-xs leading-relaxed text-ink/45">
              Donors may choose to remain anonymous. Stella never publishes payment details or
              donor contact information.
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
