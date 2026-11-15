import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex min-w-0 items-center gap-2.5 sm:gap-3", className)}
      aria-label="Stellar Sports Academy — Home"
    >
      {/* Phone view only: a compact icon badge + single truncating line, so
          the logo always stays visible instead of getting squeezed out by
          the header's other controls. */}
      <span
        className={cn(
          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105 sm:hidden",
          light ? "bg-white/10" : "bg-paper-dim"
        )}
      >
        <img
          src="/brand/stella-mark.png"
          alt=""
          aria-hidden
          className="h-6 w-auto"
          style={{ aspectRatio: "1514 / 730" }}
        />
      </span>
      <span
        className={cn(
          "min-w-0 truncate font-display text-base uppercase leading-none tracking-wide sm:hidden",
          light ? "text-white" : "text-ink"
        )}
      >
        Stellar <span className={light ? "text-white" : "text-red-700"}>Sports Academy</span>
      </span>

      {/* Tablet and up: the original full-size, two-line wordmark. */}
      <img
        src="/brand/stella-mark.png"
        alt=""
        aria-hidden
        className="hidden h-11 w-auto flex-shrink-0 drop-shadow-sm transition-transform duration-200 group-hover:scale-105 sm:block"
        style={{ aspectRatio: "1514 / 730" }}
      />
      <span
        className={cn(
          "hidden font-display text-xl uppercase leading-none tracking-wide sm:block",
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
