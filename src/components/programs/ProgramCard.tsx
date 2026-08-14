import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Program } from "@/content/programs";

export function ProgramCard({ program }: { program: Program }) {
  const Icon = program.icon;

  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group flex flex-col gap-5 rounded-2xl border border-ink/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-700/30 hover:shadow-lg"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 transition-colors group-hover:bg-red-700">
        <Icon className="h-7 w-7 text-red-700 transition-colors group-hover:text-white" strokeWidth={1.75} />
      </div>
      <div>
        <h3 className="font-display text-xl uppercase tracking-wide text-ink">{program.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/65">{program.summary}</p>
      </div>
      <span className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-red-700">
        Learn more
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
