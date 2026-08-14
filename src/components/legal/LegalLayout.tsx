import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";

export function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} description={`Last updated: ${lastUpdated}`} />
      <section className="bg-white py-16 sm:py-24">
        <Container className="max-w-3xl">
          <div className="flex flex-col gap-8 text-sm leading-relaxed text-ink/75 [&_h2]:font-display [&_h2]:text-xl [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-ink [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
            {children}
          </div>
        </Container>
      </section>
    </>
  );
}
