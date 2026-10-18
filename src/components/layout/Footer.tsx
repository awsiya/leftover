"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid, Globe, ShieldAlert, Sparkles } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { AppLocale, DEFAULT_LOCALE, isValidLocale } from "@/lib/i18n/config";
import { getNavTranslations } from "@/lib/i18n/navigation";
import { buildLocalizedPath } from "@/lib/i18n/metadata";

interface FooterProps {
  currentLocale?: AppLocale;
}

export function Footer({ currentLocale: propLocale }: FooterProps) {
  const pathname = usePathname();

  let activeLocale: AppLocale = propLocale || DEFAULT_LOCALE;
  if (!propLocale && pathname) {
    const firstSegment = pathname.split("/").filter(Boolean)[0];
    if (firstSegment && isValidLocale(firstSegment)) {
      activeLocale = firstSegment;
    }
  }

  const nav = getNavTranslations(activeLocale);

  const calculatorHref = buildLocalizedPath(activeLocale, "/calculator");
  const projectsHref = buildLocalizedPath(activeLocale, "/projects");
  const articlesHref = buildLocalizedPath(activeLocale, "/articles");

  return (
    <footer className="border-t border-ceramic-300 bg-ceramic-100 text-charcoal-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Editorial Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-editorial bg-terracotta-500 text-white">
                <Grid className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="font-serif text-lg font-bold tracking-tight text-charcoal-900">
                Leftover Tile Project Planner
              </span>
            </div>
            <p className="text-sm text-charcoal-600 leading-relaxed max-w-sm">
              {nav.footerTagline}
            </p>
            <div className="flex items-center gap-2 text-xs text-charcoal-500">
              <Sparkles className="h-4 w-4 text-terracotta-600" />
              <span>One-time $4.99 per downloadable plan • No subscriptions</span>
            </div>
          </div>

          {/* Column 1: Projects & Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-900">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={calculatorHref} className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                  {nav.calculator}
                </Link>
              </li>
              <li>
                <Link href={projectsHref} className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                  {nav.projects}
                </Link>
              </li>
              <li>
                <Link href={articlesHref} className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                  {nav.articles}
                </Link>
              </li>
              <li>
                <Link href={`${projectsHref}?category=kitchen-dining`} className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                  Kitchen Trivets & Coasters
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Safety & Workshop Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-900">
              Workshop Standards
            </h4>
            <ul className="space-y-2 text-sm text-charcoal-600">
              <li className="flex items-start gap-1.5">
                <ShieldAlert className="h-4 w-4 text-terracotta-600 shrink-0 mt-0.5" />
                <span>NIOSH N95 / P100 Silica Dust Suppression</span>
              </li>
              <li>ANSI Z87.1 Impact Eye Protection</li>
              <li>Level 5 Cut-Resistant Gloves</li>
              <li>ANSI A118 / TCNA Thinset Specs</li>
            </ul>
          </div>

          {/* Column 3: Language & Localization */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-charcoal-600" />
              <span>Language & Region</span>
            </h4>
            <p className="text-xs text-charcoal-500">
              Select language for localized specifications and plans:
            </p>
            <div className="pt-1">
              <LanguageSwitcher variant="footer" />
            </div>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="mt-8 rounded-editorial border border-amber-300 bg-amber-50/70 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold">Workshop Safety Notice:</strong> Tile cutting and
            snapping generates razor-sharp vitreous fragments and airborne respirable crystalline
            silica. Always work in a well-ventilated area, wear an approved respirator, eye protection,
            and cut-resistant gloves. Follow all local building codes and manufacturer adhesive cure
            times.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-ceramic-300 pt-6 sm:flex-row">
          <p className="text-xs text-charcoal-500">
            &copy; {new Date().getFullYear()} Leftover Tile Project Planner. {nav.footerRights}
          </p>
          <div className="flex items-center gap-6 text-xs text-charcoal-500">
            <Link href={buildLocalizedPath(activeLocale, "/articles/safe-tile-cutting-silica-dust-suppression")} className="hover:text-charcoal-800 transition-colors">
              Safety Guidelines
            </Link>
            <Link href={buildLocalizedPath(activeLocale, "/articles/adhesive-chemistry-thinset-vs-mastic")} className="hover:text-charcoal-800 transition-colors">
              Adhesive Specs
            </Link>
            <Link href="/admin/login" className="hover:text-charcoal-800 transition-colors">
              {nav.admin}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
