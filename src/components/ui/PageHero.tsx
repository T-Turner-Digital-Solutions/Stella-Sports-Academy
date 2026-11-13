import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-28">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1600 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden
      >
        <defs>
          <filter id="pagehero-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="pagehero-arc" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2f6fd" />
            <stop offset="35%" stopColor="#4bc3ef" />
            <stop offset="100%" stopColor="#0066a8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M 820 -20 C 600 60, 120 90, -60 190"
          stroke="url(#pagehero-arc)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#pagehero-glow)"
        />
        <path
          d="M 780 820 C 1000 740, 1500 690, 1660 660"
          stroke="url(#pagehero-arc)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#pagehero-glow)"
        />
      </svg>
      <Container className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
        <div>
          {eyebrow && (
            <Badge tone="white" className="mb-5">
              {eyebrow}
            </Badge>
          )}
          <h1 className="font-display max-w-3xl text-4xl uppercase leading-[1.02] tracking-wide text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              {description}
            </p>
          )}
        </div>
        <div aria-hidden className="hidden w-56 justify-self-center lg:block lg:justify-self-end">
          <Image
            src="/brand/stella-lockup.png"
            alt=""
            width={1514}
            height={932}
            className="h-auto w-full drop-shadow-[0_0_50px_rgba(0,152,221,0.6)]"
          />
        </div>
      </Container>
    </section>
  );
}
