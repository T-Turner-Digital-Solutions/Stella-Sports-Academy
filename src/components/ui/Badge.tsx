import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "red",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "red" | "white" | "ink" | "neutral";
}) {
  const tones = {
    red: "bg-red-100 text-red-700",
    white: "bg-white text-ink",
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
