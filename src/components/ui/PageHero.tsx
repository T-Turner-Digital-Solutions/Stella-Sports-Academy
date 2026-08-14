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
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent, transparent 60px, rgba(255,255,255,0.6) 60px, rgba(255,255,255,0.6) 62px)",
        }}
        aria-hidden
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-1/2 hidden h-[150%] w-auto -translate-y-1/2 bg-red-700 opacity-[0.14] sm:block"
        style={{
          aspectRatio: "590 / 746",
          WebkitMaskImage: "url(/brand/stella-mark.png)",
          maskImage: "url(/brand/stella-mark.png)",
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
