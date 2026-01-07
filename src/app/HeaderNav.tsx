"use client";

import type React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/attractions", label: "Attractions" },
  { href: "/#usefulLinks", label: "Useful Links" },
  { href: "/#faqSection", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function HeaderNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href.startsWith("#")
      ? false
      : pathname === href || pathname.startsWith(`${href}/`);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    const isHashLink = href.startsWith("#") || href.startsWith("/#");

    if (isHashLink) {
      event.preventDefault();
      const targetId = href.replace("/#", "").replace("#", "");

      if (pathname === "/") {
        const target = document.getElementById(targetId);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState({}, "", `#${targetId}`);
      } else {
        router.push(`/#${targetId}`);
      }
      setMenuOpen(false);
      return;
    }

    setMenuOpen(false);
  };

  return (
    <div className="relative flex items-center gap-2">
      <nav className="hidden items-center gap-3 text-sm font-semibold text-foreground md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={(event) => handleNavClick(event, link.href)}
            className={`rounded-full px-3 py-2 transition hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] ${isActive(link.href) ? "bg-[var(--accent)]/10 text-[var(--accent)]" : ""
              }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className="inline-flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-[var(--border-soft)] bg-white/90 text-[var(--foreground)] shadow-sm transition hover:-translate-y-0.5 hover:border-transparent hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] md:hidden"
        aria-expanded={menuOpen}
        aria-label="Toggle navigation menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="sr-only">Toggle navigation menu</span>
        <span
          className={`block h-[2px] w-6 rounded-full bg-current transition-all duration-200 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
        />
        <span
          className={`block h-[2px] w-6 rounded-full bg-current transition-all duration-200 ${menuOpen ? "opacity-0" : "opacity-100"}`}
        />
        <span
          className={`block h-[2px] w-6 rounded-full bg-current transition-all duration-200 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
        />
      </button>

      <div
        className={`absolute right-0 top-[calc(100%+12px)] w-44 max-w-[calc(100vw-2rem)] origin-top rounded-2xl border border-[var(--border-soft)] bg-white/95 p-3 shadow-lg shadow-[var(--accent)]/10 backdrop-blur transition-all duration-200 md:hidden ${menuOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
      >
        <div className="flex flex-col gap-1 text-sm font-semibold text-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => handleNavClick(event, link.href)}
              className={`rounded-xl px-3 py-2 transition hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] ${isActive(link.href) ? "bg-[var(--accent)]/10 text-[var(--accent)]" : ""
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
