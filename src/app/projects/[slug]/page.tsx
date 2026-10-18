import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Layers,
  Wrench,
  Hammer,
  ShieldAlert,
  FileDown,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { SAMPLE_PROJECTS } from "@/lib/data/sampleProjects";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = SAMPLE_PROJECTS.find((p) => p.slug === slug) || SAMPLE_PROJECTS[0];

  return {
    title: `${project.title} — Leftover Tile Project Planner`,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = SAMPLE_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-ceramic-50 min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-600 hover:text-terracotta-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Catalogue</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-start">
          {/* Project Featured Image */}
          <div className="lg:col-span-6 relative h-64 sm:h-80 w-full overflow-hidden rounded-editorial border border-ceramic-300 shadow-card">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Project Header & Purchase Card */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={
                  project.difficulty === "beginner"
                    ? "sage"
                    : project.difficulty === "intermediate"
                    ? "amber"
                    : "terracotta"
                }
                size="md"
              >
                {project.difficulty.toUpperCase()}
              </Badge>
              <Badge variant="outline" size="md">
                {project.categoryLabel}
              </Badge>
              {project.isOutdoorSafe && (
                <Badge variant="outline" size="md" className="bg-sage-50 text-sage-800">
                  Outdoor Safe
                </Badge>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 tracking-tight leading-tight">
              {project.title}
            </h1>

            <p className="text-sm text-charcoal-600 leading-relaxed">
              {project.subtitle}
            </p>

            <div className="grid grid-cols-2 gap-3 rounded-editorial border border-ceramic-300 bg-white p-3 text-xs text-charcoal-700">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-terracotta-600" />
                <span>Time: <strong>{project.estimatedTime}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-terracotta-600" />
                <span>Tiles: <strong>Min {project.minTilesRequired} pcs</strong></span>
              </div>
            </div>

            {/* Purchase Callout Box */}
            <div className="rounded-editorial border border-terracotta-300 bg-terracotta-50/70 p-5 space-y-3 shadow-subtle">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-800">
                    Printable Project Plan
                  </span>
                  <p className="text-xs text-charcoal-600">Architectural 1:1 cut templates & guide</p>
                </div>
                <div className="text-right">
                  <span className="font-serif text-3xl font-bold text-charcoal-900">$4.99</span>
                  <span className="text-xs text-charcoal-500 block">one-time payment</span>
                </div>
              </div>

              {/* Purchase Button Placeholder (Enabled in Phase 3 with Stripe) */}
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center shadow-subtle"
                disabled
              >
                <FileDown className="h-5 w-5" />
                <span>Purchase Plan — $4.99 (Stripe in Phase 3)</span>
              </Button>

              <div className="flex items-center justify-between text-[11px] text-charcoal-600 pt-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-terracotta-600" />
                  <span>Instant PDF download</span>
                </span>
                <span>PCI-compliant Stripe checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Project Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Materials & Tools */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="bg-white">
              <h2 className="font-serif text-xl font-bold text-charcoal-900 mb-4 flex items-center gap-2">
                <Hammer className="h-5 w-5 text-terracotta-600" />
                <span>Required Bill of Materials</span>
              </h2>
              <ul className="divide-y divide-ceramic-200 text-sm">
                {project.materials.map((mat) => (
                  <li key={mat.name} className="py-2.5 flex items-center justify-between">
                    <span className="text-charcoal-800">{mat.name}</span>
                    <span className="text-xs font-medium text-charcoal-500 bg-ceramic-100 px-2 py-0.5 rounded">
                      {mat.amount}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="bg-white">
              <h2 className="font-serif text-xl font-bold text-charcoal-900 mb-4 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-terracotta-600" />
                <span>Recommended Workshop Tools</span>
              </h2>
              <ul className="space-y-2 text-sm text-charcoal-700">
                {project.tools.map((tool) => (
                  <li key={tool.name} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sage-600 shrink-0" />
                    <span>{tool.name}</span>
                    {tool.isOptional && (
                      <span className="text-xs text-charcoal-400 italic">(optional)</span>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Right Column: Safety & Dimension Specs */}
          <div className="lg:col-span-5 space-y-6">
            {/* Dimensions */}
            <Card className="bg-white">
              <h3 className="font-serif text-lg font-bold text-charcoal-900 mb-2">
                Dimensions & Compatibility
              </h3>
              <div className="space-y-2 text-xs text-charcoal-700">
                <div className="flex justify-between py-1 border-b border-ceramic-200">
                  <span className="text-charcoal-500">Finished Dimensions:</span>
                  <span className="font-medium">{project.dimensionsSummary}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-ceramic-200">
                  <span className="text-charcoal-500">Tile Condition:</span>
                  <span className="font-medium capitalize">{project.tileCompatibility.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-charcoal-500">Allowed Materials:</span>
                  <span className="font-medium capitalize">{project.allowedMaterials.join(", ")}</span>
                </div>
              </div>
            </Card>

            {/* Safety Warning */}
            <div className="rounded-editorial border border-amber-300 bg-amber-50/80 p-5 space-y-2 text-xs text-amber-900">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <ShieldAlert className="h-4 w-4 text-amber-700" />
                <span>Workshop Safety Warning</span>
              </div>
              <p className="leading-relaxed">
                Cutting ceramic and porcelain tiles generates hazardous respirable crystalline silica
                dust. Use water-assisted cutting and wear a certified NIOSH N95/P100 respirator and
                impact safety glasses at all times during fabrication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
