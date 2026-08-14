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
    <section className="relative overflow-hidden bg-ink py-20 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-ink-soft via-ink to-ink" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[62%] top-1/2 hidden h-[170%] w-[170%] -translate-x-1/2 -translate-y-1/2 sm:block"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.12) 45%, transparent 72%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[62%] top-1/2 hidden w-[48%] -translate-x-1/2 -translate-y-1/2 bg-red-700 opacity-[0.12] sm:block"
        style={{
          aspectRatio: "1080 / 572",
          WebkitMaskImage: "url(/brand/stella-emblem-2-mask.png)",
          maskImage: "url(/brand/stella-emblem-2-mask.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
      <Container className="relative">
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
      </Container>
    </section>
  );
}
