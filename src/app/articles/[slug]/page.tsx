import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ShieldAlert, ArrowRight } from "lucide-react";
import { SAMPLE_ARTICLES } from "@/lib/data/sampleArticles";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = SAMPLE_ARTICLES.find((a) => a.slug === slug) || SAMPLE_ARTICLES[0];

  return {
    title: `${article.title} — Leftover Tile Project Planner`,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = SAMPLE_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="bg-ceramic-50 min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-600 hover:text-terracotta-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Articles</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-10 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="terracotta" size="sm">
              {article.category || "Safety & Craft"}
            </Badge>
            <span className="text-xs text-charcoal-500 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{article.readingTime || "8 min read"}</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-lg text-charcoal-700 leading-relaxed italic border-l-2 border-terracotta-500 pl-4 py-1">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-4 text-xs text-charcoal-500 border-t border-b border-ceramic-300 py-3">
            <span>By <strong>Leftover Tile Editorial Staff</strong></span>
            <span>•</span>
            <span>Published {article.date || "October 2026"}</span>
            <span>•</span>
            <span>Peer-Reviewed TCNA Guidance</span>
          </div>
        </header>

        {/* Article Body Content Placeholder */}
        <div className="prose prose-stone max-w-none text-charcoal-800 leading-relaxed space-y-6">
          <div className="rounded-editorial border border-amber-300 bg-amber-50/80 p-4 text-xs text-amber-900 flex items-start gap-2.5 not-prose">
            <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong>Safety Imperative:</strong> Never cut dry tile without dust extraction or a NIOSH N95/P100
              respirator. Water-assisted wet cutting keeps respirable crystalline silica trapped in slurry form.
            </p>
          </div>

          <p className="text-base sm:text-lg">
            Leftover architectural tiles represent one of the most durable, resilient, and versatile
            craft substrates in modern residential construction. Whether salvage from a bathroom remodel
            or sample pieces from a tile showroom, these vitrified clay and stone elements possess physical
            properties unmatched by wood or synthetic resin.
          </p>

          <h2 className="font-serif text-2xl font-bold text-charcoal-900 pt-4">
            Understanding Vitrification and Porosity
          </h2>
          <p>
            The difference between ceramic, porcelain, and quarry tile is largely a matter of kiln temperature,
            mineral purity, and subsequent water absorption rate:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-charcoal-700">
            <li>
              <strong>Non-vitreous tile:</strong> Water absorption greater than 7.0%. Typical for interior decorative
              wall tiles. Must never be used in freeze-thaw outdoor environments.
            </li>
            <li>
              <strong>Semi-vitreous tile:</strong> Water absorption between 3.0% and 7.0%. Suitable for light-duty
              interior countertops and dry decorative accessories.
            </li>
            <li>
              <strong>Impervious porcelain:</strong> Water absorption under 0.5%. Dense, frost-proof, and suitable
              for garden stepping stones, outdoor planters, and heavy-use trivets.
            </li>
          </ul>

          <div className="rounded-editorial border border-ceramic-300 bg-white p-6 my-8 not-prose shadow-subtle">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 mb-2">
              Ready to build a verified project?
            </h3>
            <p className="text-xs text-charcoal-600 mb-4">
              Enter your available leftover tile measurements into our calculator to generate exact
              cut layouts and match with our 20 curated project plans.
            </p>
            <Button href="/calculator" variant="primary" size="sm">
              <span>Try the Tile Calculator</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
