import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-3", className)}
      aria-label="Stellar Sports Academy — Home"
    >
      <img
        src="/brand/stella-mark.png"
        alt=""
        aria-hidden
        className="h-11 w-auto flex-shrink-0 drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
        style={{ aspectRatio: "1514 / 730" }}
      />
      <span
        className={cn(
          "font-display text-lg uppercase leading-none tracking-wide sm:text-xl",
          light ? "text-white" : "text-ink"
        )}
      >
        Stellar
        <br />
        <span className={light ? "text-white" : "text-red-700"}>Sports Academy</span>
      </span>
    </Link>
  );
}
