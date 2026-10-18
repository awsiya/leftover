"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { AppLocale, DEFAULT_LOCALE, isValidLocale } from "@/lib/i18n/config";
import { getNavTranslations } from "@/lib/i18n/navigation";
import { buildLocalizedPath } from "@/lib/i18n/metadata";

interface HeaderProps {
  currentLocale?: AppLocale;
}

export function Header({ currentLocale: propLocale }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Determine active locale
  let activeLocale: AppLocale = propLocale || DEFAULT_LOCALE;
  if (!propLocale && pathname) {
    const firstSegment = pathname.split("/").filter(Boolean)[0];
    if (firstSegment && isValidLocale(firstSegment)) {
      activeLocale = firstSegment;
    }
  }

  const nav = getNavTranslations(activeLocale);

  const navLinks = [
    { href: buildLocalizedPath(activeLocale, "/calculator"), label: nav.calculator },
    { href: buildLocalizedPath(activeLocale, "/projects"), label: nav.projects },
    { href: buildLocalizedPath(activeLocale, "/articles"), label: nav.articles },
  ];

  const homeHref = buildLocalizedPath(activeLocale, "/");
  const calculatorHref = buildLocalizedPath(activeLocale, "/calculator");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ceramic-300 bg-ceramic-50/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <Link
          href={homeHref}
          className="flex items-center gap-2.5 text-charcoal-900 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 rounded"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-editorial bg-terracotta-500 text-white shadow-subtle group-hover:bg-terracotta-600 transition-colors">
            <Grid className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-tight text-charcoal-900 leading-none">
              Leftover Tile
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-charcoal-500 mt-0.5">
              Project Planner
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-charcoal-700 hover:text-terracotta-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 rounded px-1 py-0.5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA, Language Switcher & Admin Link */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher variant="header" />
          <Link
            href="/admin/login"
            className="text-xs font-medium text-charcoal-500 hover:text-charcoal-800 transition-colors px-2 py-1"
          >
            {nav.admin}
          </Link>
          <Button href={calculatorHref} variant="primary" size="sm">
            <span>{nav.matchTilesCta}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Hamburger Button and Language Switcher */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher variant="header" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="rounded p-2 text-charcoal-700 hover:bg-ceramic-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-ceramic-300 bg-ceramic-100/98 px-4 pt-3 pb-6 transition-all">
          <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-charcoal-800 hover:text-terracotta-600 py-1.5"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-ceramic-300 flex flex-col gap-3">
              <Button
                href={calculatorHref}
                variant="primary"
                size="md"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full justify-center"
              >
                <span>{nav.matchTilesCta}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-xs text-charcoal-500 hover:text-charcoal-700 py-1"
              >
                {nav.admin}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
