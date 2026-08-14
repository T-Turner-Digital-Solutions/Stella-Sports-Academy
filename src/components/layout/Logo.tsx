import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-3", className)}
      aria-label="Stella Sports Academy — Home"
    >
      <span
        aria-hidden
        className="h-11 w-auto flex-shrink-0 bg-red-700 drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
        style={{
          aspectRatio: "590 / 746",
          WebkitMaskImage: "url(/brand/stella-mark.png)",
          maskImage: "url(/brand/stella-mark.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
      <span
        className={cn(
          "font-display text-lg uppercase leading-none tracking-wide sm:text-xl",
          light ? "text-white" : "text-ink"
        )}
      >
        Stella
        <span className={light ? "text-white" : "text-red-700"}> Sports</span>
        <br className="hidden sm:block" />
        <span className="hidden sm:inline"> Academy</span>
      </span>
    </Link>
  );
}
