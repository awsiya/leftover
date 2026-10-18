import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, LOCALES } from "@/lib/i18n/config";
import { SEEDED_PROJECTS } from "@/lib/data/seededProjects";
import { ProjectDetailView } from "@/components/projects/ProjectDetailView";
import { createLocalizedMetadata } from "@/lib/i18n/metadata";

interface LocalizedProjectPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of LOCALES) {
    for (const project of SEEDED_PROJECTS) {
      params.push({ locale, slug: project.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: LocalizedProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) {
    return {};
  }

  const project = SEEDED_PROJECTS.find((p) => p.slug === slug);
  if (!project) {
    return {
      title: "Project Not Found — Leftover Tile Project Planner",
    };
  }

  const localizedData = locale !== "en" ? project.translations?.[locale as "de" | "fr" | "es"] : null;
  const title = localizedData?.title || project.translations.en.title;
  const description = localizedData?.shortDescription || project.translations.en.shortDescription;

  return createLocalizedMetadata({
    locale,
    path: `/projects/${project.slug}`,
    title: `${title} — Printable DIY Plan ($4.99)`,
    description,
    imageUrl: project.featuredImageUrl,
  });
}

export default async function LocalizedProjectDetailPage({ params }: LocalizedProjectPageProps) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const project = SEEDED_PROJECTS.find((p) => p.slug === slug);
  if (!project) {
    notFound();
  }

  return <ProjectDetailView project={project} locale={locale} />;
}
