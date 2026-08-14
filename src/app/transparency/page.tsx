import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ShieldCheck, Landmark, ScrollText } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { leadership } from "@/content/leadership";
import { publicDocuments } from "@/content/transparency";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Transparency",
  description: `${site.name}'s governance, board of directors, and public financial information.`,
};

const documentCategories = [
  "Governance",
  "Financial",
  "IRS Filing",
  "Policy",
  "Grant & Foundation",
] as const;

export default function TransparencyPage() {
  return (
    <>
      <PageHero
        eyebrow="Trust & Accountability"
        title="Transparency"
        description="Stella Sports Academy is committed to operating openly. This page shares our nonprofit status, governance, and public records."
      />

      <section className="bg-white py-20 sm:py-24">
        <Container className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink/10 bg-paper p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <ShieldCheck className="h-6 w-6 text-red-700" />
            </span>
            <h2 className="font-display mt-6 text-xl uppercase tracking-wide text-ink">501(c)(3) Status</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              {site.name} is recognized by the IRS as a {site.orgType}. Donations are tax-deductible
              to the extent allowed by law.
            </p>
            <Badge tone="red" className="mt-4">
              EIN {site.ein}
            </Badge>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-paper p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Landmark className="h-6 w-6 text-red-700" />
            </span>
            <h2 className="font-display mt-6 text-xl uppercase tracking-wide text-ink">Governance</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              Stella is governed by a volunteer Board of Directors that meets regularly to guide
              strategy, review finances, and uphold our mission and bylaws.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Our Board" title="Board of Directors" />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((leader) => (
              <div key={leader.name} className="rounded-xl border border-ink/10 bg-white px-5 py-4">
                <p className="font-semibold text-ink">{leader.name}</p>
                <p className="text-sm text-red-700">{leader.roleLabel}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-ink/45">
            Private residential addresses, personal phone numbers, and signatures are never
            published on this site.
          </p>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Public Records" title="Documents & Filings" />
          <div className="mt-10">
            {publicDocuments.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {publicDocuments.map((doc) => (
                  <a
                    key={doc.title}
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-ink/10 bg-paper px-5 py-4 text-sm font-medium text-ink transition-colors hover:border-red-700/40"
                  >
                    <FileText className="h-5 w-5 flex-shrink-0 text-red-700" />
                    {doc.title}
                  </a>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={ScrollText}
                title="Documents Coming Soon"
                description="Board-approved public documents — including the IRS determination letter, annual reports, and financial summaries — will be published here as they're finalized."
              />
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {documentCategories.map((cat) => (
              <Badge key={cat} tone="neutral">
                {cat}
              </Badge>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-16">
        <Container className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-ink/60">Looking for board meeting records?</p>
          <Link href="/transparency/meeting-minutes" className="font-semibold text-red-700 hover:underline">
            View Public Meeting Minutes →
          </Link>
        </Container>
      </section>
    </>
  );
}
