import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-3", className)}
      aria-label="Stella Sports Academy — Home"
    >
      <Image
        src="/brand/stella-mark.png"
        alt=""
        width={44}
        height={56}
        priority
        className="h-11 w-auto drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
      />
      <span
        className={cn(
          "font-display text-lg uppercase leading-none tracking-wide sm:text-xl",
          light ? "text-white" : "text-ink"
        )}
      >
        Stella
        <span className={light ? "text-gold-300" : "text-maroon-700"}> Sports</span>
        <br className="hidden sm:block" />
        <span className="hidden sm:inline"> Academy</span>
      </span>
    </Link>
  );
}
