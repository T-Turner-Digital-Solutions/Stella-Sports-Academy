import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="Effective upon launch">
      <p>
        {site.name} (&ldquo;Stella,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) respects your
        privacy. This policy explains what information we collect through this website, how we
        use it, and the choices you have. This policy applies to stellasportsacademy.org and
        related forms and donation pages.
      </p>

      <div>
        <h2>Information We Collect</h2>
        <p>We collect information you provide directly, including:</p>
        <ul>
          <li>Contact information (name, email, phone) submitted through forms</li>
          <li>Donation information, processed securely by our payment processor, Stripe</li>
          <li>Athlete application information, submitted by a parent or guardian</li>
          <li>Volunteer and sponsorship inquiry details</li>
          <li>Email newsletter sign-up information</li>
        </ul>
      </div>

      <div>
        <h2>How We Use Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Respond to inquiries and process applications</li>
          <li>Process and acknowledge donations, and issue receipts</li>
          <li>Communicate program updates, campaigns, and organizational news</li>
          <li>Improve our programs and website</li>
          <li>Comply with legal and financial reporting obligations</li>
        </ul>
      </div>

      <div>
        <h2>Information About Minors</h2>
        <p>
          Athlete applications may include information about minors, submitted by a parent or
          guardian. This information is kept confidential, is never published publicly, and is
          accessible only to authorized Stella program staff.
        </p>
      </div>

      <div>
        <h2>Payment Information</h2>
        <p>
          Donations are processed by Stripe, a PCI-compliant payment processor. Stella does not
          store full credit card numbers on its servers.
        </p>
      </div>

      <div>
        <h2>Information Sharing</h2>
        <p>
          Stella does not sell personal information. We may share information with service
          providers who help us operate this website (such as our payment processor and email
          delivery provider), or when required by law.
        </p>
      </div>

      <div>
        <h2>Your Choices</h2>
        <p>
          You may unsubscribe from email communications at any time using the link in any email,
          or by contacting us directly. You may request access to, correction of, or deletion of
          your personal information by contacting us.
        </p>
      </div>

      <div>
        <h2>Contact Us</h2>
        <p>
          Questions about this policy can be sent through our{" "}
          <a href="/contact" className="text-red-700 underline">
            Contact page
          </a>
          .
        </p>
      </div>

      <p className="text-xs italic text-ink/45">
        This policy is a general template and has not yet been reviewed by legal counsel. Stella
        Sports Academy should have this policy reviewed by an attorney before relying on it.
      </p>
    </LegalLayout>
  );
}
