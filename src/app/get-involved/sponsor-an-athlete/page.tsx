import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { athleteSponsorshipOptions } from "@/content/sponsorship";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Sponsor an Athlete",
  description: `Sponsor a young athlete at ${site.name} — funding training, equipment, academics, and mentorship.`,
};

const supports = [
  "Training",
  "Equipment",
  "Academic resources",
  "Mentorship",
  "Transportation or program costs where applicable",
  "Athlete development",
];

export default function SponsorAthletePage() {
  return (
    <>
      <PageHero
        eyebrow="Give Directly"
        title="Sponsor an Athlete"
        description="Your sponsorship gives a young athlete direct access to training, academics, and mentorship — the full Stellar experience."
      />

      <section className="bg-white py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Your Sponsorship Supports" title="What Your Gift Funds" />
            <ul className="mt-8 flex flex-col gap-3">
              {supports.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-ink/10 bg-paper px-4 py-3.5 text-sm text-ink/75">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-700" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-ink/55">
              Stellar never publishes private information about the young athletes it serves.
              Sponsorship connects you to the mission — not to identifiable personal details about
              a specific minor.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {athleteSponsorshipOptions.map((option) => (
              <div
                key={option.amount}
                className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-paper p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-display text-xl uppercase tracking-wide text-ink">{option.amount}</p>
                  <p className="mt-1 text-sm text-ink/60">{option.description}</p>
                </div>
                <Button
                  href={
                    option.amount === "Full Athlete Sponsorship"
                      ? "/contact?reason=Athlete%20Programs"
                      : `/donate?designation=sponsor-an-athlete&amount=${parseInt(option.amount, 10)}&frequency=monthly`
                  }
                  size="md"
                  className="flex-shrink-0"
                >
                  {option.amount === "Full Athlete Sponsorship" ? "Contact Us" : "Sponsor Now"}
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
