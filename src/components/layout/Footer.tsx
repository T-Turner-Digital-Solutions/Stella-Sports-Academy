import Link from "next/link";
import { Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { site, footerNav } from "@/content/site";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/ui/SocialIcons";

const socialLinks = [
  { key: "facebook", label: "Facebook", icon: FacebookIcon, href: site.social.facebook },
  { key: "instagram", label: "Instagram", icon: InstagramIcon, href: site.social.instagram },
  { key: "twitter", label: "Twitter / X", icon: TwitterIcon, href: site.social.twitter },
  { key: "youtube", label: "YouTube", icon: YoutubeIcon, href: site.social.youtube },
].filter((s) => s.href);

export function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span
                aria-hidden
                className="h-10 w-auto flex-shrink-0 bg-red-700"
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
              <span className="font-display text-lg uppercase tracking-wide text-white">
                Stella Sports Academy
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              {site.tagline}
            </p>
            {(socialLinks.length > 0 || site.email) && (
              <div className="mt-6 flex items-center gap-3">
                {site.email && (
                  <a
                    href={`mailto:${site.email}`}
                    aria-label="Email Stella Sports Academy"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-red-600 hover:text-white"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
                {socialLinks.map(({ key, label, icon: Icon, href }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-red-600 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <FooterColumn title="Organization" links={footerNav.organization} />
          <FooterColumn title="Get Involved" links={footerNav.getInvolved} />
          <FooterColumn title="Transparency & Legal" links={footerNav.transparency} />
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>{site.name} is a {site.orgType}. EIN {site.ein}.</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-white/65 transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
