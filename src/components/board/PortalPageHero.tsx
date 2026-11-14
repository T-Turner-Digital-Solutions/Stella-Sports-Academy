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
      {/* Soft atmospheric light blooms standing in for photography on the
          right side of the band — no stock image is used or fabricated. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-50 sm:block"
        style={{
          background:
            "radial-gradient(circle at 85% 20%, rgba(59,130,246,0.35), transparent 45%), radial-gradient(circle at 60% 70%, rgba(37,99,235,0.25), transparent 50%)",
        }}
      />
      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">{eyebrow}</p>
        <h1 className="font-portal-heading mt-2 text-3xl text-ink sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-xl text-sm text-ink/60">{description}</p>
        <div className="mt-5 h-1 w-16 rounded-full bg-blue-700" />
      </div>
    </div>
  );
}
