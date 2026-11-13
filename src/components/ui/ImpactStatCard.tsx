import { TrendingUp } from "lucide-react";
import { StatCounter } from "@/components/ui/StatCounter";
import type { ImpactStat } from "@/content/impact";
import { cn } from "@/lib/utils";

export function ImpactStatCard({ stat, light = false }: { stat: ImpactStat; light?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl px-6 py-8 text-center",
        light ? "bg-white/5 border border-white/10" : "bg-paper border border-ink/10"
      )}
    >
      <p
        className={cn(
          "font-display text-4xl tabular-nums sm:text-5xl",
          light ? "text-white" : "text-red-700"
        )}
      >
        {stat.value !== null ? (
          <>
            <StatCounter value={stat.value} />
            {stat.suffix}
          </>
        ) : (
          <span className="text-3xl sm:text-4xl">—</span>
        )}
      </p>
      <p className={cn("text-sm font-semibold uppercase tracking-wide", light ? "text-white/70" : "text-ink/60")}>
        {stat.label}
      </p>
      {stat.value === null ? (
        <p className={cn("text-xs", light ? "text-white/40" : "text-ink/40")}>Updates coming soon</p>
      ) : (
        stat.yoyGrowthPercent !== undefined && (
          <span className="mt-1 flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">
            <TrendingUp className="h-3 w-3" />+{stat.yoyGrowthPercent}% from last year
          </span>
        )
      )}
    </div>
  );
}
