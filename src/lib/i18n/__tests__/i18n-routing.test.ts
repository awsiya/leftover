import { describe, it, expect } from "vitest";
import {
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_CONFIGS,
  LOCALE_DISCLOSURES,
  isValidLocale,
} from "@/lib/i18n/config";
import {
  normalizePath,
  buildLocalizedPath,
  buildCanonicalAndHreflang,
  createLocalizedMetadata,
} from "@/lib/i18n/metadata";
import { getNavTranslations } from "@/lib/i18n/navigation";
import {
  getAllArticles,
  getArticleBySlug,
  getArticlesByCategory,
  getRelatedArticles,
  getRelatedProjectsForArticle,
  getAllLocalizedArticleRoutes,
} from "@/lib/articles/articleStore";
import { SEEDED_PROJECTS } from "@/lib/data/seededProjects";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

describe("i18n Configuration & Navigation", () => {
  it("defines exactly 4 supported locales with 'en' as default", () => {
    expect(LOCALES).toEqual(["en", "de", "fr", "es"]);
    expect(DEFAULT_LOCALE).toBe("en");
  });

  it("validates locale codes accurately", () => {
    expect(isValidLocale("en")).toBe(true);
    expect(isValidLocale("de")).toBe(true);
    expect(isValidLocale("fr")).toBe(true);
    expect(isValidLocale("es")).toBe(true);
    expect(isValidLocale("it")).toBe(false);
    expect(isValidLocale("jp")).toBe(false);
    expect(isValidLocale("")).toBe(false);
  });

  it("provides complete metadata configs for every locale", () => {
    for (const locale of LOCALES) {
      const config = LOCALE_CONFIGS[locale];
      expect(config).toBeDefined();
      expect(config.code).toBe(locale);
      expect(config.label).toBeTruthy();
      expect(config.nativeLabel).toBeTruthy();
      expect(config.flag).toBeTruthy();
    }
  });

  it("enforces editorial transparency disclosures on non-English locales and none on English", () => {
    expect(LOCALE_DISCLOSURES.en).toBeNull();
    expect(LOCALE_DISCLOSURES.de).toContain("Transparenzhinweis");
    expect(LOCALE_DISCLOSURES.de).toContain("TCNA/ANSI");
    expect(LOCALE_DISCLOSURES.fr).toContain("Avis de transparence");
    expect(LOCALE_DISCLOSURES.fr).toContain("TCNA/ANSI");
    expect(LOCALE_DISCLOSURES.es).toContain("Aviso de transparencia");
    expect(LOCALE_DISCLOSURES.es).toContain("TCNA/ANSI");
  });

  it("provides comprehensive navigation translations for all 4 locales", () => {
    for (const locale of LOCALES) {
      const nav = getNavTranslations(locale);
      expect(nav.calculator).toBeTruthy();
      expect(nav.projects).toBeTruthy();
      expect(nav.articles).toBeTruthy();
      expect(nav.admin).toBeTruthy();
      expect(nav.matchTilesCta).toBeTruthy();
      expect(nav.brandTagline).toBeTruthy();
      expect(nav.footerRights).toBeTruthy();
    }
  });
});

describe("Canonical URL & Hreflang Alternates Generator", () => {
  it("normalizes paths correctly, removing leading locale prefixes", () => {
    expect(normalizePath("/")).toBe("");
    expect(normalizePath("/projects")).toBe("/projects");
    expect(normalizePath("/de/projects")).toBe("/projects");
    expect(normalizePath("/fr/articles/test")).toBe("/articles/test");
    expect(normalizePath("/es/calculator")).toBe("/calculator");
    expect(normalizePath("calculator")).toBe("/calculator");
  });

  it("builds localized paths adhering to the default locale prefix rule", () => {
    expect(buildLocalizedPath("en", "/projects")).toBe("/projects");
    expect(buildLocalizedPath("en", "/")).toBe("/");
    expect(buildLocalizedPath("de", "/projects")).toBe("/de/projects");
    expect(buildLocalizedPath("fr", "/articles/guide")).toBe("/fr/articles/guide");
    expect(buildLocalizedPath("es", "/calculator")).toBe("/es/calculator");
  });

  it("generates correct canonical URL and hreflang for English page", () => {
    const alternates = buildCanonicalAndHreflang("en", "/projects");
    expect(alternates.canonical).toBe("https://leftovertileplanner.com/projects");
    expect(alternates.languages["en"]).toBe("https://leftovertileplanner.com/projects");
    expect(alternates.languages["de"]).toBe("https://leftovertileplanner.com/de/projects");
    expect(alternates.languages["fr"]).toBe("https://leftovertileplanner.com/fr/projects");
    expect(alternates.languages["es"]).toBe("https://leftovertileplanner.com/es/projects");
    expect(alternates.languages["x-default"]).toBe("https://leftovertileplanner.com/projects");
  });

  it("generates correct canonical URL and hreflang for German page", () => {
    const alternates = buildCanonicalAndHreflang("de", "/projects");
    expect(alternates.canonical).toBe("https://leftovertileplanner.com/de/projects");
    expect(alternates.languages["en"]).toBe("https://leftovertileplanner.com/projects");
    expect(alternates.languages["de"]).toBe("https://leftovertileplanner.com/de/projects");
    expect(alternates.languages["x-default"]).toBe("https://leftovertileplanner.com/projects");
  });

  it("constructs full localized Metadata with OpenGraph and Twitter tags", () => {
    const meta = createLocalizedMetadata({
      locale: "fr",
      path: "/calculator",
      title: "Calculateur de carrelage",
      description: "Calculateur déterministe pour carrelage",
    });

    expect(meta.title).toBe("Calculateur de carrelage");
    expect(meta.description).toBe("Calculateur déterministe pour carrelage");
    expect(meta.alternates?.canonical).toBe("https://leftovertileplanner.com/fr/calculator");
    expect(meta.openGraph?.locale).toBe("fr_FR");
  });
});

describe("15 Original Technical SEO Articles Verification", () => {
  const articles = getAllArticles();

  it("contains exactly 15 articles", () => {
    expect(articles.length).toBe(15);
  });

  it("STRICT: each of the 15 articles has a word count between 1,600 and 1,800 words", () => {
    for (const article of articles) {
      expect(
        article.wordCount,
        `Article ${article.id} (${article.title}) word count ${article.wordCount} must be between 1600 and 1800`
      ).toBeGreaterThanOrEqual(1600);

      expect(
        article.wordCount,
        `Article ${article.id} (${article.title}) word count ${article.wordCount} must be between 1600 and 1800`
      ).toBeLessThanOrEqual(1800);
    }
  });

  it("each article has unique IDs, slugs, and valid structural metadata", () => {
    const ids = new Set<string>();
    const slugs = new Set<string>();

    for (const article of articles) {
      expect(ids.has(article.id)).toBe(false);
      expect(slugs.has(article.slug)).toBe(false);
      ids.add(article.id);
      slugs.add(article.slug);

      expect(article.title).toBeTruthy();
      expect(article.author).toBeTruthy();
      expect(article.readingTimeMinutes).toBeGreaterThan(0);
      expect(article.publishedAt).toBeTruthy();
      expect(article.excerpt.length).toBeGreaterThan(50);
      expect(article.sections.length).toBeGreaterThanOrEqual(4);
      expect(article.tableOfContents.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("each article has localized slugs for German, French, and Spanish", () => {
    for (const article of articles) {
      expect(article.localizedSlugs.de).toBeTruthy();
      expect(article.localizedSlugs.fr).toBeTruthy();
      expect(article.localizedSlugs.es).toBeTruthy();
    }
  });

  it("all relatedProjectSlugs reference existing valid projects", () => {
    const validProjectSlugs = new Set(SEEDED_PROJECTS.map((p) => p.slug));

    for (const article of articles) {
      expect(article.relatedProjectSlugs.length).toBeGreaterThan(0);
      for (const pSlug of article.relatedProjectSlugs) {
        expect(
          validProjectSlugs.has(pSlug),
          `Article ${article.id} references invalid project slug "${pSlug}"`
        ).toBe(true);
      }
    }
  });

  it("all relatedArticleSlugs reference existing valid articles", () => {
    const validArticleSlugs = new Set(articles.map((a) => a.slug));

    for (const article of articles) {
      expect(article.relatedArticleSlugs.length).toBeGreaterThan(0);
      for (const aSlug of article.relatedArticleSlugs) {
        expect(
          validArticleSlugs.has(aSlug),
          `Article ${article.id} references invalid article slug "${aSlug}"`
        ).toBe(true);
      }
    }
  });
});

describe("Article Store & Slug Resolution", () => {
  it("resolves canonical English slug correctly", () => {
    const result = getArticleBySlug("safe-tile-cutting-silica-dust-suppression");
    expect(result).not.toBeNull();
    expect(result?.article.id).toBe("art-01");
    expect(result?.resolvedLocale).toBe("en");
  });

  it("resolves localized German slug to Article 1 with resolvedLocale 'de'", () => {
    const result = getArticleBySlug("sicheres-fliesenschneiden-quarzstaub-schutz");
    expect(result).not.toBeNull();
    expect(result?.article.id).toBe("art-01");
    expect(result?.resolvedLocale).toBe("de");
  });

  it("resolves localized French slug to Article 1 with resolvedLocale 'fr'", () => {
    const result = getArticleBySlug("coupe-carrelage-securite-poussiere-silice");
    expect(result).not.toBeNull();
    expect(result?.article.id).toBe("art-01");
    expect(result?.resolvedLocale).toBe("fr");
  });

  it("resolves localized Spanish slug to Article 1 with resolvedLocale 'es'", () => {
    const result = getArticleBySlug("corte-seguro-azulejos-supresion-polvo-silice");
    expect(result).not.toBeNull();
    expect(result?.article.id).toBe("art-01");
    expect(result?.resolvedLocale).toBe("es");
  });

  it("returns null for non-existent slug", () => {
    expect(getArticleBySlug("non-existent-flying-tile")).toBeNull();
  });

  it("filters articles by category", () => {
    const cuttingArticles = getArticlesByCategory("Safety & Tools");
    expect(cuttingArticles.length).toBeGreaterThan(0);
    expect(cuttingArticles.every((a) => a.category === "Safety & Tools")).toBe(true);
  });

  it("retrieves related articles excluding current article", () => {
    const related = getRelatedArticles("safe-tile-cutting-silica-dust-suppression", 3);
    expect(related.length).toBe(3);
    expect(related.some((a) => a.slug === "safe-tile-cutting-silica-dust-suppression")).toBe(false);
  });

  it("retrieves related project instances correctly", () => {
    const projects = getRelatedProjectsForArticle(["mediterranean-mosaic-trivet"]);
    expect(projects.length).toBe(1);
    expect(projects[0].slug).toBe("mediterranean-mosaic-trivet");
  });

  it("generates all localized article dynamic routes (15 articles * 4 locales)", () => {
    const routes = getAllLocalizedArticleRoutes();
    // 15 articles * 4 locales (en, de, fr, es) = 60
    expect(routes.length).toBe(60);
  });
});

describe("Dynamic Sitemap & Robots Generator", () => {
  it("generates a comprehensive sitemap with all hubs, 20 projects, and 15 articles across all locales", () => {
    const entries = sitemap();

    // 4 hubs * 4 locales = 16
    // 20 projects * 4 locales = 80
    // 15 articles * 4 locales = 60
    // Total = 156
    expect(entries.length).toBe(156);

    // Check hub URL
    const homeEntry = entries.find((e) => e.url === "https://leftovertileplanner.com");
    expect(homeEntry).toBeDefined();
    expect(homeEntry?.alternates?.languages?.["en"]).toBe("https://leftovertileplanner.com");
    expect(homeEntry?.alternates?.languages?.["de"]).toBe("https://leftovertileplanner.com/de");
    expect(homeEntry?.alternates?.languages?.["x-default"]).toBe("https://leftovertileplanner.com");

    // Check project URL
    const projectEntry = entries.find(
      (e) => e.url === "https://leftovertileplanner.com/projects/mediterranean-mosaic-trivet"
    );
    expect(projectEntry).toBeDefined();
    expect(projectEntry?.alternates?.languages?.["de"]).toBe(
      "https://leftovertileplanner.com/de/projects/mediterranean-mosaic-trivet"
    );

    // Check article URL with localized slug
    const deArticleEntry = entries.find(
      (e) =>
        e.url ===
        "https://leftovertileplanner.com/de/articles/sicheres-fliesenschneiden-quarzstaub-schutz"
    );
    expect(deArticleEntry).toBeDefined();
    expect(deArticleEntry?.alternates?.languages?.["en"]).toBe(
      "https://leftovertileplanner.com/articles/safe-tile-cutting-silica-dust-suppression"
    );
  });

  it("configures robots.txt disallowing admin, api, and checkout paths", () => {
    const config = robots();
    expect(config.sitemap).toBe("https://leftovertileplanner.com/sitemap.xml");

    const rules = Array.isArray(config.rules) ? config.rules[0] : config.rules;
    expect(rules.disallow).toContain("/admin");
    expect(rules.disallow).toContain("/api/");
    expect(rules.disallow).toContain("/checkout/");
  });
});
