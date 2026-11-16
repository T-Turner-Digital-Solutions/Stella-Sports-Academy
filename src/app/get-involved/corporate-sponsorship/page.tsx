import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CorporateSponsorshipForm } from "@/components/forms/CorporateSponsorshipForm";
import { DonateNowModal } from "@/components/forms/DonateNowModal";
import { stellarNightsIntro, stellarNightsSponsorshipTiers } from "@/content/sponsorship";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Corporate Sponsorship",
  description: `Become a corporate sponsor of ${site.name} and support youth athletic, academic, and mentorship programs.`,
};

export default function CorporateSponsorshipPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner With Stellar"
        title="Corporate Sponsorship"
        description="Align your business with a mission that builds champions on the field, in the classroom, and in life."
      />

      <section className="bg-paper py-20 sm:py-24">
        <Container className="max-w-5xl">
          <SectionHeading eyebrow="Stellar Nights" title="Sponsor Stellar Nights" align="center" className="mx-auto" />
          <p className="mx-auto mt-6 max-w-3xl text-center text-base font-semibold text-ink">
            {stellarNightsIntro.heading}
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-ink/60">
            {stellarNightsIntro.body}
          </p>

          <div className="mt-8 flex justify-center">
            <DonateNowModal />
          </div>
          <p className="mx-auto mt-3 max-w-md text-center text-xs text-ink/45">
            Fill out a short form with your company logo, then donate through Zeffy to receive your donation letter.
          </p>

          <div className="mt-12 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="bg-ink text-xs font-bold uppercase tracking-wide text-white">
                  <th className="px-5 py-3">Partner Level</th>
                  <th className="px-5 py-3">Commitment</th>
                  <th className="px-5 py-3">Sponsor Recognition</th>
                </tr>
              </thead>
              <tbody>
                {stellarNightsSponsorshipTiers.map((tier) => (
                  <tr key={tier.level} className="border-b border-ink/5 last:border-0">
                    <td className="px-5 py-4 font-semibold text-ink">{tier.level}</td>
                    <td className="px-5 py-4 font-bold text-red-700">{tier.commitment}</td>
                    <td className="px-5 py-4 text-ink/70">{tier.recognition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
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
