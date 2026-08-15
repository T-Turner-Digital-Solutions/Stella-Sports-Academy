import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { VolunteerForm } from "@/components/forms/VolunteerForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Volunteer",
  description: `Volunteer with ${site.name} as a coach, trainer, mentor, tutor, or event volunteer.`,
};

export default function VolunteerPage() {
  return (
    <>
      <PageHero
        eyebrow="Get Involved"
        title="Volunteer With Stellar"
        description="From coaching to tutoring to event support, Stellar runs on volunteers who show up for young athletes."
      />

      <section className="bg-white py-20 sm:py-24">
        <Container className="max-w-3xl">
          <VolunteerForm />
        </Container>
      </section>
    </>
  );
}
