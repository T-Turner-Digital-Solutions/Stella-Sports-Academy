import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Donation Policy" };

export default function DonationPolicyPage() {
  return (
    <LegalLayout title="Donation Policy" lastUpdated="Effective upon launch">
      <p>
        {site.name} is a {site.orgType} (EIN {site.ein}). This policy explains how donations are
        processed and used.
      </p>

      <div>
        <h2>How Donations Are Processed</h2>
        <p>
          Donations made through this site are processed securely by Stripe. {site.name} does not
          store your full card number. You will receive an emailed confirmation after a
          successful donation.
        </p>
      </div>

      <div>
        <h2>Designations</h2>
        <p>
          Donors may designate gifts to a specific fund or campaign (such as Sponsor an Athlete,
          Equipment Fund, or Scholarship Fund) or to the General Fund / Greatest Need. Stella will
          make reasonable efforts to honor donor designations; if a designated fund is
          fully met or discontinued, funds may be redirected to a similar program area at the
          organization&rsquo;s discretion.
        </p>
      </div>

      <div>
        <h2>Recurring Donations</h2>
        <p>
          Monthly recurring donations can be modified or canceled at any time. Once available,
          recurring donors will be able to manage their gift through their donor account, or by
          contacting us directly.
        </p>
      </div>

      <div>
        <h2>Tax Deductibility</h2>
        <p>
          Donations to {site.name} are tax-deductible to the extent allowed by law. Please consult
          your tax advisor regarding your specific situation.
        </p>
      </div>

      <div>
        <h2>Anonymous Donations</h2>
        <p>
          Donors may choose to give anonymously. Anonymous donors&rsquo; names are not displayed
          publicly on campaign pages.
        </p>
      </div>

      <p className="text-xs italic text-ink/45">
        See also our{" "}
        <a href="/refund-policy" className="text-red-700 underline">
          Refund Policy
        </a>
        . This policy is a general template and has not yet been reviewed by legal counsel.
      </p>
    </LegalLayout>
  );
}
