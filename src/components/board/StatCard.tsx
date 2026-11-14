import type { LucideIcon } from "lucide-react";

export function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
          <Icon className="h-4 w-4 text-blue-700" />
        </span>
        <p className="text-xs font-bold uppercase tracking-wide text-ink/50">{label}</p>
      </div>
      <p className="mt-2 font-display text-2xl text-ink">{value}</p>
    </div>
  );
}
