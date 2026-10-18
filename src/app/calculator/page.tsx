import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calculator, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { QuickCalculatorTeaser } from "@/components/home/QuickCalculatorTeaser";

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

        {/* Multi-Step Guide Roadmap Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border-terracotta-300">
            <span className="text-xs font-semibold text-terracotta-600 uppercase tracking-wider">Step 1</span>
            <h3 className="font-serif text-base font-bold text-charcoal-900 mt-1">Dimensions & Count</h3>
            <p className="text-xs text-charcoal-600 mt-1">Measure width, length, and count total intact pieces.</p>
          </Card>
          <Card className="bg-white">
            <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Step 2</span>
            <h3 className="font-serif text-base font-bold text-charcoal-900 mt-1">Material & Condition</h3>
            <p className="text-xs text-charcoal-600 mt-1">Select ceramic, porcelain, or fractured mosaic shards.</p>
          </Card>
          <Card className="bg-white">
            <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Step 3</span>
            <h3 className="font-serif text-base font-bold text-charcoal-900 mt-1">Matched DIY Plans</h3>
            <p className="text-xs text-charcoal-600 mt-1">Review ranked compatible plans with exact 1:1 cut sheets.</p>
          </Card>
        </div>

        {/* Live Interactive Calculation Preview */}
        <QuickCalculatorTeaser />

        {/* Information Callout */}
        <div className="mt-8 rounded-editorial border border-ceramic-300 bg-white p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-sage-600" />
              <span>Full Multi-Step Calculation Wizard Coming in Phase 2</span>
            </h4>
            <p className="text-xs text-charcoal-600 max-w-xl">
              Phase 2 introduces automated metric/imperial precision conversions, custom fractional
              saw kerf compensations, and direct inventory persistence.
            </p>
          </div>
          <Button href="/projects" variant="primary" size="md">
            <span>Browse Catalogue Directly</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
