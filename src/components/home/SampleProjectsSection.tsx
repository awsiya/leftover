import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Layers, ArrowRight, ShieldCheck } from "lucide-react";
import { SAMPLE_PROJECTS } from "@/lib/data/sampleProjects";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function SampleProjectsSection() {
  return (
    <section className="bg-ceramic-50/50 py-16 sm:py-20 border-b border-ceramic-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-700">
              Curated DIY Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 tracking-tight">
              Sample Project Plans
            </h2>
            <p className="text-base text-charcoal-600 leading-relaxed">
              Every plan contains full 1:1 cutting templates, adhesive mixing formulas, step-by-step
              assembly photography, and workshop safety guidelines.
            </p>
          </div>
          <Button href="/projects" variant="outline" size="md">
            <span>View All 20 Plans</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SAMPLE_PROJECTS.slice(0, 6).map((project) => (
            <Card key={project.id} hoverEffect className="flex flex-col h-full bg-white">
              {/* Image banner */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden rounded-editorial -mt-2 -mx-2 mb-4">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
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
                      Outdoor Safe
                    </Badge>
                  )}
                </div>
              </div>

              {/* Header */}
              <CardHeader className="flex-1 pb-2">
                <div className="flex items-center justify-between text-xs text-charcoal-500 mb-1">
                  <span>{project.categoryLabel}</span>
                  <span className="font-serif font-bold text-terracotta-600 text-sm">$4.99 Plan</span>
                </div>
                <CardTitle className="text-xl line-clamp-1">{project.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {project.shortDescription}
                </CardDescription>
              </CardHeader>

              {/* Metadata Stats */}
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
                  Dimensions: <strong className="text-charcoal-800 font-medium">{project.dimensionsSummary}</strong>
                </div>
              </CardContent>

              {/* Footer CTA */}
              <CardFooter className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-charcoal-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-sage-600" />
                  <span>Verified TCNA Spec</span>
                </div>
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta-600 hover:text-terracotta-700"
                >
                  <span>Preview Plan</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
