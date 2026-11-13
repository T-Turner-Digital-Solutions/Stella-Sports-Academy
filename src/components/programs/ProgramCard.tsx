import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Program } from "@/content/programs";

export function ProgramCard({ program }: { program: Program }) {
  const Icon = program.icon;

  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-red-700/30 bg-gradient-to-br from-ink via-ink to-ink-soft p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-700/60 hover:shadow-lg"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-700/15 ring-1 ring-red-700/40 transition-colors group-hover:bg-red-700">
        <Icon className="h-7 w-7 text-red-400 transition-colors group-hover:text-white" strokeWidth={1.75} />
      </div>
      <div>
        <h3 className="font-display text-xl uppercase tracking-wide text-white">{program.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/65">{program.summary}</p>
      </div>
      <span className="mt-auto flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition-transform group-hover:translate-x-1">
        Learn more
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
