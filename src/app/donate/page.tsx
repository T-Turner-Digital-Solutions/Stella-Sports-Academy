import type { Metadata } from "next";
import { ShieldCheck, Repeat, HeartHandshake, ExternalLink } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";
import { donationDesignations } from "@/content/donation";
import { ZEFFY_GENERAL_DONATION_URL } from "@/content/zeffy";

export const metadata: Metadata = {
  title: "Donate",
  description: `Support ${site.name} with a one-time or monthly donation. Every gift funds athletic training, academics, and mentorship for young athletes.`,
};

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ designation?: string; amount?: string; frequency?: string }>;
}) {
  const { designation } = await searchParams;
  const designationLabel = donationDesignations.find((d) => d.value === designation)?.label;

  return (
    <>
      <PageHero
        eyebrow="Give Today"
        title="Donate to Stellar"
        description="Your gift funds athletic training, academic support, mentorship, and life-skills development for young athletes who need it most."
      />

      <section className="bg-white py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-6">
            <InfoRow
              icon={ShieldCheck}
              title="Secure Giving via Zeffy"
              description="Payments are processed securely through Zeffy, a platform built for nonprofits — Stellar never sees or stores your card information."
            />
            <InfoRow
              icon={Repeat}
              title="Give Monthly"
              description="Join the Stellar Champions Club — recurring donors who provide steady, dependable support all year. Choose Monthly on the giving page."
            />
            <InfoRow
              icon={HeartHandshake}
              title="100% Goes to the Mission"
              description="Zeffy charges nonprofits nothing to fundraise, so the full amount of your gift goes directly to Stellar's programs."
            />
          </div>

          <div className="flex flex-col gap-6 rounded-2xl border border-ink/10 bg-paper p-7 sm:p-9">
            <div>
              <p className="font-display text-xl uppercase tracking-wide text-ink">Make a Gift</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                You&rsquo;ll choose your amount and frequency, and complete your gift securely on
                Stellar&rsquo;s Zeffy giving page — it only takes a minute.
              </p>
            </div>

            {designationLabel && (
              <div className="rounded-xl border border-red-700/20 bg-red-100 px-4 py-3 text-sm text-ink/80">
                Supporting <strong>{designationLabel}</strong>? Please mention it in the message
                field on the giving page so we can direct your gift accordingly.
              </div>
            )}

            <Button href={ZEFFY_GENERAL_DONATION_URL} size="lg" className="self-start">
              Give Now via Zeffy
              <ExternalLink className="h-4 w-4" />
            </Button>

            <p className="text-xs text-ink/45">
              You&rsquo;ll receive a tax receipt directly from Zeffy for your records.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

function InfoRow({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-ink/10 bg-paper p-5">
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
        <Icon className="h-5 w-5 text-red-700" />
      </span>
      <div>
        <p className="font-semibold text-ink">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink/60">{description}</p>
      </div>
    </div>
  );
}
