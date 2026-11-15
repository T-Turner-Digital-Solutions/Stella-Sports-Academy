import type { Metadata } from "next";
import Image from "next/image";
import { HeartHandshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PortalPageHero } from "@/components/board/PortalPageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DonationInquiryStatusToggle } from "@/components/board/DonationInquiryStatusToggle";
import { isDatabaseConfigured } from "@/lib/db";
import { listSponsorshipInquiries } from "@/lib/submissions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Donation Inquiries" };

export default async function DonationInquiriesPage() {
  const dbReady = isDatabaseConfigured();
  const inquiries = dbReady ? await listSponsorshipInquiries() : [];

  return (
    <Container>
      <PortalPageHero
        title="Donation Inquiries"
        description="Companies that filled out the corporate sponsorship form on the website — follow up with each one here."
      />

      <div className="mt-6 flex flex-col gap-4">
        {!dbReady || inquiries.length === 0 ? (
          <EmptyState
            theme="blue"
            icon={HeartHandshake}
            title="No Donation Inquiries Yet"
            description="When a company submits the corporate sponsorship form, it will show up here for follow-up."
          />
        ) : (
          inquiries.map((inquiry) => (
            <div key={inquiry.id} className="rounded-xl border border-ink/10 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {inquiry.logo_blob_key && (
                    <Image
                      src={`/api/board/donation-inquiries/${inquiry.id}/logo`}
                      alt={`${inquiry.company_name} logo`}
                      width={48}
                      height={48}
                      unoptimized
                      className="h-12 w-12 flex-shrink-0 rounded-lg border border-ink/10 object-contain p-1"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-base text-[#0b1f3a]">{inquiry.company_name}</p>
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
                <DonationInquiryStatusToggle id={inquiry.id} status={inquiry.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </Container>
  );
}
