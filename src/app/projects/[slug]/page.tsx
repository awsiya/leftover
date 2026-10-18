import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SEEDED_PROJECTS } from "@/lib/data/seededProjects";
import { ProjectDetailView } from "@/components/projects/ProjectDetailView";
import { createLocalizedMetadata } from "@/lib/i18n/metadata";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = SEEDED_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found — Leftover Tile Project Planner",
    };
  }

  return createLocalizedMetadata({
    locale: "en",
    path: `/projects/${project.slug}`,
    title: `${project.translations.en.title} — Printable DIY Plan ($4.99)`,
    description: project.translations.en.shortDescription,
    imageUrl: project.featuredImageUrl,
  });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = SEEDED_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailView project={project} locale="en" />;
}
