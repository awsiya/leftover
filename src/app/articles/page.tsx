import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, ArrowRight } from "lucide-react";
import { SAMPLE_ARTICLES } from "@/lib/data/sampleArticles";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "DIY Tile Craft & Upcycling Guides — Leftover Tile Project Planner",
  description:
    "Authoritative DIY articles covering safe ceramic cutting, silica dust suppression, mosaic fracture techniques, adhesive selection, and weatherproofing.",
};

export default function ArticlesHubPage() {
  return (
    <div className="bg-ceramic-50 min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-600 hover:text-terracotta-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Section Header */}
        <div className="mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-terracotta-700">
            <BookOpen className="h-3.5 w-3.5" />
            <span>DIY Editorial Knowledgebase</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 tracking-tight">
            Tile Craft & Workshop Guides
          </h1>
          <p className="text-base text-charcoal-600 leading-relaxed max-w-2xl">
            Expert, peer-reviewed DIY guides covering cutting mechanics, safety protocols, grout
            chemistry, and upcycling ideas. Fifteen comprehensive guides launching in Phase 6.
          </p>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SAMPLE_ARTICLES.map((article) => (
            <Card key={article.slug} hoverEffect className="flex flex-col h-full bg-white">
              <CardHeader className="flex-1">
                <div className="flex items-center justify-between text-xs text-charcoal-500 mb-2">
                  <Badge variant="outline" size="sm">
                    {article.category || "DIY Craft"}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{article.readingTime || "8 min read"}</span>
                  </span>
                </div>
                <CardTitle className="text-xl">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="hover:text-terracotta-600 transition-colors"
                  >
                    {article.title}
                  </Link>
                </CardTitle>
                <CardDescription className="mt-2">
                  {article.excerpt}
                </CardDescription>
              </CardHeader>

              <CardFooter className="pt-4 flex items-center justify-between">
                <span className="text-xs text-charcoal-500">{article.date || "October 2026"}</span>
                <Link
                  href={`/articles/${article.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta-600 hover:text-terracotta-700"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
