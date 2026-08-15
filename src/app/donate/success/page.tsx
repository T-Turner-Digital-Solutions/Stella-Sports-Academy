import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getStripe } from "@/lib/stripe";
import { formatCurrency, formatDate } from "@/lib/utils";
import { designationLabels, type CampaignDesignation } from "@/content/campaigns";

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false },
};

export default async function DonateSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const stripe = getStripe();

  let amountCents: number | null = null;
  let designation: string | null = null;
  let referenceId: string | null = null;
  let date = new Date().toISOString();

  if (stripe && session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      amountCents = session.amount_total ?? null;
      designation = (session.metadata?.designation as string) ?? null;
      referenceId = session.id;
      if (session.created) date = new Date(session.created * 1000).toISOString();
    } catch {
      // Session not found or Stripe error — fall back to the generic thank-you below.
    }
  }

  return (
    <section className="bg-white py-24 sm:py-32">
      <Container className="max-w-xl text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink">
          <CheckCircle2 className="h-8 w-8 text-white" />
        </span>
        <h1 className="font-display mt-6 text-3xl uppercase tracking-wide text-ink sm:text-4xl">
          Thank You for Supporting
          <br />
          Stellar Sports Academy
        </h1>

        {amountCents !== null ? (
          <div className="mt-8 space-y-2 rounded-2xl border border-ink/10 bg-paper p-6 text-left text-sm">
            <Row label="Amount" value={formatCurrency(amountCents)} />
            <Row label="Date" value={formatDate(date)} />
            {designation && (
              <Row
                label="Designation"
                value={designationLabels[designation as CampaignDesignation] ?? designation}
              />
            )}
            {referenceId && <Row label="Reference #" value={referenceId} />}
          </div>
        ) : (
          <p className="mt-6 text-base leading-relaxed text-ink/65">
            Your generosity helps young athletes access the training, academics, and mentorship
            they need to succeed. A confirmation email is on its way.
          </p>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/">Back to Home</Button>
          <Button href="/impact" variant="ghost" className="border border-ink/15">
            See Our Impact
          </Button>
        </div>
      </Container>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-ink/10 py-2 last:border-0">
      <span className="text-ink/55">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}
