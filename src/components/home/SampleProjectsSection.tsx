"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, Layers, ArrowRight, Sparkles, Filter, ChevronRight } from "lucide-react";
import { SAMPLE_PROJECTS } from "@/lib/data/sampleProjects";
import { ProjectImage } from "@/components/ui/ProjectImage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const FILTER_CATEGORIES = [
  { id: "all", label: "All Projects (20)" },
  { id: "beginner", label: "Beginner Friendly" },
  { id: "kitchen-dining", label: "Kitchen & Dining" },
  { id: "garden-outdoor", label: "Garden & Outdoor" },
  { id: "home-decor", label: "Home Decor" },
];

export function SampleProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects = SAMPLE_PROJECTS.filter((p) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "beginner") return p.difficulty === "beginner";
    return p.category === activeFilter;
  });

  return (
    <section className="bg-ceramic-100/50 py-14 sm:py-20 border-b border-ceramic-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-terracotta-700">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Architectural DIY Blueprints</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 tracking-tight">
              Curated Upcycling Project Plans
            </h2>
            <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed">
              Each printable blueprint provides 1:1 scale cutting templates, thinset mixing ratios,
              TCNA silica safety protocols, and numbered step-by-step guidance for a one-time payment of $4.99.
            </p>
          </div>
          <div className="hidden sm:block">
            <Button href="/projects" variant="outline" size="md" className="bg-white hover:bg-ceramic-50">
              <span>View All 20 Plans</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>

        {/* Filter Pills Bar (Swipeable on Mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none sm:flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 mr-1 shrink-0">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter:</span>
          </div>
          {FILTER_CATEGORIES.map((cat) => {
            const isSelected = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveFilter(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  isSelected
                    ? "bg-terracotta-600 text-white shadow-sm"
                    : "bg-white text-charcoal-700 hover:bg-ceramic-100 border border-ceramic-300"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Project Cards (Grid on Desktop, Swipe-Snap Carousel on Mobile) */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 snap-x snap-mandatory scrollbar-none">
          {filteredProjects.slice(0, 6).map((project) => (
            <div
              key={project.id}
              className="min-w-[280px] w-[85vw] sm:w-auto snap-center flex flex-col h-full bg-white rounded-2xl border border-ceramic-300 shadow-card hover:shadow-subtle hover:border-terracotta-300 transition-all duration-300 overflow-hidden group"
            >
              {/* Image banner with Bulletproof Fallback */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-ceramic-100">
                <ProjectImage
                  src={project.imageUrl}
                  alt={project.title}
                  fallbackTitle={project.title}
                  categoryLabel={project.categoryLabel}
                  fill
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlaid Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                  <Badge
                    variant={
                      project.difficulty === "beginner"
                        ? "sage"
                        : project.difficulty === "intermediate"
                        ? "amber"
                        : "terracotta"
                    }
                    size="sm"
                    className="shadow-sm font-bold uppercase tracking-wider"
                  >
                    {project.difficulty}
                  </Badge>
                  {project.isOutdoorSafe && (
                    <Badge variant="outline" size="sm" className="bg-white/95 text-charcoal-800 backdrop-blur-xs font-semibold">
                      Outdoor Safe
                    </Badge>
                  )}
                </div>

                {/* Price Pill */}
                <div className="absolute bottom-3 right-3 z-10">
                  <span className="font-serif font-bold text-xs bg-charcoal-900/90 text-white px-2.5 py-1 rounded-full shadow-sm backdrop-blur-xs border border-white/20">
                    $4.99 Plan
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
                    {project.categoryLabel}
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal-900 group-hover:text-terracotta-700 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>

                {/* Technical Specifications Pill */}
                <div className="space-y-2 pt-2 border-t border-ceramic-100">
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-charcoal-700 bg-ceramic-50 p-2.5 rounded-lg border border-ceramic-200">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="h-3.5 w-3.5 text-terracotta-600 shrink-0" />
                      <span>{project.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Layers className="h-3.5 w-3.5 text-terracotta-600 shrink-0" />
                      <span>Min {project.minTilesRequired} tiles</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-charcoal-500 px-0.5">
                    <span>Dimensions:</span>
                    <strong className="text-charcoal-800 font-semibold">{project.dimensionsSummary}</strong>
                  </div>
                </div>

                {/* CTA Link */}
                <div className="pt-2">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg bg-ceramic-100 hover:bg-terracotta-600 hover:text-white text-charcoal-800 text-xs font-bold transition-all group-hover:bg-terracotta-600 group-hover:text-white"
                  >
                    <span>View Plan Blueprint</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Button href="/projects" variant="outline" size="md" className="w-full justify-center bg-white">
            <span>View All 20 DIY Project Plans</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>

      </div>
    </section>
  );
}
