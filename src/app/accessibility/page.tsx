import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Accessibility" };

export default function AccessibilityPage() {
  return (
    <LegalLayout title="Accessibility Statement" lastUpdated="Effective upon launch">
      <p>
        {site.name} is committed to making this website usable by the widest possible audience,
        including people with disabilities.
      </p>

      <div>
        <h2>Our Approach</h2>
        <p>This site is built with accessibility in mind, including:</p>
        <ul>
          <li>Semantic HTML and proper heading structure</li>
          <li>Keyboard navigable menus, forms, and interactive elements</li>
          <li>Visible focus states for keyboard users</li>
          <li>Descriptive alt text for meaningful images</li>
          <li>Sufficient color contrast between text and backgrounds</li>
          <li>Labeled form fields with clear error messaging</li>
        </ul>
      </div>

      <div>
        <h2>Ongoing Work</h2>
        <p>
          Accessibility is an ongoing effort. As this site grows, we will continue testing and
          improving it against modern accessibility standards (WCAG 2.1 AA as a guideline).
        </p>
      </div>

      <div>
        <h2>Feedback</h2>
        <p>
          If you encounter an accessibility barrier on this site, please let us know through our{" "}
          <a href="/contact" className="text-red-700 underline">
            Contact page
          </a>{" "}
          so we can address it.
        </p>
      </div>
    </LegalLayout>
  );
}
