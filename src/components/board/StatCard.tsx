import type { LucideIcon } from "lucide-react";

export function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-white">
        <Icon className="h-5 w-5 text-blue-700" strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-sm font-medium text-ink/70">{label}</p>
        <p className="font-portal-heading text-2xl text-ink">{value}</p>
      </div>
    </div>
  );
}
