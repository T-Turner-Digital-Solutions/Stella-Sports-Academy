import type { Metadata } from "next";
import { Mail, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/forms/ContactForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} about donations, programs, sponsorship, volunteering, or media.`,
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="We'd Love to Hear From You"
        title="Contact Us"
        description="Questions about donating, programs, sponsorship, volunteering, or media? Reach out below."
      />

      <section className="bg-white py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-6">
            {site.email && (
              <div className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-paper p-5">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-maroon-100">
                  <Mail className="h-5 w-5 text-maroon-700" />
                </span>
                <div>
                  <p className="font-semibold text-ink">Email</p>
                  <a href={`mailto:${site.email}`} className="text-sm text-maroon-700 hover:underline">
                    {site.email}
                  </a>
                </div>
              </div>
            )}
            <div className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-paper p-5">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-maroon-100">
                <ShieldAlert className="h-5 w-5 text-maroon-700" />
              </span>
              <div>
                <p className="font-semibold text-ink">Protected Submission</p>
                <p className="text-sm text-ink/60">
                  This form is protected against automated spam submissions.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper p-7 sm:p-9">
            <ContactForm initialReason={reason} />
          </div>
        </Container>
      </section>
    </>
  );
}
