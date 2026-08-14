import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "gold" | "ghost" | "outline-light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-200 ease-out focus-visible:outline-offset-4 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-maroon-700 text-white shadow-[0_8px_24px_-8px_rgba(110,28,48,0.6)] hover:bg-maroon-600 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(110,28,48,0.7)] active:translate-y-0",
  secondary:
    "bg-ink text-white hover:bg-ink-soft hover:-translate-y-0.5 active:translate-y-0",
  gold: "bg-gold-600 text-ink shadow-[0_8px_24px_-8px_rgba(201,150,44,0.7)] hover:bg-gold-500 hover:-translate-y-0.5 active:translate-y-0",
  ghost: "bg-transparent text-ink hover:bg-paper-dim",
  "outline-light":
    "border-2 border-white/70 text-white hover:bg-white hover:text-ink",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
} & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">)
  | ({ href?: undefined } & Omit<ComponentProps<"button">, "className">)
);

export function Button({
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    const linkProps = props as Omit<ComponentProps<typeof Link>, "href" | "className">;
    return <Link href={href} className={classes} {...linkProps} />;
  }

  return (
    <button className={classes} {...(props as ComponentProps<"button">)} />
  );
}
