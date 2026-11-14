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
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] bg-black sm:block"
        style={{ clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0 100%)" }}
      >
        {/* Glowing brand-sheet treatment: near-black panel, Capri Blue light
            blooming from behind the logo, like the official brand mockups. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 78% 50%, rgba(0,191,255,0.55), transparent 55%), radial-gradient(circle at 30% 15%, rgba(0,191,255,0.25), transparent 45%), linear-gradient(135deg, #000000 0%, #001824 55%, #00344a 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(rgba(0,191,255,0.6) 1px, transparent 1.5px)",
            backgroundSize: "18px 18px",
          }}
        />
        {/* A lighter diagonal light-streak near the seam — echoes the header's two-tone accent and the brand sheet's light trails. */}
        <div
          className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-blue-400/60 to-transparent sm:w-14"
          style={{ clipPath: "polygon(60% 0, 100% 0, 40% 100%, 0 100%)" }}
        />
        <div className="relative flex h-full items-center justify-end pr-8 lg:pr-14 xl:pr-20">
          <Image
            src="/brand/stella-lockup.png"
            alt=""
            width={1514}
            height={932}
            className="h-auto w-36 drop-shadow-[0_0_30px_rgba(0,191,255,0.55)] lg:w-44 xl:w-52"
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
