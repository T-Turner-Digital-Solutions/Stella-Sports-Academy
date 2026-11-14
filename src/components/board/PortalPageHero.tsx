import Image from "next/image";

export function PortalPageHero({
  title,
  description,
  eyebrow = "Board Portal",
  badge,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  /** Small pill shown top-right of the band, e.g. "Upcoming". */
  badge?: string;
}) {
  return (
    <div className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-50 sm:block"
        style={{
          background:
            "radial-gradient(circle at 85% 20%, rgba(59,130,246,0.35), transparent 45%), radial-gradient(circle at 60% 70%, rgba(37,99,235,0.25), transparent 50%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-6 hidden w-40 items-center lg:flex xl:right-10 xl:w-48">
        <Image
          src="/brand/stella-lockup.png"
          alt=""
          width={1514}
          height={932}
          className="h-auto w-full drop-shadow-[0_0_30px_rgba(37,99,235,0.35)]"
        />
      </div>

      {badge && (
        <span className="absolute right-5 top-6 z-10 hidden items-center gap-1.5 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 sm:right-8 sm:flex lg:right-10">
          {badge}
        </span>
      )}

      <div className="relative mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">{eyebrow}</p>
        <h1 className="font-portal-heading mt-2 max-w-2xl text-3xl text-ink sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-xl text-sm text-ink/60">{description}</p>
        <div className="mt-5 h-1 w-16 rounded-full bg-blue-700" />
      </div>
    </div>
  );
}
