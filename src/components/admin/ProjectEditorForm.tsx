"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Save,
  Layers,
  Wrench,
  Hammer,
  BookOpen,
  Globe,
  FileCheck2,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";
import { SeededProject } from "@/lib/data/seededProjects";
import { updateProjectVerification } from "@/lib/actions/adminProjects";
import { generateAdminPlanDownloadUrl } from "@/lib/actions/planDownloadActions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProjectVerificationStatus } from "@/lib/types/verification";

interface ProjectEditorFormProps {
  initialProject: SeededProject;
}

export function ProjectEditorForm({ initialProject }: ProjectEditorFormProps) {
  const router = useRouter();
  const [project, setProject] = useState<SeededProject>(initialProject);
  const [activeTab, setActiveTab] = useState<
    "general" | "requirements" | "materials-tools" | "instructions" | "translations" | "verification" | "pdf-plan"
  >("verification");

  // PDF Preview State
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState<string | null>(null);
  const [pdfChecksum, setPdfChecksum] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Verification evidence state
  const [targetStatus, setTargetStatus] = useState<ProjectVerificationStatus>(project.verificationStatus);
  const [verifierName, setVerifierName] = useState<string>(project.verifiedBy || "");
  const [testBuildDate, setTestBuildDate] = useState<string>(
    project.verifiedAt ? project.verifiedAt.split("T")[0] : new Date().toISOString().split("T")[0]
  );
  const [verificationNotes, setVerificationNotes] = useState<string>(project.verificationNotes || "");
  const [evidencePhotoUrl, setEvidencePhotoUrl] = useState<string>("");
  const [dimensionsVerified, setDimensionsVerified] = useState<boolean>(project.verificationStatus === "verified");
  const [cutSafetyVerified, setCutSafetyVerified] = useState<boolean>(project.verificationStatus === "verified");
  const [stabilityVerified, setStabilityVerified] = useState<boolean>(project.verificationStatus === "verified");
  const [adhesionVerified, setAdhesionVerified] = useState<boolean>(project.verificationStatus === "verified");

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Can verify only if all 4 checks are ticked and notes >= 20 chars
  const canVerify =
    dimensionsVerified &&
    cutSafetyVerified &&
    stabilityVerified &&
    adhesionVerified &&
    verifierName.trim().length >= 2 &&
    verificationNotes.trim().length >= 20;

  const handleVerificationSave = async () => {
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const evidence = {
      verifiedAt: new Date().toISOString(),
      verifiedBy: verifierName,
      testBuildDate,
      prototypeDimensionsVerified: dimensionsVerified,
      cutSafetyVerified,
      structuralStabilityVerified: stabilityVerified,
      materialAdhesionVerified: adhesionVerified,
      verificationNotes,
      evidencePhotoUrl,
    };

    const res = await updateProjectVerification(
      project.id,
      targetStatus,
      targetStatus === "verified" ? evidence : null
    );

    setSaving(false);
    if (!res.success) {
      setErrorMessage(res.errors?.join(" ") || "Failed to update verification status.");
    } else if (res.project) {
      setProject(res.project);
      setSuccessMessage(
        targetStatus === "verified"
          ? "Project successfully verified with physical build evidence. Commerce gate unlocked."
          : `Project status updated to '${targetStatus}'.`
      );
      router.refresh();
    }
  };

  const handleGeneratePdf = async () => {
    setPdfLoading(true);
    setPdfError(null);
    try {
      const res = await generateAdminPlanDownloadUrl(project.id, "v1.0.0");
      if (res.success && res.downloadUrl) {
        setPdfDownloadUrl(res.downloadUrl);
        setPdfChecksum(res.checksum || null);
      } else {
        setPdfError(res.error || "Failed to generate plan PDF preview.");
      }
    } catch (err: unknown) {
      setPdfError(err instanceof Error ? err.message : "Error generating PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button and status header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-terracotta-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Projects List</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-charcoal-500 font-medium">Current Status:</span>
          {project.verificationStatus === "verified" ? (
            <Badge variant="sage" size="md" className="gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>VERIFIED (Live for Sale)</span>
            </Badge>
          ) : project.verificationStatus === "reviewing" ? (
            <Badge variant="amber" size="md" className="gap-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>IN REVIEW (Physical Evidence Required)</span>
            </Badge>
          ) : (
            <Badge variant="outline" size="md">
              DRAFT CONCEPT
            </Badge>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 tracking-tight">
          {project.translations.en.title}
        </h1>
        <p className="text-xs text-charcoal-500 font-mono">
          Slug: {project.slug} • ID: {project.id} • Fixed Price: $4.99 (499¢)
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-ceramic-300 flex flex-wrap gap-2 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("verification")}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "verification"
              ? "border-terracotta-600 text-terracotta-700 font-bold"
              : "border-transparent text-charcoal-600 hover:text-charcoal-900"
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Physical Verification Audit</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "general"
              ? "border-terracotta-600 text-terracotta-700 font-bold"
              : "border-transparent text-charcoal-600 hover:text-charcoal-900"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>General Metadata</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("requirements")}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "requirements"
              ? "border-terracotta-600 text-terracotta-700 font-bold"
              : "border-transparent text-charcoal-600 hover:text-charcoal-900"
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          <span>Geometric Requirements</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("materials-tools")}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "materials-tools"
              ? "border-terracotta-600 text-terracotta-700 font-bold"
              : "border-transparent text-charcoal-600 hover:text-charcoal-900"
          }`}
        >
          <Hammer className="h-4 w-4" />
          <span>Materials & Tools</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("instructions")}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "instructions"
              ? "border-terracotta-600 text-terracotta-700 font-bold"
              : "border-transparent text-charcoal-600 hover:text-charcoal-900"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Instructions & Diagrams</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("translations")}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "translations"
              ? "border-terracotta-600 text-terracotta-700 font-bold"
              : "border-transparent text-charcoal-600 hover:text-charcoal-900"
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>Translations (4 Locales)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pdf-plan")}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "pdf-plan"
              ? "border-terracotta-600 text-terracotta-700 font-bold"
              : "border-transparent text-charcoal-600 hover:text-charcoal-900"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Printable PDF Plan (v1.0.0)</span>
        </button>
      </div>

      {/* Feedback Messages */}
      {errorMessage && (
        <div className="rounded-editorial border border-red-300 bg-red-50 p-4 text-xs text-red-900 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="rounded-editorial border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-900 flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* TAB 1: VERIFICATION AUDIT & PHYSICAL PROOF (CRITICAL RULE) */}
      {activeTab === "verification" && (
        <Card className="bg-white border-ceramic-300 shadow-card space-y-6">
          <CardHeader className="border-b border-ceramic-200 pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-terracotta-600" />
              <span>Physical Verification Audit & Commerce Gate</span>
            </CardTitle>
            <CardDescription>
              Enforce structural safety. Unverified projects are strictly prevented from checkout.
              Never mark verified without documented physical evidence.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Status Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                Project Verification Status
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTargetStatus("draft")}
                  className={`p-3 text-xs font-medium rounded-editorial border text-left transition-colors ${
                    targetStatus === "draft"
                      ? "border-charcoal-900 bg-charcoal-900 text-white"
                      : "border-ceramic-300 bg-white text-charcoal-700 hover:bg-ceramic-100"
                  }`}
                >
                  <strong className="block">DRAFT</strong>
                  <span className="text-[11px] opacity-80">Initial concept; cut calculations pending.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetStatus("reviewing")}
                  className={`p-3 text-xs font-medium rounded-editorial border text-left transition-colors ${
                    targetStatus === "reviewing"
                      ? "border-amber-600 bg-amber-600 text-white"
                      : "border-ceramic-300 bg-white text-charcoal-700 hover:bg-ceramic-100"
                  }`}
                >
                  <strong className="block">REVIEWING</strong>
                  <span className="text-[11px] opacity-80">Cut sheet ready; physical build test underway.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetStatus("verified")}
                  className={`p-3 text-xs font-medium rounded-editorial border text-left transition-colors ${
                    targetStatus === "verified"
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-ceramic-300 bg-white text-charcoal-700 hover:bg-ceramic-100"
                  }`}
                >
                  <strong className="block">VERIFIED (Sellable)</strong>
                  <span className="text-[11px] opacity-80">Requires full 4-point physical evidence.</span>
                </button>
              </div>
            </div>

            {/* Evidence Checklist (Required if target is verified) */}
            <div className="rounded-editorial border border-ceramic-300 bg-ceramic-50/70 p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-sage-600" />
                <span>Physical Test Build Inspection Checklist (Mandatory for &apos;Verified&apos;)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-start gap-2.5 p-2 rounded bg-white border border-ceramic-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dimensionsVerified}
                    onChange={(e) => setDimensionsVerified(e.target.checked)}
                    className="mt-0.5 rounded text-terracotta-600 focus:ring-terracotta-500"
                  />
                  <span>
                    <strong>1. Dimensions Measured:</strong> Physical prototype dimensions confirm nominal cut sheet tolerance (&le; 2mm).
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded bg-white border border-ceramic-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cutSafetyVerified}
                    onChange={(e) => setCutSafetyVerified(e.target.checked)}
                    className="mt-0.5 rounded text-terracotta-600 focus:ring-terracotta-500"
                  />
                  <span>
                    <strong>2. Cut Safety & Edges:</strong> Manual score cuts yield smooth chamfers without hazardous razor edges.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded bg-white border border-ceramic-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stabilityVerified}
                    onChange={(e) => setStabilityVerified(e.target.checked)}
                    className="mt-0.5 rounded text-terracotta-600 focus:ring-terracotta-500"
                  />
                  <span>
                    <strong>3. Structural Load:</strong> Substrate withstands rated load, boiling kettle heat, or outdoor weather.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded bg-white border border-ceramic-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adhesionVerified}
                    onChange={(e) => setAdhesionVerified(e.target.checked)}
                    className="mt-0.5 rounded text-terracotta-600 focus:ring-terracotta-500"
                  />
                  <span>
                    <strong>4. Adhesive Cure:</strong> Mastic or thinset bonding fully cured without delamination or grout crumbling.
                  </span>
                </label>
              </div>

              {/* Form inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Verifier Full Name / Inspector ID
                  </label>
                  <input
                    type="text"
                    value={verifierName}
                    placeholder="e.g. Master Tile Artisan J. Miller"
                    onChange={(e) => setVerifierName(e.target.value)}
                    className="w-full rounded-editorial border border-ceramic-300 bg-white px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Physical Test Build Date
                  </label>
                  <input
                    type="date"
                    value={testBuildDate}
                    onChange={(e) => setTestBuildDate(e.target.value)}
                    className="w-full rounded-editorial border border-ceramic-300 bg-white px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Physical Build Audit Notes (Min 20 characters)
                  </label>
                  <textarea
                    rows={3}
                    value={verificationNotes}
                    placeholder="Document prototype fabrication notes, test results, adhesive cure times, and measured load limits..."
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    className="w-full rounded-editorial border border-ceramic-300 bg-white px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Evidence Prototype Photo / Storage URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={evidencePhotoUrl}
                    placeholder="https://..."
                    onChange={(e) => setEvidencePhotoUrl(e.target.value)}
                    className="w-full rounded-editorial border border-ceramic-300 bg-white px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-ceramic-200">
              <span className="text-xs text-charcoal-500">
                {targetStatus === "verified" && !canVerify && (
                  <span className="text-amber-700 font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Complete all 4 verification checkboxes and provide notes (&ge;20 chars) to unlock publishing.</span>
                  </span>
                )}
              </span>

              <Button
                type="button"
                variant="primary"
                size="md"
                disabled={saving || (targetStatus === "verified" && !canVerify)}
                onClick={handleVerificationSave}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? "Saving Changes..." : "Save Verification Status"}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: GENERAL METADATA */}
      {activeTab === "general" && (
        <Card className="bg-white border-ceramic-300 p-6 space-y-4">
          <CardTitle className="text-lg">General Metadata</CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-charcoal-500 block">Category</span>
              <strong className="text-sm font-semibold">{project.categoryLabel}</strong>
            </div>
            <div>
              <span className="text-charcoal-500 block">Difficulty</span>
              <strong className="text-sm font-semibold capitalize">{project.difficulty}</strong>
            </div>
            <div>
              <span className="text-charcoal-500 block">Estimated Fabrication Time</span>
              <strong className="text-sm font-semibold">{project.estimatedTimeMinutes} minutes</strong>
            </div>
            <div>
              <span className="text-charcoal-500 block">Plan Price (Integer Cents)</span>
              <strong className="text-sm font-semibold">${(project.priceCents / 100).toFixed(2)} USD (499¢)</strong>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 3: REQUIREMENTS */}
      {activeTab === "requirements" && (
        <Card className="bg-white border-ceramic-300 p-6 space-y-4">
          <CardTitle className="text-lg">Geometric & Material Requirements</CardTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-2.5 rounded bg-ceramic-100">
              <span className="text-charcoal-500 block">Min Area:</span>
              <strong className="text-charcoal-900">{(project.requirements.minAreaSqMm / 92903.04).toFixed(2)} sq ft</strong>
            </div>
            <div className="p-2.5 rounded bg-ceramic-100">
              <span className="text-charcoal-500 block">Target Area:</span>
              <strong className="text-charcoal-900">{(project.requirements.targetAreaSqMm / 92903.04).toFixed(2)} sq ft</strong>
            </div>
            <div className="p-2.5 rounded bg-ceramic-100">
              <span className="text-charcoal-500 block">Min Tile Count:</span>
              <strong className="text-charcoal-900">{project.requirements.minTileCount} pcs</strong>
            </div>
            <div className="p-2.5 rounded bg-ceramic-100">
              <span className="text-charcoal-500 block">Allowed Conditions:</span>
              <strong className="text-charcoal-900">{project.requirements.allowedConditions.join(", ")}</strong>
            </div>
            <div className="p-2.5 rounded bg-ceramic-100">
              <span className="text-charcoal-500 block">Allowed Materials:</span>
              <strong className="text-charcoal-900">{project.requirements.allowedMaterials.join(", ")}</strong>
            </div>
            <div className="p-2.5 rounded bg-ceramic-100">
              <span className="text-charcoal-500 block">Outdoor Rated:</span>
              <strong className="text-charcoal-900">{project.requirements.isOutdoorRated ? "Yes (Porcelain only)" : "No (Indoor only)"}</strong>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 4: MATERIALS & TOOLS */}
      {activeTab === "materials-tools" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border-ceramic-300 p-6 space-y-3">
            <CardTitle className="text-base flex items-center gap-1.5">
              <Hammer className="h-4 w-4 text-terracotta-600" />
              <span>Bill of Materials</span>
            </CardTitle>
            <ul className="divide-y divide-ceramic-200 text-xs">
              {project.materials.map((mat) => (
                <li key={mat.name} className="py-2 flex justify-between">
                  <span>{mat.name}</span>
                  <span className="font-semibold text-charcoal-600">{mat.amount}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="bg-white border-ceramic-300 p-6 space-y-3">
            <CardTitle className="text-base flex items-center gap-1.5">
              <Wrench className="h-4 w-4 text-terracotta-600" />
              <span>Recommended Workshop Tools</span>
            </CardTitle>
            <ul className="space-y-1.5 text-xs text-charcoal-700">
              {project.tools.map((tool) => (
                <li key={tool.name} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-sage-600 shrink-0" />
                  <span>{tool.name}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* TAB 5: INSTRUCTIONS */}
      {activeTab === "instructions" && (
        <Card className="bg-white border-ceramic-300 p-6 space-y-4">
          <CardTitle className="text-base">Fabrication Steps & Safety Tips</CardTitle>
          <div className="space-y-3 text-xs">
            {project.instructions.map((step) => (
              <div key={step.stepNumber} className="p-3 rounded bg-ceramic-50 border border-ceramic-200 space-y-1">
                <span className="font-bold text-terracotta-600">Step {step.stepNumber}: {step.title}</span>
                <p className="text-charcoal-700">{step.instruction}</p>
                {step.safetyTip && (
                  <p className="text-amber-800 font-medium pt-1">Safety: {step.safetyTip}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 6: TRANSLATIONS */}
      {activeTab === "translations" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["en", "de", "fr", "es"] as const).map((loc) => {
            const t = project.translations[loc];
            return (
              <Card key={loc} className="bg-white border-ceramic-300 p-4 space-y-2 text-xs">
                <Badge variant="outline" size="sm" className="uppercase font-bold">
                  Locale: {loc}
                </Badge>
                <div className="space-y-1">
                  <span className="text-charcoal-500 block">Title</span>
                  <strong className="text-sm font-serif">{t.title}</strong>
                </div>
                <div className="space-y-1">
                  <span className="text-charcoal-500 block">Subtitle</span>
                  <p className="text-charcoal-700">{t.subtitle}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-charcoal-500 block">Dimensions Summary</span>
                  <p className="font-medium text-charcoal-800">{t.dimensionsSummary}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* TAB 7: PRINTABLE PDF PLAN PIPELINE */}
      {activeTab === "pdf-plan" && (
        <Card className="bg-white border-ceramic-300 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ceramic-200">
            <div>
              <CardTitle className="text-base font-serif">Architectural PDF Plan Pipeline (v1.0.0)</CardTitle>
              <CardDescription className="text-xs text-charcoal-600 mt-1">
                Publication-quality vector PDF containing cutting blueprints, verified measurements, materials checklist, and TCNA safety notes.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleGeneratePdf}
              disabled={pdfLoading}
              className="shrink-0 flex items-center gap-2"
            >
              {pdfLoading ? (
                <span>Generating Vector PDF...</span>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Generate & Preview Plan PDF</span>
                </>
              )}
            </Button>
          </div>

          {pdfError && (
            <div className="rounded border border-red-300 bg-red-50 p-3 text-xs text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
              <span>{pdfError}</span>
            </div>
          )}

          {pdfDownloadUrl && (
            <div className="rounded border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-950 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  Printable Plan PDF Generated Successfully
                </span>
                <a
                  href={pdfDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition-colors w-fit"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Download / Open PDF</span>
                </a>
              </div>
              <p className="text-[11px] text-emerald-900 font-mono break-all">
                SHA-256 Checksum: {pdfChecksum}
              </p>
              <p className="text-[11px] text-emerald-800">
                Protected Token Active (Valid for 15 minutes under Admin Audit Preview).
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded bg-ceramic-50 border border-ceramic-200 space-y-1">
              <span className="text-charcoal-500 font-semibold block uppercase text-[10px]">Document Format</span>
              <strong className="text-charcoal-900 block text-sm">3 Pages (US Letter / A4)</strong>
              <span className="text-charcoal-600">Vector-sharp architectural schematics</span>
            </div>

            <div className="p-3 rounded bg-ceramic-50 border border-ceramic-200 space-y-1">
              <span className="text-charcoal-500 font-semibold block uppercase text-[10px]">Version Freeze</span>
              <strong className="text-charcoal-900 block text-sm">Release v1.0.0</strong>
              <span className="text-charcoal-600">Deterministic snapshot matches version sold</span>
            </div>

            <div className="p-3 rounded bg-ceramic-50 border border-ceramic-200 space-y-1">
              <span className="text-charcoal-500 font-semibold block uppercase text-[10px]">Commerce Protection</span>
              <strong className={`block text-sm ${project.verificationStatus === "verified" ? "text-emerald-700" : "text-amber-700"}`}>
                {project.verificationStatus === "verified" ? "Unlocked (Sellable)" : "Locked (Unverified)"}
              </strong>
              <span className="text-charcoal-600">
                {project.verificationStatus === "verified"
                  ? "Available for customer checkout"
                  : "Protected: Requires physical verification"}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-charcoal-900">Included Blueprint Sections</h4>
            <ul className="list-disc list-inside space-y-1 text-charcoal-700">
              <li>FIG 1.0 — Schematic Cutting &amp; Layout Blueprint (Top-down plan view with kerf callout)</li>
              <li>FIG 2.0 — Structural Bonding &amp; Substrate Cross-Section (Substrate, mortar bed, tile, grout)</li>
              <li>Verified measurements table (Target footprint, min area, piece count yield, thickness range)</li>
              <li>Full Bill of Materials checklist with checkboxes and exact quantities</li>
              <li>Workshop tools checklist (standard and optional equipment)</li>
              <li>Numbered fabrication steps with inline safety tips</li>
              <li>Mandatory OSHA / TCNA crystalline silica and cut-safety protocol</li>
              <li>Anti-tamper cryptographic SHA-256 seal and customer license watermark</li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
}
