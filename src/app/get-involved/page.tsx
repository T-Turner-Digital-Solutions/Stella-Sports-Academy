import type { Metadata } from "next";
import { HeartHandshake, Building2, Users, CalendarDays, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Get Involved",
  description: `Support ${site.name} by donating, sponsoring an athlete, becoming a corporate sponsor, or volunteering.`,
};

const paths = [
  {
    title: "Sponsor an Athlete",
    description: "Cover training, equipment, academics, and mentorship for a young athlete in need.",
    href: "/get-involved/sponsor-an-athlete",
    icon: HeartHandshake,
  },
  {
    title: "Corporate Sponsorship",
    description: "Partner with Stella and reach the community while supporting youth development.",
    href: "/get-involved/corporate-sponsorship",
    icon: Building2,
  },
  {
    title: "Volunteer",
    description: "Coach, mentor, tutor, or support Stella events and operations.",
    href: "/get-involved/volunteer",
    icon: Users,
  },
  {
    title: "Attend an Event",
    description: "Join a training camp, clinic, fundraiser, or community event.",
    href: "/events",
    icon: CalendarDays,
  },
];

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        eyebrow="Join the Mission"
        title="Get Involved"
        description="There are many ways to support Stella's athletes — find the one that fits you."
      />

      <section className="bg-white py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {paths.map((path) => (
              <Link
                key={path.href}
                href={path.href}
                className="group flex flex-col gap-5 rounded-2xl border border-ink/10 bg-paper p-8 transition-all duration-300 hover:-translate-y-1 hover:border-maroon-700/30 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-maroon-100 transition-colors group-hover:bg-maroon-700">
                  <path.icon className="h-7 w-7 text-maroon-700 transition-colors group-hover:text-white" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="font-display text-xl uppercase tracking-wide text-ink">{path.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{path.description}</p>
                </div>
                <span className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-maroon-700">
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
