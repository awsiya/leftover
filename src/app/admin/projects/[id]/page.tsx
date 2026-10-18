import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminProjectById } from "@/lib/actions/adminProjects";
import { ProjectEditorForm } from "@/components/admin/ProjectEditorForm";

interface AdminProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: AdminProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getAdminProjectById(id);

  return {
    title: project
      ? `Edit ${project.translations.en.title} — Admin Portal`
      : "Project Not Found — Admin Portal",
  };
}

export default async function AdminProjectDetailPage({ params }: AdminProjectDetailPageProps) {
  const { id } = await params;
  const project = await getAdminProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <ProjectEditorForm initialProject={project} />
    </div>
  );
}
