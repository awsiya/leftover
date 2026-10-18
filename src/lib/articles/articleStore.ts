import { ALL_ARTICLES } from "@/lib/data/articles";
import { ArticleRecord, ArticleCategory } from "@/lib/types/article";
import { AppLocale, DEFAULT_LOCALE, isValidLocale } from "@/lib/i18n/config";
import { SEEDED_PROJECTS, SeededProject } from "@/lib/data/seededProjects";

export interface ResolvedArticleResult {
  article: ArticleRecord;
  resolvedLocale: AppLocale;
}

/**
 * Returns all articles in publication order.
 */
export function getAllArticles(): ArticleRecord[] {
  return ALL_ARTICLES;
}

/**
 * Resolves an article by any slug (English canonical or localized de/fr/es slug).
 */
export function getArticleBySlug(
  slug: string,
  preferredLocale?: AppLocale
): ResolvedArticleResult | null {
  const cleanSlug = slug.trim().toLowerCase();

  for (const article of ALL_ARTICLES) {
    // 1. Direct match on canonical English slug
    if (article.slug.toLowerCase() === cleanSlug) {
      return {
        article,
        resolvedLocale: preferredLocale && isValidLocale(preferredLocale) ? preferredLocale : DEFAULT_LOCALE,
      };
    }

    // 2. Check localized slug mapping
    for (const [localeCode, locSlug] of Object.entries(article.localizedSlugs)) {
      if (locSlug.toLowerCase() === cleanSlug) {
        return {
          article,
          resolvedLocale: localeCode as AppLocale,
        };
      }
    }
  }

  return null;
}

/**
 * Returns articles belonging to a specific category.
 */
export function getArticlesByCategory(category: ArticleCategory): ArticleRecord[] {
  return ALL_ARTICLES.filter((a) => a.category === category);
}

/**
 * Returns related articles for cross-linking, prioritizing explicit related slugs.
 */
export function getRelatedArticles(currentSlug: string, limit = 3): ArticleRecord[] {
  const current = ALL_ARTICLES.find((a) => a.slug === currentSlug);
  if (!current) {
    return ALL_ARTICLES.slice(0, limit);
  }

  const explicitRelated = current.relatedArticleSlugs
    .map((slug) => ALL_ARTICLES.find((a) => a.slug === slug))
    .filter((a): a is ArticleRecord => a !== undefined && a.slug !== currentSlug);

  if (explicitRelated.length >= limit) {
    return explicitRelated.slice(0, limit);
  }

  // Backfill with articles from same category or general pool
  const additional = ALL_ARTICLES.filter(
    (a) => a.slug !== currentSlug && !explicitRelated.some((er) => er.slug === a.slug)
  );

  return [...explicitRelated, ...additional].slice(0, limit);
}

/**
 * Resolves project records referenced by an article.
 */
export function getRelatedProjectsForArticle(projectSlugs: string[]): SeededProject[] {
  return projectSlugs
    .map((slug) => SEEDED_PROJECTS.find((p) => p.slug === slug))
    .filter((p): p is SeededProject => p !== undefined);
}

/**
 * Returns all slug variations across all 4 locales for dynamic routes and sitemaps.
 */
export function getAllLocalizedArticleRoutes(): {
  locale: AppLocale;
  slug: string;
  canonicalSlug: string;
}[] {
  const routes: { locale: AppLocale; slug: string; canonicalSlug: string }[] = [];

  for (const article of ALL_ARTICLES) {
    for (const [loc, slugVal] of Object.entries(article.localizedSlugs)) {
      routes.push({
        locale: loc as AppLocale,
        slug: slugVal,
        canonicalSlug: article.slug,
      });
    }
  }

  return routes;
}
