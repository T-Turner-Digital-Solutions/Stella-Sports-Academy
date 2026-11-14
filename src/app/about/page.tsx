import type { Metadata } from "next";
import Image from "next/image";
import { HeartHandshake, Users } from "lucide-react";
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
      <section className="bg-white py-10 sm:py-14">
        <Container className="grid items-start gap-6 text-center sm:grid-cols-2">
          <div>
            <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
              <HeartHandshake className="h-4 w-4 text-red-700" />
            </span>
            <h2 className="font-display mt-3 text-base uppercase tracking-wide text-ink">
              Support Stellar Sports Academy
            </h2>
            <a href={ZEFFY_GENERAL_DONATION_URL} className="mx-auto mt-3 block w-fit">
              <Image
                src="/brand/zeffy-donate-qr.png"
                alt="QR code to donate to Stellar Sports Academy via Zeffy"
                width={150}
                height={150}
                className="rounded-xl border-2 border-red-700/30"
              />
            </a>
            <p className="mt-3 font-display text-sm uppercase tracking-wide text-ink">Donate Today</p>
            <p className="mt-1 text-xs text-ink/60">
              Scan the QR code, or{" "}
              <a href={ZEFFY_GENERAL_DONATION_URL} className="font-semibold text-red-700 hover:underline">
                click here
              </a>
              , to open Zeffy and make a secure donation.
            </p>
          </div>

          <div>
            <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
              <Users className="h-4 w-4 text-red-700" />
            </span>
            <h2 className="font-display mt-3 text-base uppercase tracking-wide text-ink">Our Mission</h2>
            <Image
              src="/brand/stella-mark.png"
              alt=""
              aria-hidden
              width={160}
              height={77}
              className="mx-auto mt-3 h-auto w-16"
            />
            <p className="font-display mt-2 text-sm italic leading-snug text-red-700">
              Empowering Young Athletes.
              <br />
              Building Champions for Life.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink/60">
              Providing training, academic support, and mentorship for young athletes.
            </p>
          </div>
        </Container>
      </section>

      {/* OUR STORY */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading eyebrow="Where It Began" title="Our Story" align="center" />
            <p className="mt-6 text-lg leading-relaxed text-ink/70">
              Stellar Sports Academy was founded on a simple belief: talent is everywhere, but
              opportunity isn&rsquo;t. Too many young athletes — especially those from underserved
              communities — are held back not by ability, but by access to quality coaching,
              academic support, and mentorship.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink/70">
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
          <div className="overflow-x-auto sm:overflow-visible">
            <div
              className="relative min-w-[720px] overflow-hidden rounded-2xl sm:min-w-0 sm:w-full"
              style={{ aspectRatio: "2000 / 714" }}
            >
              <Image
                src="/brand/sections/founder-story-banner.webp"
                alt="Founder's Message: Founder Story. Stellar Sports Academy was founded to give young athletes the same access to training, academic support, and mentorship that too many communities go without — and to make sure sports become a launchpad for life, not just a season. Justin Woodall, Founder & President."
                fill
                sizes="(min-width: 1280px) 1280px, 720px"
                className="object-cover object-center"
              />
            </div>
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
