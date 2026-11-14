import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const THEMES = {
  red: { badge: "bg-red-100", icon: "text-red-700", heading: "font-display uppercase tracking-wide text-lg" },
  blue: { badge: "bg-blue-50", icon: "text-blue-700", heading: "font-portal-heading text-lg" },
} as const;

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
  variant = "boxed",
  theme = "red",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  /** "boxed" (default) keeps the dashed placeholder box. "flat" drops the
   * box so the content sits directly in an already-styled parent card. */
  variant?: "boxed" | "flat";
  /** "red" (default) matches the admin backend. "blue" matches the board portal. */
  theme?: "red" | "blue";
}) {
  const t = THEMES[theme];
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-14 text-center",
        variant === "boxed" && "rounded-2xl border border-dashed border-ink/15 bg-paper",
        className
      )}
    >
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", t.badge)}>
        <Icon className={cn("h-6 w-6", t.icon)} strokeWidth={1.75} />
      </div>
      <p className={cn("text-ink", t.heading)}>{title}</p>
      <p className="max-w-md text-sm leading-relaxed text-ink/60">{description}</p>
    </div>
  );
}
