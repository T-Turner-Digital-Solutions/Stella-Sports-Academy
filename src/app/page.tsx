import Image from "next/image";
import { ArrowRight, GraduationCap, HeartHandshake, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ImpactStatCard } from "@/components/ui/ImpactStatCard";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { site } from "@/content/site";
import { programs } from "@/content/programs";
import { campaigns } from "@/content/campaigns";
import { impactStats } from "@/content/impact";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-black">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1600 800"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden
        >
          <defs>
            <filter id="hero-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="hero-arc-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2f6fd" />
              <stop offset="35%" stopColor="#4bc3ef" />
              <stop offset="100%" stopColor="#0066a8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="hero-arc-2" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#e2f6fd" />
              <stop offset="35%" stopColor="#4bc3ef" />
              <stop offset="100%" stopColor="#0066a8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 820 -20 C 600 60, 120 90, -60 190"
            stroke="url(#hero-arc-1)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#hero-glow)"
          />
          <path
            d="M 780 -20 C 1000 10, 1500 60, 1660 90"
            stroke="url(#hero-arc-2)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#hero-glow)"
          />
          <path
            d="M 780 820 C 1000 740, 1500 690, 1660 660"
            stroke="url(#hero-arc-2)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#hero-glow)"
          />
        </svg>

        <Container className="relative grid min-h-[80vh] items-center gap-12 py-24 lg:grid-cols-2 lg:py-28">
          <div className="animate-fade-up">
            <div className="flex items-center gap-3">
              <span className="h-5 w-1 flex-shrink-0 rounded-full bg-red-600" />
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                Welcome to {site.name}
              </p>
            </div>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] text-white sm:text-6xl">
              Empowering Young Athletes. Building Champions for Life.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
              Providing training, academic support, and mentorship for young athletes.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/donate" variant="primary" size="lg">
                Donate
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                href="/programs"
                variant="ghost"
                size="lg"
                className="border-2 border-red-500 text-white shadow-[0_0_20px_-4px_rgba(0,152,221,0.8)] hover:bg-red-700/10"
              >
                Explore Programs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Image
              src="/brand/stella-lockup.png"
              alt={`${site.name} logo`}
              width={1514}
              height={932}
              priority
              className="h-auto w-full max-w-[260px] drop-shadow-[0_0_50px_rgba(0,152,221,0.6)] sm:max-w-sm lg:max-w-lg"
            />
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
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "2000 / 668" }}>
            <Image
              src="/brand/sections/core-values-banner.webp"
              alt="What we stand for: Core Values — Excellence, Discipline, Education, Character, Community"
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-cover object-center"
            />
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
        <div className="relative mb-14 w-full overflow-hidden" style={{ aspectRatio: "2000 / 112" }}>
          <Image
            src="/brand/sections/campaigns-banner-top.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden
          />
        </div>
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
      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "2000 / 667" }}>
            <Image
              src="/brand/sections/why-stellar-matters-banner.webp"
              alt="The Opportunity Gap: Why Stellar Matters. Many young athletes face real financial barriers that keep them from the resources their potential deserves. Stellar Sports Academy exists to help close that gap, connecting young athletes with quality coaching, athletic development, academic resources, college recruiting support, mentoring, and leadership opportunities, regardless of their family's ability to pay."
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-cover object-center"
            />
          </div>
        </Container>
      </section>

      {/* SUCCESS STORIES */}
      <section className="bg-paper py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Meet Our Founder" title="Get to Know Justin" align="center" className="mx-auto" />
          <div className="mx-auto mt-12 max-w-3xl">
            <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: "16 / 9" }}>
              <iframe
                src="https://www.youtube-nocookie.com/embed/cd4GrnD51aE"
                title="Former Alabama Safety Justin Woodall's Career, Coach Saban's Influence, & AIO Training — The Modest Sports Show"
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <p className="mt-3 text-center text-xs text-ink/45">
              From &ldquo;The Modest Sports Show&rdquo; — Justin&rsquo;s career, Coach Saban&rsquo;s influence,
              and AIO Training.
            </p>
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
