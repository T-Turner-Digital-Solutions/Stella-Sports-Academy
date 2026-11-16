import type { Program } from "@/content/programs";

/** Program detail pages aren't ready to be public yet, so these cards are
 * informational only for now — no link to /programs/[slug] until that's
 * reversed. */
export function ProgramCard({ program }: { program: Program }) {
  const Icon = program.icon;

  return (
    <div
      className="relative flex flex-col gap-5 border border-red-400/30 bg-gradient-to-br from-ink via-ink to-ink-soft p-7 shadow-[0_0_30px_-14px_rgba(0,152,221,0.6)]"
      style={{
        clipPath:
          "polygon(0 18px, 18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%)",
      }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-400/70 bg-ink-soft/60">
        <Icon className="h-6 w-6 text-red-400" strokeWidth={1.75} />
      </div>
      <div>
        <h3 className="font-display text-xl uppercase tracking-wide text-white">{program.name}</h3>
        <span className="mt-2 block h-0.5 w-10 rounded-full bg-gradient-to-r from-red-400 to-transparent" />
        <p className="mt-3 text-sm leading-relaxed text-white/65">{program.summary}</p>
      </div>
      <span className="mt-auto flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/50">
        Coming Soon
      </span>
    </div>
  );
}
