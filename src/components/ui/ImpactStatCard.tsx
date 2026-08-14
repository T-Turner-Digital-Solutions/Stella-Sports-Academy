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
          light ? "text-gold-300" : "text-maroon-700"
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
      {stat.value === null && (
        <p className={cn("text-xs", light ? "text-white/40" : "text-ink/40")}>Updates coming soon</p>
      )}
    </div>
  );
}
