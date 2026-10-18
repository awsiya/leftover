import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calculator, ShieldCheck } from "lucide-react";
import { TileMatchingWizard } from "@/components/calculator/TileMatchingWizard";

export const metadata: Metadata = {
  title: "Tile Inventory Calculator — Leftover Tile Project Planner",
  description:
    "Enter your surplus tile dimensions, units, and condition to calculate net usable surface area and match with verified DIY project plans.",
};

export default function CalculatorPage() {
  return (
    <div className="bg-ceramic-50 min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
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

        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-terracotta-700">
            <Calculator className="h-3.5 w-3.5" />
            <span>Deterministic Matching Engine</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 tracking-tight">
            Tile Inventory Calculator
          </h1>
          <p className="text-base text-charcoal-600 leading-relaxed max-w-2xl">
            Input your available ceramic, porcelain, or stone tile pieces. Our algorithm applies
            standard cutting kerf allowances and structural requirements to find compatible plans.
          </p>
        </div>

        {/* Interactive Matching Wizard */}
        <TileMatchingWizard />

        {/* Security & Math Disclaimer */}
        <div className="mt-12 rounded-editorial border border-ceramic-300 bg-white p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-serif text-base font-bold text-charcoal-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-sage-600" />
              <span>Zero Generative AI Hallucinations</span>
            </h4>
            <p className="text-xs text-charcoal-600 max-w-2xl">
              All area equations, cutting waste percentages (10% straight saw kerf, 25% mosaic fracture),
              and structural piece yields are calculated using pure geometric mathematics verified by
              TCNA industry standards.
            </p>
          </div>
          <Link
            href="/projects"
            className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 whitespace-nowrap"
          >
            Explore All 20 Plans &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
