"use client";

import React from "react";
import { Info } from "lucide-react";
import { AppLocale, LOCALE_DISCLOSURES } from "@/lib/i18n/config";
import { getNavTranslations } from "@/lib/i18n/navigation";

interface EditorialDisclosureBannerProps {
  locale: AppLocale;
  className?: string;
}

/**
 * Editorial transparency disclosure for non-English locales.
 * Strictly adheres to rule: "Do not invent translations or claim native editorial review has happened."
 */
export function EditorialDisclosureBanner({
  locale,
  className = "",
}: EditorialDisclosureBannerProps) {
  const disclosure = LOCALE_DISCLOSURES[locale];
  if (!disclosure) {
    return null; // English has no disclosure banner required
  }

  const nav = getNavTranslations(locale);

  return (
    <aside
      role="note"
      aria-label={nav.disclosureTitle}
      className={`border-b border-ceramic-300 bg-ceramic-100/90 py-2.5 px-4 text-xs text-charcoal-700 shadow-xs ${className}`}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-terracotta-600 shrink-0" aria-hidden="true" />
          <span className="font-semibold text-charcoal-900">{nav.disclosureTitle}:</span>
          <span className="text-charcoal-600 leading-snug">{disclosure}</span>
        </div>
      </div>
    </aside>
  );
}
