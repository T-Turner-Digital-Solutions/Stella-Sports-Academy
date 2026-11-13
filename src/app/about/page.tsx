import type { Metadata } from "next";
import Image from "next/image";
import { Compass, Eye, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { LeaderCard } from "@/components/leadership/LeaderCard";
import { site } from "@/content/site";
import { leadership } from "@/content/leadership";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${site.name}'s mission, vision, story, and the leadership team behind our work with young athletes.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Stellar"
        title="Who We Are"
        description={site.description}
      />

      {/* MISSION / VISION */}
      <section className="bg-white py-20 sm:py-28">
        <Container className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-ink/10 bg-paper p-8 sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Compass className="h-6 w-6 text-red-700" />
            </span>
            <h2 className="font-display mt-6 text-2xl uppercase tracking-wide text-ink">Our Mission</h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              Stellar Sports Academy exists to empower young athletes through comprehensive
              athletic training, educational support, mentorship, and life-skills development.
              We&rsquo;re focused on helping young athletes gain access to the resources, support, and
              guidance needed to succeed in sports, academics, careers, and life.
            </p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-paper p-8 sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Eye className="h-6 w-6 text-red-700" />
            </span>
            <h2 className="font-display mt-6 text-2xl uppercase tracking-wide text-ink">Our Vision</h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              Stellar Sports Academy envisions a future where every young athlete has the
              resources, support, and guidance necessary to succeed in sports, education, career
              pursuits, and life.
            </p>
          </div>
        </Container>
      </section>

      {/* OUR STORY */}
      <section className="bg-paper py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-700 lg:hidden">
            <BookOpen className="h-6 w-6 text-white" />
          </span>
          <SectionHeading eyebrow="Where It Began" title="Our Story" />
          <div className="space-y-4 text-base leading-relaxed text-ink/70">
            <p>
              Stellar Sports Academy was founded on a simple belief: talent is everywhere, but
              opportunity isn&rsquo;t. Too many young athletes — especially those from underserved
              communities — are held back not by ability, but by access to quality coaching,
              academic support, and mentorship.
            </p>
            <p>
              Stellar was created to close that gap directly, combining athletic development with
              academics, mentorship, and life-skills training so athletes are supported as whole
              people, not just competitors.
            </p>
          </div>
        </Container>
      </section>

      {/* FOUNDER */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "2000 / 714" }}>
            <Image
              src="/brand/sections/founder-story-banner.webp"
              alt="Founder's Message: Founder Story. Stellar Sports Academy was founded to give young athletes the same access to training, academic support, and mentorship that too many communities go without — and to make sure sports become a launchpad for life, not just a season. Justin Woodall, Founder & President."
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-cover object-center"
            />
          </div>
          <p className="mt-4 text-center text-sm italic text-ink/45">
            Full founder biography coming soon — this section will be updated with approved
            organizational content.
          </p>
        </Container>
      </section>

      {/* LEADERSHIP */}
      <section className="bg-paper py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Meet the Team" title="Our Leadership" align="center" className="mx-auto" />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((leader) => (
              <LeaderCard key={leader.name} leader={leader} />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-ink py-16">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display max-w-xl text-2xl uppercase tracking-wide text-white sm:text-3xl">
            Ready to help build the next generation of champions?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/donate" variant="white" size="lg">
              Donate Now
            </Button>
            <Button href="/get-involved" variant="outline-light" size="lg">
              Get Involved
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
