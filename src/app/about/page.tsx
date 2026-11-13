import type { Metadata } from "next";
import Image from "next/image";
import { BookOpen, HeartHandshake, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { LeaderCard } from "@/components/leadership/LeaderCard";
import { site } from "@/content/site";
import { leadership } from "@/content/leadership";
import { ZEFFY_GENERAL_DONATION_URL } from "@/content/zeffy";

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

      {/* SUPPORT + MISSION SNAPSHOT */}
      <section className="bg-paper py-16 sm:py-20">
        <Container className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center sm:p-10">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <HeartHandshake className="h-6 w-6 text-red-700" />
            </span>
            <h2 className="font-display mt-6 text-xl uppercase tracking-wide text-ink">
              Support Stellar Sports Academy
            </h2>
            <a
              href={ZEFFY_GENERAL_DONATION_URL}
              className="mx-auto mt-6 block w-fit rounded-2xl bg-paper p-5"
            >
              <Image
                src="/brand/zeffy-donate-qr.png"
                alt="QR code to donate to Stellar Sports Academy via Zeffy"
                width={220}
                height={220}
                className="rounded-xl border-2 border-red-700/30"
              />
            </a>
            <p className="mt-4 font-display text-lg uppercase tracking-wide text-ink">Donate Today</p>
            <p className="mt-1 text-sm text-ink/60">
              Scan the QR code, or{" "}
              <a href={ZEFFY_GENERAL_DONATION_URL} className="font-semibold text-red-700 hover:underline">
                click here
              </a>
              , to open Zeffy and make a secure donation.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-ink/10 bg-white p-8 text-center sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Users className="h-6 w-6 text-red-700" />
            </span>
            <h2 className="font-display mt-6 text-xl uppercase tracking-wide text-ink">Our Mission</h2>
            <Image
              src="/brand/stella-mark.png"
              alt=""
              aria-hidden
              width={160}
              height={77}
              className="mt-6 h-auto w-32"
            />
            <p className="font-display mt-4 text-lg italic leading-snug text-red-700">
              Empowering Young Athletes.
              <br />
              Building Champions for Life.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              Providing training, academic support, and mentorship for young athletes.
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
          <Image
            src="/brand/stella-mark.png"
            alt=""
            aria-hidden
            width={160}
            height={77}
            className="mx-auto mt-12 h-auto w-28 opacity-80"
          />
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
