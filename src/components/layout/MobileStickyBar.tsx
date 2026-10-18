"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calculator, LayoutGrid, BookOpen } from "lucide-react";
import { AppLocale, DEFAULT_LOCALE, isValidLocale } from "@/lib/i18n/config";
import { getNavTranslations } from "@/lib/i18n/navigation";
import { buildLocalizedPath } from "@/lib/i18n/metadata";

interface MobileStickyBarProps {
  currentLocale?: AppLocale;
}

export function MobileStickyBar({ currentLocale: propLocale }: MobileStickyBarProps) {
  const pathname = usePathname();

  // Hide on admin portal
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Determine active locale
  let activeLocale: AppLocale = propLocale || DEFAULT_LOCALE;
  if (!propLocale && pathname) {
    const firstSegment = pathname.split("/").filter(Boolean)[0];
    if (firstSegment && isValidLocale(firstSegment)) {
      activeLocale = firstSegment;
    }
  }

  const nav = getNavTranslations(activeLocale);

  const homePath = buildLocalizedPath(activeLocale, "/");
  const calcPath = buildLocalizedPath(activeLocale, "/calculator");
  const projectsPath = buildLocalizedPath(activeLocale, "/projects");
  const articlesPath = buildLocalizedPath(activeLocale, "/articles");

  // Determine which item is currently active
  const isHomeActive = pathname === homePath || pathname === `/${activeLocale}`;
  const isCalcActive = pathname.startsWith(calcPath);
  const isProjectsActive = pathname.startsWith(projectsPath);
  const isArticlesActive = pathname.startsWith(articlesPath);

  const navItems = [
    {
      href: homePath,
      label: "Home",
      icon: Home,
      isActive: isHomeActive,
    },
    {
      href: projectsPath,
      label: nav.projects.split(" ")[0] || "Projects",
      icon: LayoutGrid,
      isActive: isProjectsActive,
    },
    {
      href: calcPath,
      label: nav.calculator.split(" ")[0] || "Calculator",
      icon: Calculator,
      isActive: isCalcActive,
      isSpecial: true,
    },
    {
      href: articlesPath,
      label: nav.articles.split(" ")[0] || "Guides",
      icon: BookOpen,
      isActive: isArticlesActive,
    },
  ];

  return (
    <aside
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-ceramic-300 bg-ceramic-50/95 backdrop-blur-lg px-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.isSpecial) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center px-3 py-1 -mt-3.5 group focus:outline-none`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full shadow-md transition-transform active:scale-95 ${
                    item.isActive
                      ? "bg-terracotta-600 text-white ring-4 ring-terracotta-200"
                      : "bg-terracotta-500 text-white group-hover:bg-terracotta-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-semibold text-terracotta-700 mt-1 tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[60px] py-1 transition-colors active:scale-95 focus:outline-none ${
                item.isActive
                  ? "text-terracotta-600 font-semibold"
                  : "text-charcoal-600 hover:text-charcoal-900"
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${item.isActive ? "stroke-[2.4]" : "stroke-[1.8]"}`} />
                {item.isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-terracotta-600" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-[70px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
