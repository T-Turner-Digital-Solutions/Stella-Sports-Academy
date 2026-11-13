import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
  variant = "boxed",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  /** "boxed" (default) keeps the dashed placeholder box. "flat" drops the
   * box so the content sits directly in an already-styled parent card. */
  variant?: "boxed" | "flat";
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-14 text-center",
        variant === "boxed" && "rounded-2xl border border-dashed border-ink/15 bg-paper",
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
