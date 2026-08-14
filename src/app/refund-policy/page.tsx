import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Refund Policy" lastUpdated="Effective upon launch">
      <p>
        {site.name} appreciates the generosity of every donor. This policy explains how refund
        requests are handled.
      </p>

      <div>
        <h2>Requesting a Refund</h2>
        <p>
          If you made a donation in error — such as a duplicate transaction or incorrect amount —
          please contact us within 30 days of the donation through our{" "}
          <a href="/contact" className="text-maroon-700 underline">
            Contact page
          </a>
          , selecting &ldquo;Donation Question&rdquo; as the inquiry type. Include the donation
          date, amount, and the email address used.
        </p>
      </div>

      <div>
        <h2>Review Process</h2>
        <p>
          Refund requests are reviewed individually. Approved refunds are returned to the original
          payment method through Stripe, our payment processor. Processing times may vary
          depending on your bank or card issuer.
        </p>
      </div>

      <div>
        <h2>Recurring Donations</h2>
        <p>
          To cancel a recurring monthly donation, contact us or use your donor account once
          available. Cancellation stops future charges; it does not automatically refund past
          payments.
        </p>
      </div>

      <div>
        <h2>Non-Cash Contributions</h2>
        <p>This policy applies to monetary donations made through this website. In-kind or non-cash contributions are handled on a case-by-case basis.</p>
      </div>

      <p className="text-xs italic text-ink/45">
        This policy is a general template and has not yet been reviewed by legal counsel.
      </p>
    </LegalLayout>
  );
}
