import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { campaigns, plannedCampaignNames } from "@/content/campaigns";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Campaigns",
  description: `Support active fundraising campaigns at ${site.name} — from sponsoring an athlete to equipment and training funds.`,
};

export default function CampaignsPage() {
  return (
    <>
      <PageHero
        eyebrow="Fuel the Mission"
        title="Campaigns"
        description="Every campaign funds a specific need — from covering an athlete's costs to keeping training equipment current. Choose one to support, or give to wherever the need is greatest."
      />

      <section className="bg-white py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.slug} campaign={campaign} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Looking Ahead" title="More Campaigns Coming" />
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">
            Steller is preparing additional campaigns as programs grow. These will launch with
            real goals and updates as they become active.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {plannedCampaignNames.map((name) => (
              <Badge key={name} tone="neutral">
                {name}
              </Badge>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
