import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/articles/articleStore";
import { ArticleDetailView } from "@/components/articles/ArticleDetailView";
import { createLocalizedMetadata } from "@/lib/i18n/metadata";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = getArticleBySlug(slug, "en");

  if (!result) {
    return {
      title: "Article Not Found — Leftover Tile Project Planner",
    };
  }

  const { article } = result;

  return createLocalizedMetadata({
    locale: "en",
    path: `/articles/${article.slug}`,
    title: `${article.title} — Leftover Tile Project Planner`,
    description: article.excerpt,
    imageUrl: article.featuredImageUrl,
  });
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const result = getArticleBySlug(slug, "en");

  if (!result) {
    notFound();
  }

  return <ArticleDetailView article={result.article} locale="en" />;
}
