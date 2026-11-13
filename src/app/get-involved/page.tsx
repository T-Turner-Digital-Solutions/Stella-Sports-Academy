import type { Metadata } from "next";
import Image from "next/image";
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
    href: "/get-involved/sponsor-an-athlete",
    image: "/brand/get-involved/sponsor-an-athlete.webp",
    width: 860,
    height: 350,
  },
  {
    title: "Corporate Sponsorship",
    href: "/get-involved/corporate-sponsorship",
    image: "/brand/get-involved/corporate-sponsorship.webp",
    width: 860,
    height: 350,
  },
  {
    title: "Volunteer",
    href: "/get-involved/volunteer",
    image: "/brand/get-involved/volunteer.webp",
    width: 860,
    height: 355,
  },
  {
    title: "Attend an Event",
    href: "/events",
    image: "/brand/get-involved/attend-an-event.webp",
    width: 860,
    height: 355,
  },
];

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        eyebrow="Join the Mission"
        title="Get Involved"
        description="There are many ways to support Stellar's athletes — find the one that fits you."
      />

      <section className="bg-white py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {paths.map((path) => (
              <Link
                key={path.href}
                href={path.href}
                className="group overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1"
              >
                <Image
                  src={path.image}
                  alt={path.title}
                  width={path.width}
                  height={path.height}
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full"
                />
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
