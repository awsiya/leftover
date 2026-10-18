import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Clock,
  ChevronRight,
  Filter,
  CheckCircle2,
  FileQuestion,
} from "lucide-react";
import { getAdminProjects } from "@/lib/actions/adminProjects";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface AdminDashboardPageProps {
  searchParams: Promise<{
    status?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const params = await searchParams;
  const projects = await getAdminProjects({
    status: params.status,
    category: params.category,
    search: params.search,
  });

  const allProjects = await getAdminProjects();
  const draftCount = allProjects.filter((p) => p.verificationStatus === "draft").length;
  const reviewingCount = allProjects.filter((p) => p.verificationStatus === "reviewing").length;
  const verifiedCount = allProjects.filter((p) => p.verificationStatus === "verified").length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900 tracking-tight">
            Tile Project Concepts & CRUD Manager
          </h1>
          <p className="text-sm text-charcoal-600 mt-1">
            Manage 20 curated project plans, geometric requirements, materials, translations, and physical verification audit logs.
          </p>
        </div>
      </div>

      {/* Critical Verification Rule Notice */}
      <div className="rounded-editorial border border-amber-300 bg-amber-50/90 p-4 text-xs text-amber-950 flex items-start gap-3 shadow-subtle">
        <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-sm text-amber-900">
            Physical Verification Protocol (TCNA Duty of Care):
          </p>
          <p className="leading-relaxed">
            All 20 seeded projects are strictly designated as <strong>DRAFT</strong> or{" "}
            <strong>REVIEWING</strong>. A plan must <strong>never</strong> be marked as verified
            without documented physical build evidence (prototype measurements, edge smoothness,
            structural load, and thinset cure notes). Unverified projects are strictly prevented from
            being sold.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-white p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500 block">Total Concepts</span>
          <span className="font-serif text-2xl font-bold text-charcoal-900 mt-1 block">{allProjects.length}</span>
          <span className="text-[11px] text-charcoal-500">Across 5 DIY categories</span>
        </Card>

        <Card className="bg-white p-4 border-amber-200 bg-amber-50/40">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 block">In Review</span>
          <span className="font-serif text-2xl font-bold text-amber-900 mt-1 block">{reviewingCount}</span>
          <span className="text-[11px] text-amber-700">Workshop test builds underway</span>
        </Card>

        <Card className="bg-white p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500 block">Draft Concepts</span>
          <span className="font-serif text-2xl font-bold text-charcoal-700 mt-1 block">{draftCount}</span>
          <span className="text-[11px] text-charcoal-500">Cut specs calculated</span>
        </Card>

        <Card className={`p-4 ${verifiedCount === 0 ? "bg-white border-ceramic-300" : "bg-emerald-50 border-emerald-300"}`}>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 block">Verified for Sale</span>
          <span className="font-serif text-2xl font-bold text-emerald-900 mt-1 block">{verifiedCount}</span>
          <span className="text-[11px] text-charcoal-500">
            {verifiedCount === 0 ? "0 Verified (Unverified blocked)" : "Available in public checkout"}
          </span>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="bg-white p-4 border-ceramic-300 shadow-subtle">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-charcoal-500 font-medium flex items-center gap-1 mr-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Status:</span>
            </span>
            <Link
              href="/admin"
              className={`px-2.5 py-1 rounded border transition-colors ${
                !params.status || params.status === "all"
                  ? "bg-charcoal-900 text-white border-charcoal-900"
                  : "bg-white text-charcoal-700 border-ceramic-300 hover:bg-ceramic-100"
              }`}
            >
              All ({allProjects.length})
            </Link>
            <Link
              href="/admin?status=reviewing"
              className={`px-2.5 py-1 rounded border transition-colors ${
                params.status === "reviewing"
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-white text-charcoal-700 border-ceramic-300 hover:bg-ceramic-100"
              }`}
            >
              In Review ({reviewingCount})
            </Link>
            <Link
              href="/admin?status=draft"
              className={`px-2.5 py-1 rounded border transition-colors ${
                params.status === "draft"
                  ? "bg-charcoal-800 text-white border-charcoal-800"
                  : "bg-white text-charcoal-700 border-ceramic-300 hover:bg-ceramic-100"
              }`}
            >
              Drafts ({draftCount})
            </Link>
            <Link
              href="/admin?status=verified"
              className={`px-2.5 py-1 rounded border transition-colors ${
                params.status === "verified"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-charcoal-700 border-ceramic-300 hover:bg-ceramic-100"
              }`}
            >
              Verified ({verifiedCount})
            </Link>
          </div>

          <div className="text-xs text-charcoal-500">
            Showing <strong>{projects.length}</strong> of {allProjects.length} projects
          </div>
        </div>
      </Card>

      {/* Projects Table */}
      <div className="rounded-editorial border border-ceramic-300 bg-white overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal-700 divide-y divide-ceramic-200">
            <thead className="bg-ceramic-100/70 text-charcoal-900 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th scope="col" className="px-4 py-3">Project Concept</th>
                <th scope="col" className="px-4 py-3">Category</th>
                <th scope="col" className="px-4 py-3">Difficulty</th>
                <th scope="col" className="px-4 py-3">Min Area & Tiles</th>
                <th scope="col" className="px-4 py-3">Verification Status</th>
                <th scope="col" className="px-4 py-3">Commerce Gate</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ceramic-200">
              {projects.map((project) => {
                const isVerified = project.verificationStatus === "verified";
                return (
                  <tr key={project.id} className="hover:bg-ceramic-50/80 transition-colors">
                    {/* Title & Slug */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="font-serif font-bold text-sm text-charcoal-900">
                          {project.translations.en.title}
                        </span>
                        <span className="text-[11px] text-charcoal-400 font-mono mt-0.5">
                          {project.slug}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-medium text-charcoal-700">
                        {project.categoryLabel}
                      </span>
                    </td>

                    {/* Difficulty */}
                    <td className="px-4 py-3.5">
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
                    </td>

                    {/* Dimensions & Tiles */}
                    <td className="px-4 py-3.5 text-xs text-charcoal-600">
                      <div>{(project.requirements.minAreaSqMm / 92903.04).toFixed(2)} sq ft</div>
                      <div className="text-[11px] text-charcoal-500">Min {project.requirements.minTileCount} pcs</div>
                    </td>

                    {/* Verification Status */}
                    <td className="px-4 py-3.5">
                      {isVerified ? (
                        <Badge variant="sage" size="sm" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>VERIFIED</span>
                        </Badge>
                      ) : project.verificationStatus === "reviewing" ? (
                        <Badge variant="amber" size="sm" className="gap-1">
                          <Clock className="h-3 w-3" />
                          <span>REVIEWING</span>
                        </Badge>
                      ) : (
                        <Badge variant="outline" size="sm" className="gap-1 text-charcoal-600">
                          <FileQuestion className="h-3 w-3" />
                          <span>DRAFT</span>
                        </Badge>
                      )}
                    </td>

                    {/* Commerce Gate */}
                    <td className="px-4 py-3.5">
                      {isVerified ? (
                        <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Can be Sold ($4.99)</span>
                        </span>
                      ) : (
                        <span className="text-amber-700 text-[11px] flex items-center gap-1 font-medium">
                          <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                          <span>Sale Blocked</span>
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-editorial bg-charcoal-900 text-white text-xs font-medium hover:bg-charcoal-800 transition-colors shadow-subtle"
                      >
                        <span>Edit / Verify</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
