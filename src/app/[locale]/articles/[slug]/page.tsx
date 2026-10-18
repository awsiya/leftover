import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/i18n/config";
import { getArticleBySlug, getAllLocalizedArticleRoutes } from "@/lib/articles/articleStore";
import { ArticleDetailView } from "@/components/articles/ArticleDetailView";
import { createLocalizedMetadata } from "@/lib/i18n/metadata";

interface LocalizedArticlePageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const routes = getAllLocalizedArticleRoutes();
  return routes.map((r) => ({
    locale: r.locale,
    slug: r.slug,
  }));
}

export async function generateMetadata({ params }: LocalizedArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) {
    return {};
  }

  const result = getArticleBySlug(slug, locale);
  if (!result) {
    return {
      title: "Article Not Found — Leftover Tile Project Planner",
    };
  }

  const { article } = result;
  const trans = locale !== "en" ? article.translations?.[locale] : null;
  const title = trans?.title || article.title;
  const description = trans?.excerpt || article.excerpt;
  const targetSlug =
    locale !== "en" && article.localizedSlugs?.[locale]
      ? article.localizedSlugs[locale]
      : article.slug;

  return createLocalizedMetadata({
    locale,
    path: `/articles/${targetSlug}`,
    title: `${title} — Leftover Tile Project Planner`,
    description,
    imageUrl: article.featuredImageUrl,
  });
}

export default async function LocalizedArticleDetailPage({ params }: LocalizedArticlePageProps) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const result = getArticleBySlug(slug, locale);
  if (!result) {
    notFound();
  }

  return <ArticleDetailView article={result.article} locale={locale} />;
}
