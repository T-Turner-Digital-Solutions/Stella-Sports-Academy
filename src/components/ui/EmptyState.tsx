import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 bg-paper px-6 py-14 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <Icon className="h-6 w-6 text-red-700" strokeWidth={1.75} />
      </div>
      <p className="font-display text-lg uppercase tracking-wide text-ink">{title}</p>
      <p className="max-w-md text-sm leading-relaxed text-ink/60">{description}</p>
    </div>
  );
}
