import type { Metadata } from "next";
import { Compass, Eye, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { LeaderCard } from "@/components/leadership/LeaderCard";
import { site } from "@/content/site";
import { leadership, founder } from "@/content/leadership";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${site.name}'s mission, vision, story, and the leadership team behind our work with young athletes.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Stella"
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
              Stella Sports Academy exists to empower young athletes through comprehensive
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
              Stella Sports Academy envisions a future where every young athlete has the
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
              Stella Sports Academy was founded on a simple belief: talent is everywhere, but
              opportunity isn&rsquo;t. Too many young athletes — especially those from underserved
              communities — are held back not by ability, but by access to quality coaching,
              academic support, and mentorship.
            </p>
            <p>
              Stella was created to close that gap directly, combining athletic development with
              academics, mentorship, and life-skills training so athletes are supported as whole
              people, not just competitors.
            </p>
          </div>
        </Container>
      </section>

      {/* FOUNDER */}
      <section className="bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Founder's Message" title="Founder Story" />
          <div className="mt-10 grid gap-10 rounded-3xl border border-ink/10 bg-paper p-8 sm:p-10 lg:grid-cols-[280px_1fr] lg:p-12">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-gradient-to-br from-red-700 to-red-900 text-4xl font-bold text-white">
                JW
              </div>
              <p className="font-display mt-5 text-xl uppercase tracking-wide text-ink">
                {founder.name}
              </p>
              <p className="mt-1 text-sm font-semibold text-red-700">{founder.title}</p>
            </div>
            <div className="flex flex-col justify-center gap-4 text-base leading-relaxed text-ink/70">
              <p>
                Stella Sports Academy was founded to give young athletes the same access to
                training, academic support, and mentorship that too many communities go without —
                and to make sure sports become a launchpad for life, not just a season.
              </p>
              <p className="text-sm italic text-ink/50">
                Full founder biography and athletic history coming soon — this section will be
                updated with approved organizational content.
              </p>
            </div>
          </div>
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
