import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { events } from "@/content/news";
import { formatDate } from "@/lib/utils";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Events",
  description: `Training camps, clinics, fundraisers, and community events hosted by ${site.name}.`,
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Join Us"
        title="Events"
        description="Training camps, clinics, fundraisers, and community events — all in one place."
      />

      <section className="bg-white py-20 sm:py-28">
        <Container>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Link
                  key={event.slug}
                  href={`/events/${event.slug}`}
                  className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-paper p-6 transition-shadow hover:shadow-lg"
                >
                  <Badge tone="red">{event.type}</Badge>
                  <h2 className="font-display text-lg uppercase tracking-wide text-ink">{event.title}</h2>
                  <div className="flex flex-col gap-1.5 text-sm text-ink/60">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" /> {formatDate(event.date)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" /> {event.time}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {event.location}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="No Upcoming Events Yet"
              description={`Training camps, clinics, and fundraisers will be posted here as ${site.name} schedules them.`}
            />
          )}
        </Container>
      </section>
    </>
  );
}
