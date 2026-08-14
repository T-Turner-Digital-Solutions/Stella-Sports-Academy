import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { programs } from "@/content/programs";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Programs",
  description: `Explore ${site.name}'s programs: athletic development, academic support, life skills, and mentorship.`,
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="What We Offer"
        title="Our Programs"
        description="Steller supports young athletes across four connected areas — because success on the field depends on support everywhere else, too."
      />

      <section className="bg-white py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((program) => (
              <ProgramCard key={program.slug} program={program} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 sm:py-24">
        <Container className="flex flex-col items-center gap-6 text-center">
          <SectionHeading
            eyebrow="Ready to Join?"
            title="Apply to Join Steller"
            description="Athlete applications are reviewed by our team, with program placement based on need and availability."
            align="center"
          />
          <Button href="/apply" size="lg">
            Start an Athlete Application
          </Button>
        </Container>
      </section>
    </>
  );
}
