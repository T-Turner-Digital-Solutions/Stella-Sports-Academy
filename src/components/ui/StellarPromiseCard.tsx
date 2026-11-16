import type { StellarPromisePillar } from "@/content/stellar-promise";

export function StellarPromiseCard({ pillar }: { pillar: StellarPromisePillar }) {
  const Icon = pillar.icon;

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
        <Icon className="h-6 w-6 text-white" strokeWidth={1.75} />
      </span>
      <p className="font-display text-sm uppercase tracking-wide text-white">{pillar.title}</p>
      <p className="text-sm leading-relaxed text-white/65">{pillar.description}</p>
    </div>
  );
}
