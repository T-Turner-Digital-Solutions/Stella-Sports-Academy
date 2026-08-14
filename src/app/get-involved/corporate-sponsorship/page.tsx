import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CorporateSponsorshipForm } from "@/components/forms/CorporateSponsorshipForm";
import { sponsorshipTiers } from "@/content/sponsorship";
import { cn } from "@/lib/utils";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Corporate Sponsorship",
  description: `Become a corporate sponsor of ${site.name} and support youth athletic, academic, and mentorship programs.`,
};

export default function CorporateSponsorshipPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner With Stella"
        title="Corporate Sponsorship"
        description="Align your business with a mission that builds champions on the field, in the classroom, and in life."
      />

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Sponsorship Levels" title="Choose a Level" align="center" className="mx-auto" />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {sponsorshipTiers.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  "flex flex-col gap-4 rounded-2xl border p-6",
                  tier.featured ? "border-red-700 bg-red-100 shadow-lg" : "border-ink/10 bg-paper"
                )}
              >
                <p className="font-display text-lg uppercase tracking-wide text-ink">{tier.name}</p>
                <p className="text-xs leading-relaxed text-ink/60">{tier.tagline}</p>
                <ul className="mt-2 flex flex-col gap-2">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-xs text-ink/70">
                      <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-red-700" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 sm:py-24">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Ready to Partner?" title="Become a Corporate Sponsor" />
          <div className="mt-10 rounded-2xl border border-ink/10 bg-white p-7 sm:p-9">
            <CorporateSponsorshipForm />
          </div>
        </Container>
      </section>
    </>
  );
}
