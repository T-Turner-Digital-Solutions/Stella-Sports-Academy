import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { AthleteApplicationForm } from "@/components/forms/AthleteApplicationForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Athlete Application",
  description: `Apply to join ${site.name}'s athletic, academic, and mentorship programs.`,
};

export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Join Stellar"
        title="Athlete Application"
        description="Complete this secure application to apply for Stellar's programs. A parent or guardian must complete this form for any applicant under 18."
      />

      <section className="bg-white py-20 sm:py-24">
        <Container className="max-w-3xl">
          <div className="mb-10 flex items-start gap-3 rounded-2xl border border-ink/10 bg-paper px-5 py-4 text-sm text-ink/65">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-700" />
            <p>
              This application is confidential. Information submitted here is never displayed
              publicly and is reviewed only by authorized Stellar program staff.
            </p>
          </div>
          <AthleteApplicationForm />
        </Container>
      </section>
    </>
  );
}
