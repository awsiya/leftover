import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Layers, ShieldCheck } from "lucide-react";
import { AppLocale, isValidLocale } from "@/lib/i18n/config";
import { createLocalizedMetadata, buildLocalizedPath } from "@/lib/i18n/metadata";
import { getNavTranslations } from "@/lib/i18n/navigation";
import { SAMPLE_PROJECTS } from "@/lib/data/sampleProjects";
import { SEEDED_PROJECTS } from "@/lib/data/seededProjects";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProjectImage } from "@/components/ui/ProjectImage";

interface ProjectsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

const PROJECTS_META: Record<AppLocale, { title: string; description: string }> = {
  en: {
    title: "DIY Project Plans Catalogue — Leftover Tile Project Planner",
    description:
      "Browse 20 curated architectural DIY project plans designed specifically for leftover ceramic, porcelain, and stone tile dimensions.",
  },
  de: {
    title: "DIY-Projektkatalog — Baupläne für Fliesenreste",
    description:
      "Entdecken Sie 20 erprobte DIY-Baupläne für übriggebliebene Wand- und Bodenfliesen. Exakte Schnittlisten und PDF-Anleitungen für 4,99 $.",
  },
  fr: {
    title: "Catalogue de projets DIY — Plans pour chutes de carrelage",
    description:
      "Explorez 20 plans de projets de bricolage conçus pour valoriser vos restes de carrelage et faïence. Gabarits de coupe et plans PDF à 4,99 $.",
  },
  es: {
    title: "Catálogo de proyectos DIY — Planos con azulejos sobrantes",
    description:
      "Explore 20 proyectos de bricolaje arquitectónico diseñados para restos de baldosas cerámicas y gres. Planos imprimibles por 4,99 $.",
  },
};

const CATEGORIES = [
  { slug: "all", label: "All Projects" },
  { slug: "kitchen-dining", label: "Kitchen & Dining" },
  { slug: "garden-outdoor", label: "Garden & Outdoor" },
  { slug: "home-decor", label: "Home Decor" },
];

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    return {};
  }

  const meta = PROJECTS_META[locale];
  return createLocalizedMetadata({
    locale,
    path: "/projects",
    title: meta.title,
    description: meta.description,
  });
}

export default async function LocalizedProjectsCataloguePage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const nav = getNavTranslations(locale);
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
        <div className="mb-8 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-700">
            Curated DIY Plans
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 tracking-tight">
            {nav.projects}
          </h1>
          <p className="text-base text-charcoal-600 leading-relaxed max-w-2xl">
            {PROJECTS_META[locale].description}
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat, idx) => (
            <span
              key={cat.slug}
              className={`px-3 py-1.5 rounded-editorial text-xs font-medium border cursor-pointer transition-colors ${
                idx === 0
                  ? "bg-terracotta-500 text-white border-terracotta-600"
                  : "bg-white text-charcoal-700 border-ceramic-300 hover:bg-ceramic-100"
              }`}
            >
              {cat.label}
            </span>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SAMPLE_PROJECTS.map((project) => {
            const projectTrans = SEEDED_PROJECTS.find((sp) => sp.id === project.id)?.translations?.[locale];
            const displayTitle = projectTrans?.title || project.title;
            const displayDescription = projectTrans?.shortDescription || project.shortDescription;
            const displayDimensions = projectTrans?.dimensionsSummary || project.dimensionsSummary;
            const projectHref = buildLocalizedPath(locale, `/projects/${project.slug}`);

            return (
              <Card key={project.id} hoverEffect className="flex flex-col h-full bg-white">
                {/* Image banner */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden rounded-editorial -mt-2 -mx-2 mb-4 bg-ceramic-200">
                  <ProjectImage
                    src={project.imageUrl}
                    alt={displayTitle}
                    fallbackTitle={displayTitle}
                    categoryLabel={project.categoryLabel}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <Badge
                      variant={
                        project.difficulty === "beginner"
                          ? "sage"
                          : project.difficulty === "intermediate"
                          ? "amber"
                          : "terracotta"
                      }
                      size="sm"
                    >
                      {project.difficulty.toUpperCase()}
                    </Badge>
                    {project.isOutdoorSafe && (
                      <Badge variant="outline" size="sm" className="bg-white/90 text-charcoal-800 backdrop-blur-xs">
                        Outdoor
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <CardHeader className="flex-1 pb-2">
                  <div className="flex items-center justify-between text-xs text-charcoal-500 mb-1">
                    <span>{project.categoryLabel}</span>
                    <span className="font-serif font-bold text-terracotta-600 text-sm">$4.99 Plan</span>
                  </div>
                  <CardTitle className="text-xl line-clamp-1">{displayTitle}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {displayDescription}
                  </CardDescription>
                </CardHeader>

                {/* Specs */}
                <CardContent className="pt-2 pb-0">
                  <div className="grid grid-cols-2 gap-2 rounded bg-ceramic-100 p-2.5 text-xs text-charcoal-700">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-charcoal-500" />
                      <span>{project.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-charcoal-500" />
                      <span>Min {project.minTilesRequired} tiles</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-charcoal-500">
                    Dimensions: <strong className="text-charcoal-800 font-medium">{displayDimensions}</strong>
                  </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="pt-4 flex items-center justify-between">
                  <span className="text-[11px] text-charcoal-500 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-sage-600" />
                    <span>Verified TCNA Spec</span>
                  </span>
                  <Link
                    href={projectHref}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta-600 hover:text-terracotta-700"
                  >
                    <span>Preview Plan</span>
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
