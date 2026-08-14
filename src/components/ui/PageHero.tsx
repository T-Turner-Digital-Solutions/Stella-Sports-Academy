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
      <div className="absolute inset-0 bg-gradient-to-br from-maroon-900/70 via-ink to-ink" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent, transparent 60px, rgba(255,255,255,0.6) 60px, rgba(255,255,255,0.6) 62px)",
        }}
        aria-hidden
      />
      <Container className="relative">
        {eyebrow && (
          <Badge tone="gold" className="mb-5">
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
