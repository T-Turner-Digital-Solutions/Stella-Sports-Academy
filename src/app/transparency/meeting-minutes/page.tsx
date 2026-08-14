import type { Metadata } from "next";
import { FileText, CalendarClock } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { publicMeetingMinutes } from "@/content/transparency";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Meeting Minutes",
  description: `Publicly released board meeting minutes for ${site.name}, organized by year.`,
};

export default function MeetingMinutesPage() {
  return (
    <>
      <PageHero
        eyebrow="Governance Records"
        title="Meeting Minutes"
        description="Board meeting minutes are published here only after board approval for public release. Internal deliberations remain private in the board portal."
      />

      <section className="bg-white py-20 sm:py-24">
        <Container>
          {publicMeetingMinutes.length > 0 ? (
            <div className="flex flex-col gap-10">
              {publicMeetingMinutes.map((record) => (
                <div key={record.year}>
                  <h2 className="font-display text-2xl uppercase tracking-wide text-ink">{record.year}</h2>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {record.meetings.map((meeting) => (
                      <div
                        key={meeting.title}
                        className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-paper px-5 py-4"
                      >
                        <div>
                          <p className="font-semibold text-ink">{meeting.title}</p>
                          <p className="text-xs text-ink/50">{meeting.date}</p>
                        </div>
                        {meeting.fileUrl ? (
                          <a
                            href={meeting.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm font-semibold text-maroon-700 hover:underline"
                          >
                            <FileText className="h-4 w-4" />
                            View PDF
                          </a>
                        ) : (
                          <span className="text-xs text-ink/40">Pending release</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CalendarClock}
              title="No Public Minutes Published Yet"
              description="As the board approves specific meeting minutes for public release, they'll be organized here by year."
            />
          )}
        </Container>
      </section>
    </>
  );
}
