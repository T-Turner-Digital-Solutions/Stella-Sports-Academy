import type { Metadata } from "next";
import { GraduationCap, Trophy, Quote, Users2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImpactStatCard } from "@/components/ui/ImpactStatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { impactStats, successStories } from "@/content/impact";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Our Impact",
  description: `See ${site.name}'s impact on young athletes through training, academics, mentorship, and community outcomes.`,
};

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Impact"
        title="The Difference We're Making"
        description="Steller reports real, verified figures only — never estimates. As programs grow, this page grows with them."
      />

      <section className="bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="By the Numbers" title="Program Metrics" />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {impactStats.map((stat) => (
              <ImpactStatCard key={stat.key} stat={stat} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 sm:py-28">
        <Container className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink/10 bg-white p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <GraduationCap className="h-6 w-6 text-red-700" />
            </span>
            <h2 className="font-display mt-6 text-xl uppercase tracking-wide text-ink">College Placements & Scholarships</h2>
            <div className="mt-5">
              <EmptyState
                icon={Trophy}
                title="Reporting Coming Soon"
                description="Verified college placement and scholarship outcomes will be published here as they're confirmed."
              />
            </div>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Users2 className="h-6 w-6 text-red-700" />
            </span>
            <h2 className="font-display mt-6 text-xl uppercase tracking-wide text-ink">Program Outcomes</h2>
            <div className="mt-5">
              <EmptyState
                icon={Users2}
                title="Reporting Coming Soon"
                description="Program outcome data — training completion, academic milestones, and more — will appear here as it's tracked."
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Real Stories" title="Success Stories" align="center" className="mx-auto" />
          <div className="mt-12">
            {successStories.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {successStories.map((story) => (
                  <div key={story.slug} className="rounded-2xl border border-ink/10 bg-paper p-6">
                    <Quote className="h-6 w-6 text-red-700" />
                    <p className="mt-4 text-sm leading-relaxed text-ink/75">&ldquo;{story.quote}&rdquo;</p>
                    <p className="mt-4 text-sm font-semibold text-ink">{story.name}</p>
                    <p className="text-xs text-ink/50">{story.category}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Quote}
                title="Stories Coming Soon"
                description="Athlete, parent, coach, and scholarship stories are reviewed and approved before publishing — especially any involving minors."
              />
            )}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-16">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display max-w-xl text-2xl uppercase tracking-wide text-white sm:text-3xl">
            Help us grow this page with real impact
          </h2>
          <Button href="/donate" variant="white" size="lg">
            Donate Now
          </Button>
        </Container>
      </section>
    </>
  );
}
