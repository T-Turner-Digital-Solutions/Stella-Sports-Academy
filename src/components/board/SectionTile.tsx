import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

export function SectionTile({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-5 transition-shadow hover:shadow-md"
    >
      <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-700">
        <Icon className="h-6 w-6 text-white" />
      </span>
      <div className="flex-1">
        <p className="font-display text-base uppercase tracking-wide text-ink">{title}</p>
        <p className="mt-0.5 text-sm text-ink/60">{description}</p>
      </div>
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/40 transition-colors group-hover:border-blue-700 group-hover:text-blue-700">
        <ChevronRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
