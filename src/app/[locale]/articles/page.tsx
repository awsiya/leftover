import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Clock, ArrowRight } from "lucide-react";
import { AppLocale, isValidLocale } from "@/lib/i18n/config";
import { createLocalizedMetadata, buildLocalizedPath } from "@/lib/i18n/metadata";
import { getNavTranslations } from "@/lib/i18n/navigation";
import { getAllArticles } from "@/lib/articles/articleStore";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface LocalizedArticlesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

const ARTICLES_META: Record<AppLocale, { title: string; description: string }> = {
  en: {
    title: "15 Comprehensive DIY Tile Craft Guides — Leftover Tile Project Planner",
    description:
      "Authoritative, peer-reviewed engineering guides on safe tile cutting, silica dust suppression, thinset chemistry, mosaic trencadís, and weatherproofing.",
  },
  de: {
    title: "15 Umfassende DIY-Fliesenratgeber — Fliesen-Projektplaner",
    description:
      "Fundierte Anleitungen zum sicheren Schneiden von Fliesen, Quarzstaub-Schutz, Kleberchemie, Mosaiktechnik und Witterungsschutz.",
  },
  fr: {
    title: "15 Guides complets de bricolage carrelage — Planificateur carrelage",
    description:
      "Guides détaillés sur la découpe sécurisée des carreaux, la poussière de silice, les mortiers-colles, la mosaïque et l'étanchéité.",
  },
  es: {
    title: "15 Guías completas de artesanía con azulejos — Planificador de azulejos",
    description:
      "Guías técnicas sobre corte seguro de azulejos, control del polvo de sílice, química de morteros, técnica de mosaico e impermeabilización.",
  },
};

export async function generateMetadata({ params }: LocalizedArticlesPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    return {};
  }

  const meta = ARTICLES_META[locale];
  return createLocalizedMetadata({
    locale,
    path: "/articles",
    title: meta.title,
    description: meta.description,
  });
}

export default async function LocalizedArticlesHubPage({ params }: LocalizedArticlesPageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const nav = getNavTranslations(locale);
  const articles = getAllArticles();
  const homeHref = buildLocalizedPath(locale, "/");

  return (
    <div className="bg-ceramic-50 min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href={homeHref}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-600 hover:text-terracotta-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>&larr; Home</span>
          </Link>
        </div>

        {/* Section Header */}
        <div className="mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-terracotta-700">
            <BookOpen className="h-3.5 w-3.5" />
            <span>DIY Editorial Knowledgebase (15 Guides)</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 tracking-tight">
            {nav.articles}
          </h1>
          <p className="text-base text-charcoal-600 leading-relaxed max-w-2xl">
            {ARTICLES_META[locale].description}
          </p>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((article) => {
            const targetSlug =
              locale !== "en" && article.localizedSlugs?.[locale]
                ? article.localizedSlugs[locale]
                : article.slug;
            const articleHref = buildLocalizedPath(locale, `/articles/${targetSlug}`);
            const trans = locale !== "en" ? article.translations?.[locale] : null;
            const displayTitle = trans?.title || article.title;
            const displayExcerpt = trans?.excerpt || article.excerpt;

            return (
              <Card key={article.slug} hoverEffect className="flex flex-col h-full bg-white">
                <CardHeader className="flex-1">
                  <div className="flex items-center justify-between text-xs text-charcoal-500 mb-2">
                    <Badge variant="outline" size="sm">
                      {article.category}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{article.readingTimeMinutes} min</span>
                    </span>
                  </div>
                  <CardTitle className="text-xl">
                    <Link
                      href={articleHref}
                      className="hover:text-terracotta-600 transition-colors"
                    >
                      {displayTitle}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-2 line-clamp-3">
                    {displayExcerpt}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="pt-4 flex items-center justify-between border-t border-ceramic-200">
                  <span className="text-xs text-charcoal-500 font-mono">
                    {article.wordCount} words
                  </span>
                  <Link
                    href={articleHref}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta-600 hover:text-terracotta-700"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
