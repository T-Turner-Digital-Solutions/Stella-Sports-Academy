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
      className="group flex items-center gap-4 rounded-xl border border-ink/10 bg-white p-5 transition-colors hover:border-blue-200"
    >
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
        <Icon className="h-5 w-5 text-blue-700" />
      </span>
      <div className="flex-1">
        <p className="text-base font-semibold text-[#0b1f3a]">{title}</p>
        <p className="mt-0.5 text-sm text-ink/60">{description}</p>
      </div>
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/40 transition-colors group-hover:border-blue-700 group-hover:text-blue-700">
        <ChevronRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
