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
    <div className="relative overflow-hidden border-b border-blue-100 bg-white">
      {/* Bold diagonal color panel standing in for photography — built from
          real brand assets (the logo), not a placeholder or stock image. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] bg-gradient-to-br from-blue-500 via-blue-700 to-blue-950 sm:block"
        style={{ clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0 100%)" }}
      >
        {/* Dot-grid texture + light blooms, so the panel reads as a designed
            surface rather than a flat color fill. */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.55), transparent 35%), radial-gradient(circle at 80% 75%, rgba(255,255,255,0.3), transparent 40%), radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1.5px)",
            backgroundSize: "auto, auto, 18px 18px",
          }}
        />
        {/* A second, lighter diagonal stripe near the seam — echoes the header's two-tone accent. */}
        <div
          className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-blue-300/70 to-transparent sm:w-14"
          style={{ clipPath: "polygon(60% 0, 100% 0, 40% 100%, 0 100%)" }}
        />
        <div className="relative flex h-full items-center justify-end pr-8 lg:pr-14 xl:pr-20">
          <Image
            src="/brand/stella-lockup.png"
            alt=""
            width={1514}
            height={932}
            className="h-auto w-36 drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)] lg:w-44 xl:w-52"
          />
        </div>
      </div>

      {badge && (
        <span className="absolute right-5 top-6 z-10 hidden items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm sm:right-8 sm:flex lg:right-10">
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
