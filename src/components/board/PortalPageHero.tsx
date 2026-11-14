export function PortalPageHero({
  title,
  description,
  eyebrow = "Board Portal",
}: {
  title: string;
  description: string;
  eyebrow?: string;
}) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-blue-100 px-6 py-8 sm:px-10 sm:py-10">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-700">{eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl uppercase tracking-wide text-ink sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-xl text-sm text-ink/60">{description}</p>
      <div className="mt-5 h-1 w-16 rounded-full bg-blue-700" />
    </div>
  );
}
