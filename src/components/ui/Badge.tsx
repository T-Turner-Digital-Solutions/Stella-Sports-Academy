import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "maroon",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "maroon" | "gold" | "ink" | "neutral";
}) {
  const tones = {
    maroon: "bg-maroon-100 text-maroon-700",
    gold: "bg-gold-100 text-gold-700",
    ink: "bg-ink text-white",
    neutral: "bg-paper-dim text-ink/70",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
