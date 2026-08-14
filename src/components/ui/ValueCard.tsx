import type { coreValues } from "@/content/values";

export function ValueCard({ value }: { value: (typeof coreValues)[number] }) {
  const Icon = value.icon;

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-ink/10 bg-white px-6 py-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-700 to-red-900">
        <Icon className="h-8 w-8 text-white" strokeWidth={1.75} />
      </div>
      <div>
        <h3 className="font-display text-lg uppercase tracking-wide text-ink">{value.name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{value.description}</p>
      </div>
    </div>
  );
}
