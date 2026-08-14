import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { events } from "@/content/news";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);
  if (!event) return {};
  return { title: event.title, description: event.description };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);
  if (!event) notFound();

  return (
    <>
      <PageHero eyebrow={event.type} title={event.title} description={event.description} />
      <section className="bg-white py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-4 text-base leading-relaxed text-ink/70">
            <p>{event.description}</p>
          </div>
          <aside className="h-fit rounded-2xl border border-ink/10 bg-paper p-6">
            <Badge tone="gold">{event.type}</Badge>
            <div className="mt-5 flex flex-col gap-3 text-sm text-ink/70">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-maroon-700" /> {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-maroon-700" /> {event.time}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-maroon-700" /> {event.location}
              </span>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              {event.registrationUrl && (
                <Button href={event.registrationUrl} size="md">
                  Register
                </Button>
              )}
              <Button href="/get-involved/volunteer" variant="ghost" size="md" className="border border-ink/15">
                Volunteer at This Event
              </Button>
              <Button href="/donate" variant="ghost" size="md" className="border border-ink/15">
                Donate
              </Button>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
