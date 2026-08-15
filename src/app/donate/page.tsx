import type { Metadata } from "next";
import { ShieldCheck, Repeat, HeartHandshake } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { DonateForm } from "@/components/forms/DonateForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Donate",
  description: `Support ${site.name} with a one-time or monthly donation. Every gift funds athletic training, academics, and mentorship for young athletes.`,
};

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ designation?: string; amount?: string; frequency?: string }>;
}) {
  const { designation, amount, frequency } = await searchParams;
  const parsedAmount = amount ? Number(amount) : undefined;

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
              title="Secure & PCI-Compliant"
              description="Payments are processed through Stripe. Stellar never sees or stores your card information."
            />
            <InfoRow
              icon={Repeat}
              title="Give Monthly"
              description="Join the Stellar Champions Club — recurring donors who provide steady, dependable support all year."
            />
            <InfoRow
              icon={HeartHandshake}
              title="100% Goes to the Mission"
              description="Every designation funds real program needs — training, academics, equipment, and mentorship."
            />
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper p-7 sm:p-9">
            <DonateForm
              initialDesignation={designation}
              initialAmount={Number.isFinite(parsedAmount) ? parsedAmount : undefined}
              initialFrequency={frequency === "monthly" ? "monthly" : undefined}
            />
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
