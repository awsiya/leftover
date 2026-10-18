import { Metadata } from "next";
import { AppLocale, LOCALES, DEFAULT_LOCALE } from "./config";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://leftovertileplanner.com";

export interface AlternatesMap {
  canonical: string;
  languages: Record<string, string>;
}

/**
 * Normalizes a path, stripping any leading language prefix if present.
 */
export function normalizePath(path: string): string {
  let cleaned = path.trim();
  if (!cleaned.startsWith("/")) {
    cleaned = `/${cleaned}`;
  }

  // Strip leading locale prefix if present (/de/projects -> /projects)
  for (const loc of LOCALES) {
    if (cleaned === `/${loc}`) return "";
    if (cleaned.startsWith(`/${loc}/`)) {
      return cleaned.substring(loc.length + 1);
    }
  }

  return cleaned === "/" ? "" : cleaned;
}

/**
 * Builds localized path for a given locale and base path.
 */
export function buildLocalizedPath(locale: AppLocale, basePath: string): string {
  const norm = normalizePath(basePath);
  if (locale === DEFAULT_LOCALE) {
    return norm ? norm : "/";
  }
  return `/${locale}${norm}`;
}

/**
 * Generates canonical and hreflang alternates conforming to Google SEO guidelines.
 */
export function buildCanonicalAndHreflang(
  currentLocale: AppLocale,
  currentPath: string
): AlternatesMap {
  const norm = normalizePath(currentPath);

  // Canonical is the current page URL
  const canonicalPath = buildLocalizedPath(currentLocale, norm);
  const canonical = `${BASE_URL}${canonicalPath === "/" ? "" : canonicalPath}`;

  // Build alternates for all supported locales + x-default
  const languages: Record<string, string> = {};

  for (const loc of LOCALES) {
    const locPath = buildLocalizedPath(loc, norm);
    languages[loc] = `${BASE_URL}${locPath === "/" ? "" : locPath}`;
  }

  // x-default points to default English path
  languages["x-default"] = `${BASE_URL}${norm || ""}`;

  return {
    canonical,
    languages,
  };
}

/**
 * Helper to construct complete localized Metadata object.
 */
export function createLocalizedMetadata({
  locale,
  path,
  title,
  description,
  imageUrl,
}: {
  locale: AppLocale;
  path: string;
  title: string;
  description: string;
  imageUrl?: string;
}): Metadata {
  const alternates = buildCanonicalAndHreflang(locale, path);
  const defaultImage = `${BASE_URL}/og-tile-planner.png`;

  return {
    title,
    description,
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: "Leftover Tile Project Planner",
      locale: locale === "en" ? "en_US" : locale === "de" ? "de_DE" : locale === "fr" ? "fr_FR" : "es_ES",
      type: "website",
      images: [
        {
          url: imageUrl || defaultImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl || defaultImage],
    },
  };
}
