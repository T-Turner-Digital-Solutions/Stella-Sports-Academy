"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { primaryNav } from "@/content/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  // Reset menu state when navigating — adjusted during render (not an
  // effect) per React's guidance for state that depends on a changing prop.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
    setOpenMenu(null);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled || mobileOpen
          ? "bg-white/95 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.12)] backdrop-blur"
          : "bg-white/0"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-10">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {primaryNav.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => item.children && setOpenMenu(item.label)}
              onMouseLeave={() => item.children && setOpenMenu(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-paper-dim",
                  pathname === item.href && "text-maroon-700"
                )}
              >
                {item.label}
                {item.children && (
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden />
                )}
              </Link>

              {item.children && (
                <div
                  className={cn(
                    "absolute left-0 top-full w-72 origin-top-left rounded-2xl border border-ink/5 bg-white p-2 shadow-xl transition-all duration-150",
                    openMenu === item.label
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-1 opacity-0"
                  )}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-xl px-4 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:bg-paper-dim hover:text-maroon-700"
                    >
                      {child.label}
                      {child.description && (
                        <span className="block text-xs font-normal text-ink/45">
                          {child.description}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button href="/donate" variant="primary" size="md" className="hidden sm:inline-flex">
            Donate
          </Button>
          <Button
            href="/donate"
            variant="primary"
            size="md"
            className="px-4 py-2.5 text-xs sm:hidden"
          >
            Donate
          </Button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-paper-dim lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-64px)] overflow-y-auto border-t border-ink/10 bg-white px-5 pb-8 pt-2 lg:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {primaryNav.map((item) => (
              <MobileNavItem key={item.href} item={item} />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function MobileNavItem({ item }: { item: (typeof primaryNav)[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-ink/10 py-1">
      <div className="flex items-center justify-between">
        <Link href={item.href} className="flex-1 py-3 text-base font-semibold text-ink">
          {item.label}
        </Link>
        {item.children && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center text-ink/60"
            aria-label={`Toggle ${item.label} submenu`}
            aria-expanded={open}
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </button>
        )}
      </div>
      {item.children && open && (
        <div className="flex flex-col gap-1 pb-3 pl-3">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="rounded-lg px-3 py-2 text-sm text-ink/70 hover:bg-paper-dim"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
