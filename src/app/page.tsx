import Image from "next/image";
import { ArrowRight, GraduationCap, HeartHandshake, ShieldAlert, Sparkles, Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ValueCard } from "@/components/ui/ValueCard";
import { ImpactStatCard } from "@/components/ui/ImpactStatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { site } from "@/content/site";
import { coreValues } from "@/content/values";
import { programs } from "@/content/programs";
import { campaigns } from "@/content/campaigns";
import { impactStats, successStories } from "@/content/impact";

const barriers = [
  "Quality coaching",
  "Athletic development",
  "Academic resources",
  "College recruiting support",
  "Mentoring",
  "Leadership opportunities",
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-soft via-ink to-ink" />
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            maskImage: "linear-gradient(to left, black 40%, transparent 95%)",
            WebkitMaskImage: "linear-gradient(to left, black 40%, transparent 95%)",
          }}
          aria-hidden
        >
          <Image
            src="/hero/athletes-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <Container className="relative flex min-h-[88vh] flex-col justify-center py-28 sm:py-32">
          <div className="max-w-3xl animate-fade-up">
            <Badge tone="white" className="mb-6">
              {site.orgType}
            </Badge>
            <h1 className="font-display text-5xl uppercase leading-[0.98] tracking-wide text-white sm:text-6xl lg:text-7xl">
              Stellar Sports Academy
            </h1>
            <p className="font-display mt-5 text-2xl uppercase leading-tight tracking-wide text-white sm:text-3xl">
              Empowering Young Athletes.
              <br />
              Building Champions for Life.
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Helping young athletes develop the skills, discipline, education, mentorship, and
              confidence they need to succeed on the field, in the classroom, and throughout life.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/donate" variant="white" size="lg">
                Donate Now
              </Button>
              <Button href="/programs" variant="outline-light" size="lg">
                Explore Our Programs
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* MISSION */}
      <section className="bg-white py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading eyebrow="Our Mission" title="Why Stellar Exists" align="center" />
            <p className="mt-6 text-lg leading-relaxed text-ink/70">
              Stellar Sports Academy exists to empower young athletes through comprehensive
              athletic training, educational support, mentorship, and life-skills development —
              helping them gain access to the resources, support, and guidance needed to succeed
              in sports, academics, careers, and life.
            </p>
            <Button href="/about" variant="secondary" size="md" className="mt-8">
              Learn About Stellar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>

      {/* CORE VALUES */}
      <section className="bg-paper py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="What We Stand For" title="Core Values" align="center" className="mx-auto" />
          <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {coreValues.map((value) => (
              <ValueCard key={value.name} value={value} />
            ))}
          </div>
        </Container>
      </section>

      {/* PROGRAMS PREVIEW */}
      <section className="bg-white py-20 sm:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="What We Offer" title="Our Programs" />
            <Button href="/programs" variant="ghost" size="md" className="border border-ink/15">
              View All Programs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((program) => (
              <ProgramCard key={program.slug} program={program} />
            ))}
          </div>
        </Container>
      </section>

      {/* CAMPAIGNS */}
      <section className="bg-paper py-20 sm:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Fuel the Mission" title="Current Campaigns" />
            <Button href="/campaigns" variant="ghost" size="md" className="border border-ink/15">
              View All Campaigns
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.slug} campaign={campaign} />
            ))}
          </div>
        </Container>
      </section>

      {/* IMPACT STATS */}
      <section className="relative overflow-hidden bg-ink py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/60 via-ink to-ink" />
        <Container className="relative">
          <SectionHeading
            eyebrow="Our Impact"
            title="Growing Every Season"
            description="These figures update as Stellar confirms new milestones — we'd rather show real progress than invented numbers."
            align="center"
            light
            className="mx-auto"
          />
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {impactStats.map((stat) => (
              <ImpactStatCard key={stat.key} stat={stat} light />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/impact" variant="outline-light" size="md">
              See Our Full Impact
            </Button>
          </div>
        </Container>
      </section>

      {/* WHY STELLAR MATTERS */}
      <section className="bg-white py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="The Opportunity Gap"
              title="Why Stellar Matters"
              description="Many young athletes face real financial barriers that keep them from the resources their potential deserves."
            />
            <p className="mt-6 text-base leading-relaxed text-ink/70">
              Stellar Sports Academy exists to help close that gap — connecting young athletes with
              the training, support, and guidance they need, regardless of their family&rsquo;s ability
              to pay.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {barriers.map((barrier) => (
              <div
                key={barrier}
                className="flex items-center gap-3 rounded-xl border border-ink/10 bg-paper px-4 py-4 text-sm font-medium text-ink/75"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
                  <ShieldAlert className="h-4 w-4" />
                </span>
                {barrier}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* SUCCESS STORIES */}
      <section className="bg-paper py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Real Stories" title="Success Stories" align="center" className="mx-auto" />
          <div className="mt-12">
            {successStories.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {successStories.map((story) => (
                  <div key={story.slug} className="rounded-2xl bg-white p-6 shadow-sm">
                    <Quote className="h-6 w-6 text-red-700" />
                    <p className="mt-4 text-sm leading-relaxed text-ink/75">&ldquo;{story.quote}&rdquo;</p>
                    <p className="mt-4 text-sm font-semibold text-ink">{story.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Quote}
                title="Stories Coming Soon"
                description="As athletes, parents, and coaches share their Stellar journey, their stories will appear here — reviewed and approved by our team."
              />
            )}
          </div>
        </Container>
      </section>

      {/* SPONSOR CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-800 to-red-900 py-20 sm:py-24">
        <Container className="relative flex flex-col items-center gap-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <Sparkles className="h-7 w-7 text-white" />
          </span>
          <h2 className="font-display max-w-2xl text-3xl uppercase leading-tight tracking-wide text-white sm:text-4xl">
            Become a Stellar Sponsor
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-white/75">
            Individuals and businesses can help support athletes and programs through
            sponsorship — fueling training, equipment, academics, and mentorship.
          </p>
          <Button href="/get-involved/corporate-sponsorship" variant="white" size="lg">
            Explore Sponsorship Opportunities
          </Button>
        </Container>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-white py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <HeartHandshake className="h-6 w-6 text-red-700" />
            </span>
            <SectionHeading
              className="mt-5"
              eyebrow="Stay Connected"
              title="Join the Stellar Community"
              description="Get program updates, campaign news, and ways to get involved sent straight to your inbox."
            />
            <div className="mt-6 flex items-center gap-2 text-sm text-ink/55">
              <GraduationCap className="h-4 w-4 text-red-700" />
              No spam — just Stellar updates.
            </div>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-paper p-7 sm:p-8">
            <NewsletterForm />
          </div>
        </Container>
      </section>
    </>
  );
}
