import type { Metadata } from "next";
import Image from "next/image";
import { HeartHandshake, BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CorporateDonationStatusToggle } from "@/components/board/CorporateDonationStatusToggle";
import { isDatabaseConfigured } from "@/lib/db";
import { listSponsorshipInquiries } from "@/lib/submissions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Zeffy Corporate Donations" };

export default async function CorporateDonationsPage() {
  const dbReady = isDatabaseConfigured();
  const inquiries = dbReady ? await listSponsorshipInquiries() : [];

  return (
    <Container>
      <PortalPageHero
        title="Zeffy Corporate Donations"
        description="Companies that donated through the Donate Now flow (with their logo) or submitted a corporate sponsorship inquiry — follow up with each one here."
      />

      <div className="mt-6 flex flex-col gap-4">
        {!dbReady || inquiries.length === 0 ? (
          <EmptyState
            theme="blue"
            icon={HeartHandshake}
            title="No Corporate Donations Yet"
            description="When a company donates through Donate Now or submits the sponsorship inquiry form, it will show up here for follow-up."
          />
        ) : (
          inquiries.map((inquiry) => (
            <div key={inquiry.id} className="rounded-xl border border-ink/10 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {inquiry.logo_blob_key && (
                    <Image
                      src={`/api/board/corporate-donations/${inquiry.id}/logo`}
                      alt={`${inquiry.company_name} logo`}
                      width={48}
                      height={48}
                      unoptimized
                      className="h-12 w-12 flex-shrink-0 rounded-lg border border-ink/10 object-contain p-1"
                    />
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-base text-[#0b1f3a]">{inquiry.company_name}</p>
                      {inquiry.logo_blob_key && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                          <BadgeCheck className="h-3 w-3" />
                          Via Zeffy
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-ink/50">Submitted {formatDate(inquiry.created_at)}</p>
                  </div>
                </div>
                <StatusBadge status={inquiry.status} />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink/40">Contact Name</p>
                  <p className="mt-0.5 text-sm text-ink/80">{inquiry.contact_name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink/40">Email</p>
                  <a href={`mailto:${inquiry.email}`} className="mt-0.5 block text-sm text-blue-700 hover:underline">
                    {inquiry.email}
                  </a>
                </div>
                {inquiry.phone && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-ink/40">Phone</p>
                    <a href={`tel:${inquiry.phone}`} className="mt-0.5 block text-sm text-blue-700 hover:underline">
                      {inquiry.phone}
                    </a>
                  </div>
                )}
                {inquiry.interested_tier && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-ink/40">Interested Tier</p>
                    <p className="mt-0.5 text-sm text-ink/80">{inquiry.interested_tier}</p>
                  </div>
                )}
                {inquiry.message && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-ink/40">Message</p>
                    <p className="mt-0.5 text-sm text-ink/80">{inquiry.message}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 border-t border-ink/10 pt-4">
                <CorporateDonationStatusToggle id={inquiry.id} status={inquiry.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </Container>
  );
}
