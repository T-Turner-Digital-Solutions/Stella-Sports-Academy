import Link from "next/link";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import type { Campaign } from "@/content/campaigns";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const percent = campaign.goalCents ? (campaign.raisedCents / campaign.goalCents) * 100 : 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-maroon-800 via-maroon-700 to-ink">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.4) 10px, rgba(255,255,255,0.4) 11px)",
          }}
        />
        <span className="font-display relative text-2xl uppercase tracking-wide text-white/90">
          {campaign.title}
        </span>
        <Badge tone="gold" className="absolute right-3 top-3">
          {campaign.status === "active" ? "Active" : "Planned"}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="font-display text-xl uppercase tracking-wide text-ink">
            <Link href={`/campaigns/${campaign.slug}`} className="hover:text-maroon-700">
              {campaign.title}
            </Link>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">{campaign.summary}</p>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <ProgressBar percent={percent} />
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-ink">
              {formatCurrency(campaign.raisedCents)} raised
            </span>
            <span className="text-ink/55">
              {campaign.goalCents ? `of ${formatCurrency(campaign.goalCents)} goal` : "Goal to be announced"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-ink/45">
            <Users className="h-3.5 w-3.5" />
            {campaign.donorCount} {campaign.donorCount === 1 ? "supporter" : "supporters"}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button href={`/donate?designation=${campaign.designation}`} size="md" className="flex-1">
            Donate
          </Button>
          <Button href={`/campaigns/${campaign.slug}`} variant="ghost" size="md" className="border border-ink/15">
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
