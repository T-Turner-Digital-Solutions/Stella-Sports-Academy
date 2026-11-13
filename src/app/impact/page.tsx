import type { Metadata } from "next";
import Image from "next/image";
import { GraduationCap, Trophy, Quote, Users2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImpactStatCard } from "@/components/ui/ImpactStatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { LeaderCard } from "@/components/leadership/LeaderCard";
import { impactStats, successStories } from "@/content/impact";
import { leadership } from "@/content/leadership";
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
        description="Stellar reports real, verified figures only — never estimates. As programs grow, this page grows with them."
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

      <section className="relative overflow-hidden bg-paper py-20 sm:py-28">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1600 800"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="impact-report-arc" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0066a8" stopOpacity="0" />
              <stop offset="100%" stopColor="#4bc3ef" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path d="M -60 60 C 300 -20, 500 140, 900 40" stroke="url(#impact-report-arc)" strokeWidth="4" strokeLinecap="round" />
          <path d="M 1660 740 C 1300 820, 1100 660, 700 760" stroke="url(#impact-report-arc)" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <Container className="relative">
          <div className="mx-auto mb-12 flex max-w-xl items-center justify-center gap-5">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-red-400" />
            <Image src="/brand/stella-lockup.png" alt={`${site.name} logo`} width={1514} height={932} className="h-auto w-32 sm:w-40" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-red-400" />
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="rounded-2xl border border-ink/10 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                  <GraduationCap className="h-5 w-5 text-red-700" />
                </span>
                <h2 className="font-display text-lg uppercase tracking-wide text-ink">College Placements & Scholarships</h2>
              </div>
              <span className="mt-3 block h-0.5 w-10 rounded-full bg-red-600" />
              <div className="relative mt-5 overflow-hidden rounded-xl bg-paper">
                <div
                  aria-hidden
                  className="absolute bottom-0 right-0 h-16 w-24 bg-gradient-to-tl from-red-400/40 to-transparent"
                  style={{ clipPath: "polygon(100% 100%, 0 100%, 100% 0)" }}
                />
                <div className="relative px-6 py-10 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <Trophy className="h-6 w-6 text-red-700" />
                  </span>
                  <p className="font-display mt-4 text-base uppercase tracking-wide text-ink">Reporting Coming Soon</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">
                    Verified college placement and scholarship outcomes will be published here as they&rsquo;re confirmed.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                  <Users2 className="h-5 w-5 text-red-700" />
                </span>
                <h2 className="font-display text-lg uppercase tracking-wide text-ink">Program Outcomes</h2>
              </div>
              <span className="mt-3 block h-0.5 w-10 rounded-full bg-red-600" />
              <div className="relative mt-5 overflow-hidden rounded-xl bg-paper">
                <div
                  aria-hidden
                  className="absolute bottom-0 right-0 h-16 w-24 bg-gradient-to-tl from-red-400/40 to-transparent"
                  style={{ clipPath: "polygon(100% 100%, 0 100%, 100% 0)" }}
                />
                <div className="relative px-6 py-10 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <Trophy className="h-6 w-6 text-red-700" />
                  </span>
                  <p className="font-display mt-4 text-base uppercase tracking-wide text-ink">Reporting Coming Soon</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">
                    Program outcome data — training completion, academic milestones, and more — will appear here as
                    it&rsquo;s tracked.
                  </p>
                </div>
              </div>
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

      <section className="bg-paper py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Our Board" title="Board of Directors" align="center" className="mx-auto" />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((leader) => (
              <LeaderCard key={leader.name} leader={leader} />
            ))}
          </div>
          <p className="mt-8 text-center text-sm italic text-ink/45">
            Private residential addresses, personal phone numbers, and signatures are never
            published on this site.
          </p>
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
