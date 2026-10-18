import { MetadataRoute } from "next";
import { SEEDED_PROJECTS } from "@/lib/data/seededProjects";
import { getAllArticles } from "@/lib/articles/articleStore";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://leftovertileplanner.com";
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // 1. Static Hub Routes
  const hubRoutes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/calculator", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/projects", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/articles", priority: 0.8, changeFrequency: "weekly" as const },
  ];

  for (const hub of hubRoutes) {
    const alternatesLanguages: Record<string, string> = {
      en: `${baseUrl}${hub.path || ""}`,
      de: `${baseUrl}/de${hub.path || ""}`,
      fr: `${baseUrl}/fr${hub.path || ""}`,
      es: `${baseUrl}/es${hub.path || ""}`,
      "x-default": `${baseUrl}${hub.path || ""}`,
    };

    // Canonical English entry
    entries.push({
      url: `${baseUrl}${hub.path || ""}`,
      lastModified: now,
      changeFrequency: hub.changeFrequency,
      priority: hub.priority,
      alternates: {
        languages: alternatesLanguages,
      },
    });

    // Localized entries for de, fr, es
    for (const loc of ["de", "fr", "es"] as const) {
      entries.push({
        url: `${baseUrl}/${loc}${hub.path || ""}`,
        lastModified: now,
        changeFrequency: hub.changeFrequency,
        priority: hub.priority * 0.9,
        alternates: {
          languages: alternatesLanguages,
        },
      });
    }
  }

  // 2. 20 Seeded Project Plans
  for (const project of SEEDED_PROJECTS) {
    const projectAlternates: Record<string, string> = {
      en: `${baseUrl}/projects/${project.slug}`,
      de: `${baseUrl}/de/projects/${project.slug}`,
      fr: `${baseUrl}/fr/projects/${project.slug}`,
      es: `${baseUrl}/es/projects/${project.slug}`,
      "x-default": `${baseUrl}/projects/${project.slug}`,
    };

    // English canonical
    entries.push({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
      alternates: {
        languages: projectAlternates,
      },
    });

    // Localized routes
    for (const loc of ["de", "fr", "es"] as const) {
      entries.push({
        url: `${baseUrl}/${loc}/projects/${project.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: projectAlternates,
        },
      });
    }
  }

  // 3. 15 Comprehensive Articles
  const articles = getAllArticles();
  for (const article of articles) {
    const articleAlternates: Record<string, string> = {
      en: `${baseUrl}/articles/${article.slug}`,
      de: `${baseUrl}/de/articles/${article.localizedSlugs.de}`,
      fr: `${baseUrl}/fr/articles/${article.localizedSlugs.fr}`,
      es: `${baseUrl}/es/articles/${article.localizedSlugs.es}`,
      "x-default": `${baseUrl}/articles/${article.slug}`,
    };

    const pubDate = new Date(article.publishedAt);

    // English canonical
    entries.push({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: pubDate,
      changeFrequency: "monthly",
      priority: 0.75,
      alternates: {
        languages: articleAlternates,
      },
    });

    // Localized articles
    for (const loc of ["de", "fr", "es"] as const) {
      const locSlug = article.localizedSlugs[loc] || article.slug;
      entries.push({
        url: `${baseUrl}/${loc}/articles/${locSlug}`,
        lastModified: pubDate,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: articleAlternates,
        },
      });
    }
  }

  return entries;
}
