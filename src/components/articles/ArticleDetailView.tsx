import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  Calendar,
  User,
  CheckCircle2,
  Layers,
  Sparkles,
} from "lucide-react";
import { ArticleRecord } from "@/lib/types/article";
import { AppLocale, DEFAULT_LOCALE, LOCALE_DISCLOSURES } from "@/lib/i18n/config";
import { buildLocalizedPath } from "@/lib/i18n/metadata";
import { getRelatedArticles, getRelatedProjectsForArticle } from "@/lib/articles/articleStore";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

interface ArticleDetailViewProps {
  article: ArticleRecord;
  locale?: AppLocale;
}

export function ArticleDetailView({ article, locale = DEFAULT_LOCALE }: ArticleDetailViewProps) {
  const backHref = buildLocalizedPath(locale, "/articles");
  const calculatorHref = buildLocalizedPath(locale, "/calculator");

  const localizedMeta =
    locale !== DEFAULT_LOCALE
      ? article.translations?.[locale as "de" | "fr" | "es"]
      : null;
  const displayTitle = localizedMeta?.title || article.title;
  const displayExcerpt = localizedMeta?.excerpt || article.excerpt;

  const disclosure = LOCALE_DISCLOSURES[locale];

  const relatedArticles = getRelatedArticles(article.slug, 3);
  const relatedProjects = getRelatedProjectsForArticle(article.relatedProjectSlugs);

  return (
    <article className="bg-ceramic-50 min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-600 hover:text-terracotta-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Guides Hub</span>
          </Link>
        </div>

        {/* Editorial Transparency Disclosure for Non-English */}
        {disclosure && (
          <div className="mb-8 rounded-editorial border border-ceramic-400 bg-ceramic-100 p-4 text-xs text-charcoal-700 shadow-xs">
            <div className="flex items-start gap-2.5">
              <span className="font-bold text-terracotta-700 uppercase tracking-wider text-[11px] shrink-0 mt-0.5">
                Notice:
              </span>
              <p className="leading-relaxed">{disclosure}</p>
            </div>
          </div>
        )}

        {/* Article Header */}
        <header className="mb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="terracotta" size="sm">
              {article.category}
            </Badge>
            <span className="text-xs text-charcoal-500 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{article.readingTimeMinutes} min read</span>
            </span>
            <span className="text-xs text-charcoal-400">•</span>
            <span className="text-xs text-charcoal-500">{article.wordCount} words</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900 tracking-tight leading-tight">
            {displayTitle}
          </h1>

          <p className="text-lg text-charcoal-700 leading-relaxed italic border-l-3 border-terracotta-500 pl-4 py-1">
            {displayExcerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-500 border-t border-b border-ceramic-300 py-3">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-terracotta-600" />
              <span>By <strong>{article.author}</strong></span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-terracotta-600" />
              <span>Published {new Date(article.publishedAt).toLocaleDateString()}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-sage-700">
              <CheckCircle2 className="h-3.5 w-3.5 text-sage-600" />
              <span>TCNA / ANSI Technical Standards</span>
            </span>
          </div>
        </header>

        {/* Table of Contents */}
        {article.tableOfContents && article.tableOfContents.length > 0 && (
          <nav
            aria-label="Table of Contents"
            className="mb-12 rounded-editorial border border-ceramic-300 bg-white p-6 shadow-subtle"
          >
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-charcoal-700 border-b border-ceramic-200 pb-2">
              <BookOpen className="h-4 w-4 text-terracotta-600" />
              <span>Table of Contents</span>
            </div>
            <ul className="space-y-1.5 text-sm">
              {article.tableOfContents.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-charcoal-700 hover:text-terracotta-600 transition-colors flex items-baseline gap-2 py-0.5"
                  >
                    <span className="text-terracotta-500 text-xs font-mono">&rarr;</span>
                    <span>{item.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Article Body Sections */}
        <div className="prose prose-stone max-w-none text-charcoal-800 leading-relaxed space-y-10">
          {article.sections.map((section, idx) => (
            <section key={section.id} id={section.id} className="scroll-mt-24 space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 border-b border-ceramic-200 pb-2">
                {section.title}
              </h2>

              <div className="text-base text-charcoal-800 leading-relaxed whitespace-pre-line space-y-4">
                {section.content}
              </div>

              {/* In-content safety reminder on section 1 */}
              {idx === 0 && (
                <div className="rounded-editorial border border-amber-300 bg-amber-50/80 p-4 text-xs text-amber-900 flex items-start gap-2.5 not-prose my-6">
                  <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                  <p>
                    <strong>Safety Directive:</strong> Always verify material water absorption ratings
                    and wear certified NIOSH respiratory protection before cutting or scoring vitrified
                    clay and stone.
                  </p>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Tile Calculator Callout */}
        <div className="my-14 rounded-editorial border border-terracotta-300 bg-terracotta-50/80 p-6 sm:p-8 shadow-subtle not-prose">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-terracotta-800">
                <Sparkles className="h-4 w-4 text-terracotta-600" />
                <span>Deterministic Tile Calculator</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
                Have leftover renovation tiles in your garage?
              </h3>
              <p className="text-sm text-charcoal-600 max-w-xl leading-relaxed">
                Enter your exact dimensions, tile condition (intact or broken shards), and count into
                our matching engine to discover verified architectural DIY project plans.
              </p>
            </div>
            <Button href={calculatorHref} variant="primary" size="lg" className="shrink-0">
              <span>Match My Tiles</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <div className="mb-14 not-prose">
            <div className="flex items-center gap-2 mb-6">
              <Layers className="h-5 w-5 text-terracotta-600" />
              <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                Matching Curated Project Plans
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedProjects.map((p) => {
                const projectDetailHref = buildLocalizedPath(locale, `/projects/${p.slug}`);
                const pTitle =
                  (locale !== "en" ? p.translations?.[locale as "de" | "fr" | "es"]?.title : null) ||
                  p.translations?.en?.title ||
                  "Project Plan";
                const pSubtitle =
                  (locale !== "en" ? p.translations?.[locale as "de" | "fr" | "es"]?.subtitle : null) ||
                  p.translations?.en?.subtitle ||
                  "";

                return (
                  <Card key={p.slug} hoverEffect className="bg-white flex flex-col justify-between">
                    <CardHeader>
                      <Badge variant="outline" size="sm" className="mb-2 self-start">
                        {p.categoryLabel}
                      </Badge>
                      <CardTitle className="text-base line-clamp-1">{pTitle}</CardTitle>
                      <CardDescription className="text-xs line-clamp-2 mt-1">
                        {pSubtitle}
                      </CardDescription>
                    </CardHeader>
                    <div className="p-4 pt-0 flex items-center justify-between border-t border-ceramic-200 mt-2 text-xs">
                      <span className="font-bold text-charcoal-900">$4.99 plan</span>
                      <Link
                        href={projectDetailHref}
                        className="font-semibold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1"
                      >
                        <span>View Plan</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="mb-14 not-prose">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-5 w-5 text-terracotta-600" />
              <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                Related DIY Guides & Technical Manuals
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedArticles.map((ra) => {
                const targetSlug =
                  locale !== DEFAULT_LOCALE && ra.localizedSlugs?.[locale]
                    ? ra.localizedSlugs[locale]
                    : ra.slug;
                const articleHref = buildLocalizedPath(locale, `/articles/${targetSlug}`);
                const titleText =
                  locale !== DEFAULT_LOCALE
                    ? ra.translations?.[locale as "de" | "fr" | "es"]?.title || ra.title
                    : ra.title;

                return (
                  <Card key={ra.slug} hoverEffect className="bg-white flex flex-col justify-between">
                    <CardHeader>
                      <Badge variant="outline" size="sm" className="mb-2 self-start">
                        {ra.category}
                      </Badge>
                      <CardTitle className="text-sm font-semibold line-clamp-2">
                        {titleText}
                      </CardTitle>
                    </CardHeader>
                    <div className="p-4 pt-0 flex items-center justify-between border-t border-ceramic-200 mt-2 text-xs">
                      <span className="text-charcoal-500">{ra.readingTimeMinutes} min</span>
                      <Link
                        href={articleHref}
                        className="font-semibold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1"
                      >
                        <span>Read</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
