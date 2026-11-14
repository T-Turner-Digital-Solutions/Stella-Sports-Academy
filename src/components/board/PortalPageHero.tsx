export function PortalPageHero({
  title,
  description,
  eyebrow = "Board Portal",
  subtitle,
  badge,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  /** Shown directly under the title, e.g. a member's official board position. */
  subtitle?: string;
  /** Small pill shown top-right of the card, e.g. "Upcoming". */
  badge?: string;
}) {
  return (
    <div className="relative rounded-xl border border-ink/10 bg-white p-6 sm:p-8">
      {badge && (
        <span className="absolute right-6 top-6 hidden items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 sm:flex">
          {badge}
        </span>
      )}
      <p className="text-xs font-bold uppercase tracking-widest text-blue-700">{eyebrow}</p>
      <h1 className="mt-1.5 text-2xl font-bold text-[#0b1f3a] sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm font-semibold text-blue-700">{subtitle}</p>}
      <p className="mt-2 max-w-xl text-sm text-ink/60">{description}</p>
    </div>
  );
}
