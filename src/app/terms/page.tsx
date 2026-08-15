import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Use" lastUpdated="Effective upon launch">
      <p>
        These Terms of Use govern your use of {site.name}&rsquo;s website. By using this site,
        you agree to these terms.
      </p>

      <div>
        <h2>Use of This Site</h2>
        <p>
          This website is provided for informational purposes, to facilitate donations, program
          applications, and communication with {site.name}. You agree to use this site lawfully
          and not to interfere with its operation or security.
        </p>
      </div>

      <div>
        <h2>Content</h2>
        <p>
          All content on this site — including text, graphics, and the Steller Sports Academy
          logo — is the property of {site.name} unless otherwise noted, and may not be used
          without permission.
        </p>
      </div>

      <div>
        <h2>Donations</h2>
        <p>
          Donations made through this site are subject to our{" "}
          <a href="/donation-policy" className="text-red-700 underline">
            Donation Policy
          </a>{" "}
          and{" "}
          <a href="/refund-policy" className="text-red-700 underline">
            Refund Policy
          </a>
          .
        </p>
      </div>

      <div>
        <h2>No Warranty</h2>
        <p>
          This site is provided &ldquo;as is&rdquo; without warranties of any kind. {site.name}{" "}
          does not guarantee the site will be error-free or uninterrupted.
        </p>
      </div>

      <div>
        <h2>Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, {site.name} is not liable for any indirect,
          incidental, or consequential damages arising from your use of this site.
        </p>
      </div>

      <div>
        <h2>Changes to These Terms</h2>
        <p>We may update these terms from time to time. Continued use of the site constitutes acceptance of any changes.</p>
      </div>

      <div>
        <h2>Contact Us</h2>
        <p>
          Questions about these terms can be sent through our{" "}
          <a href="/contact" className="text-red-700 underline">
            Contact page
          </a>
          .
        </p>
      </div>

      <p className="text-xs italic text-ink/45">
        This policy is a general template and has not yet been reviewed by legal counsel. Steller
        Sports Academy should have this policy reviewed by an attorney before relying on it.
      </p>
    </LegalLayout>
  );
}
