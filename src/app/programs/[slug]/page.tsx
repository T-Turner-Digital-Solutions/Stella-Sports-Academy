import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { programs } from "@/content/programs";

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  if (!program) return {};
  return { title: program.name, description: program.summary };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  if (!program) notFound();

  const Icon = program.icon;
  const related = programs.filter((p) => p.slug !== program.slug).slice(0, 3);

  return (
    <>
      <PageHero eyebrow="Program" title={program.name} description={program.heroDescription} />

      <section className="bg-white py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-maroon-100">
              <Icon className="h-8 w-8 text-maroon-700" strokeWidth={1.75} />
            </div>
            <SectionHeading className="mt-6" title="What's Included" />
            <div className="mt-8 flex flex-col gap-3">
              <Button href="/apply" size="md">
                Apply Now
              </Button>
              <Button href="/donate" variant="ghost" size="md" className="border border-ink/15">
                Support This Program
              </Button>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {program.offerings.map((offering) => (
              <li
                key={offering}
                className="flex items-start gap-3 rounded-xl border border-ink/10 bg-paper px-4 py-3.5 text-sm text-ink/75"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-maroon-700" />
                {offering}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-paper py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Explore More" title="Other Programs" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <ProgramCard key={p.slug} program={p} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
