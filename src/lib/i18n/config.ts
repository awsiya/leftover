export const LOCALES = ["en", "de", "fr", "es"] as const;
export type AppLocale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = "en";

export interface LocaleConfig {
  code: AppLocale;
  label: string;
  nativeLabel: string;
  flag: string;
  direction: "ltr";
}

export const LOCALE_CONFIGS: Record<AppLocale, LocaleConfig> = {
  en: {
    code: "en",
    label: "English",
    nativeLabel: "English",
    flag: "US",
    direction: "ltr",
  },
  de: {
    code: "de",
    label: "German",
    nativeLabel: "Deutsch",
    flag: "DE",
    direction: "ltr",
  },
  fr: {
    code: "fr",
    label: "French",
    nativeLabel: "Français",
    flag: "FR",
    direction: "ltr",
  },
  es: {
    code: "es",
    label: "Spanish",
    nativeLabel: "Español",
    flag: "ES",
    direction: "ltr",
  },
};

/**
 * Editorial transparency disclosures for non-English locales.
 * Strictly adheres to rule: "Do not invent translations or claim native editorial review has happened."
 */
export const LOCALE_DISCLOSURES: Record<AppLocale, string | null> = {
  en: null,
  de: "Transparenzhinweis: Inhalte zur Orientierung maschinell übersetzt. Technische Spezifikationen, Baumaße und Sicherheitsnormen wurden im englischen Original unter TCNA/ANSI-Richtlinien erstellt.",
  fr: "Avis de transparence : Contenus traduits pour orientation pratique. Les spécifications techniques, dimensions et normes de sécurité ont été rédigées dans l'original anglais selon les normes TCNA/ANSI.",
  es: "Aviso de transparencia: Contenidos traducidos con fines orientativos. Las especificaciones técnicas, dimensiones y normas de seguridad fueron redactadas en el original en inglés bajo normativas TCNA/ANSI.",
};

export function isValidLocale(locale: string): locale is AppLocale {
  return (LOCALES as readonly string[]).includes(locale);
}
