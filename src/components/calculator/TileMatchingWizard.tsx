"use client";

import React, { useState, useMemo } from "react";
import {
  Calculator,
  AlertTriangle,
  ArrowRight,
  Scissors,
  Check,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { TileUnit, TileCondition, TileMaterialType } from "@/lib/types/tile";
import { matchTileInventory, MatchingEngineOutput } from "@/lib/matching/engine";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function TileMatchingWizard() {
  const [unit, setUnit] = useState<TileUnit>("inches");
  const [length, setLength] = useState<number>(6);
  const [width, setWidth] = useState<number>(6);
  const [thicknessMm, setThicknessMm] = useState<number>(8);
  const [quantity, setQuantity] = useState<number>(12);
  const [condition, setCondition] = useState<TileCondition>("intact");
  const [materialType, setMaterialType] = useState<TileMaterialType>("ceramic");
  const [activeTab, setActiveTab] = useState<"all" | "feasible" | "infeasible">("feasible");

  // Run pure deterministic matching engine
  const matchingOutput: MatchingEngineOutput = useMemo(() => {
    try {
      return matchTileInventory({
        length: Math.max(0.1, length || 0),
        width: Math.max(0.1, width || 0),
        thicknessMm: Math.max(1, thicknessMm || 8),
        unit,
        quantity: Math.max(1, Math.round(quantity || 0)),
        condition,
        materialType,
      });
    } catch {
      return {
        normalizedTile: {
          lengthMm: 152.4,
          widthMm: 152.4,
          thicknessMm: 8,
          quantity: 1,
          unit: "inches",
          grossAreaSqMm: 23225,
          netUsableAreaSqMm: 20903,
          condition: "intact",
          materialType: "ceramic",
          wasteMultiplier: 0.9,
        },
        results: [],
        feasibleCount: 0,
        infeasibleCount: 0,
        topRecommendation: null,
      };
    }
  }, [length, width, thicknessMm, unit, quantity, condition, materialType]);

  const filteredResults = useMemo(() => {
    if (activeTab === "feasible") {
      return matchingOutput.results.filter((r) => r.isFeasible);
    }
    if (activeTab === "infeasible") {
      return matchingOutput.results.filter((r) => !r.isFeasible);
    }
    return matchingOutput.results;
  }, [matchingOutput, activeTab]);

  return (
    <div className="space-y-8">
      {/* Tile Inventory Input Card */}
      <Card className="bg-white border-ceramic-300 shadow-card">
        <CardHeader className="border-b border-ceramic-200 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded bg-terracotta-100 text-terracotta-700">
                <Calculator className="h-5 w-5" />
              </span>
              <div>
                <CardTitle className="text-xl">1. Available Tile Inventory</CardTitle>
                <CardDescription>
                  Enter exact measurements and physical state of your surplus batch
                </CardDescription>
              </div>
            </div>
            <Badge variant="sage" size="md">
              Deterministic Math Engine
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Row 1: Units, Length, Width, Thickness, Quantity */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {/* Unit */}
            <div>
              <label htmlFor="wizard-unit-select" className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Unit of Measure
              </label>
              <select
                id="wizard-unit-select"
                value={unit}
                onChange={(e) => setUnit(e.target.value as TileUnit)}
                className="w-full rounded-editorial border border-ceramic-300 bg-white px-3 py-2 text-sm text-charcoal-900 focus:border-terracotta-500 focus:outline-none"
              >
                <option value="inches">Inches (in)</option>
                <option value="cm">Centimeters (cm)</option>
                <option value="mm">Millimeters (mm)</option>
              </select>
            </div>

            {/* Length */}
            <div>
              <label htmlFor="wizard-length-input" className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Length ({unit})
              </label>
              <input
                id="wizard-length-input"
                type="number"
                min="0.5"
                step="0.25"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                className="w-full rounded-editorial border border-ceramic-300 bg-white px-3 py-2 text-sm text-charcoal-900 focus:border-terracotta-500 focus:outline-none"
              />
            </div>

            {/* Width */}
            <div>
              <label htmlFor="wizard-width-input" className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Width ({unit})
              </label>
              <input
                id="wizard-width-input"
                type="number"
                min="0.5"
                step="0.25"
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                className="w-full rounded-editorial border border-ceramic-300 bg-white px-3 py-2 text-sm text-charcoal-900 focus:border-terracotta-500 focus:outline-none"
              />
            </div>

            {/* Thickness */}
            <div>
              <label htmlFor="wizard-thickness-input" className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Thickness (mm)
              </label>
              <input
                id="wizard-thickness-input"
                type="number"
                min="3"
                max="30"
                value={thicknessMm}
                onChange={(e) => setThicknessMm(parseFloat(e.target.value) || 8)}
                className="w-full rounded-editorial border border-ceramic-300 bg-white px-3 py-2 text-sm text-charcoal-900 focus:border-terracotta-500 focus:outline-none"
              />
            </div>

            {/* Quantity */}
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="wizard-qty-input" className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Tile Count (pcs)
              </label>
              <input
                id="wizard-qty-input"
                type="number"
                min="1"
                max="5000"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                className="w-full rounded-editorial border border-ceramic-300 bg-white px-3 py-2 text-sm text-charcoal-900 focus:border-terracotta-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Condition & Material */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-ceramic-200">
            {/* Condition */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-2">
                Tile Batch Condition
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCondition("intact")}
                  className={`px-3 py-2 text-xs font-medium rounded-editorial border text-center transition-colors ${
                    condition === "intact"
                      ? "border-terracotta-500 bg-terracotta-50 text-terracotta-800 font-semibold"
                      : "border-ceramic-300 bg-white text-charcoal-700 hover:bg-ceramic-100"
                  }`}
                >
                  Intact (100%)
                </button>
                <button
                  type="button"
                  onClick={() => setCondition("mixed")}
                  className={`px-3 py-2 text-xs font-medium rounded-editorial border text-center transition-colors ${
                    condition === "mixed"
                      ? "border-terracotta-500 bg-terracotta-50 text-terracotta-800 font-semibold"
                      : "border-ceramic-300 bg-white text-charcoal-700 hover:bg-ceramic-100"
                  }`}
                >
                  Mixed Cuts
                </button>
                <button
                  type="button"
                  onClick={() => setCondition("broken_mosaic")}
                  className={`px-3 py-2 text-xs font-medium rounded-editorial border text-center transition-colors ${
                    condition === "broken_mosaic"
                      ? "border-terracotta-500 bg-terracotta-50 text-terracotta-800 font-semibold"
                      : "border-ceramic-300 bg-white text-charcoal-700 hover:bg-ceramic-100"
                  }`}
                >
                  Broken / Shards
                </button>
              </div>
              <p className="text-[11px] text-charcoal-500 mt-1.5">
                {condition === "intact" && "Standard 10% kerf allowance applied for straight saw cuts."}
                {condition === "mixed" && "15% allowance applied for irregular offcut trimming."}
                {condition === "broken_mosaic" && "25% mosaic fracture waste allowance applied."}
              </p>
            </div>

            {/* Material */}
            <div>
              <label htmlFor="wizard-material-select" className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-2">
                Mineral Material Composition
              </label>
              <select
                id="wizard-material-select"
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value as TileMaterialType)}
                className="w-full rounded-editorial border border-ceramic-300 bg-white px-3 py-2 text-sm text-charcoal-900 focus:border-terracotta-500 focus:outline-none"
              >
                <option value="ceramic">Glazed Ceramic (Wall / Interior Counter)</option>
                <option value="porcelain">Vitrified Porcelain (Frost & Moisture Proof)</option>
                <option value="terracotta">Earthenware Terracotta (Porous / Rustic)</option>
                <option value="marble_natural_stone">Marble & Natural Stone (Travertine/Slate)</option>
                <option value="glass">Vitreous Glass Mosaic</option>
              </select>
              <p className="text-[11px] text-charcoal-500 mt-1.5">
                Outdoor stepping stones and planters require impervious porcelain to survive freeze-thaw cycles.
              </p>
            </div>
          </div>

          {/* Area Summary Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-editorial border border-ceramic-300 bg-ceramic-100/70 p-3 text-xs">
            <div>
              <span className="text-charcoal-500 block">Metric Size:</span>
              <span className="font-semibold text-charcoal-900">
                {matchingOutput.normalizedTile.lengthMm} × {matchingOutput.normalizedTile.widthMm} mm
              </span>
            </div>
            <div>
              <span className="text-charcoal-500 block">Gross Surface Area:</span>
              <span className="font-semibold text-charcoal-900">
                {(matchingOutput.normalizedTile.grossAreaSqMm / 92903.04).toFixed(2)} sq ft
              </span>
            </div>
            <div>
              <span className="text-charcoal-500 block">Net Usable Area:</span>
              <span className="font-semibold text-terracotta-600">
                {(matchingOutput.normalizedTile.netUsableAreaSqMm / 92903.04).toFixed(2)} sq ft
              </span>
            </div>
            <div>
              <span className="text-charcoal-500 block">Waste Allowance:</span>
              <span className="font-semibold text-charcoal-900">
                {Math.round((1 - matchingOutput.normalizedTile.wasteMultiplier) * 100)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matching Results Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ceramic-300 pb-3">
          <div>
            <h2 className="font-serif text-2xl font-bold text-charcoal-900 flex items-center gap-2">
              <span>2. Deterministic Project Matches</span>
              <Badge variant="terracotta" size="sm">
                {matchingOutput.feasibleCount} Feasible
              </Badge>
            </h2>
            <p className="text-xs text-charcoal-600 mt-0.5">
              Ranked mathematically by cutting complexity, area fit, and material durability
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-ceramic-200/70 p-1 rounded-editorial text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("feasible")}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                activeTab === "feasible"
                  ? "bg-white text-charcoal-900 shadow-subtle"
                  : "text-charcoal-600 hover:text-charcoal-900"
              }`}
            >
              Feasible ({matchingOutput.feasibleCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("infeasible")}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                activeTab === "infeasible"
                  ? "bg-white text-charcoal-900 shadow-subtle"
                  : "text-charcoal-600 hover:text-charcoal-900"
              }`}
            >
              Incompatible ({matchingOutput.infeasibleCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-white text-charcoal-900 shadow-subtle"
                  : "text-charcoal-600 hover:text-charcoal-900"
              }`}
            >
              All Plans ({matchingOutput.results.length})
            </button>
          </div>
        </div>

        {/* Results List */}
        {filteredResults.length === 0 ? (
          <div className="rounded-editorial border border-dashed border-ceramic-400 bg-white p-8 text-center space-y-2">
            <HelpCircle className="h-8 w-8 text-charcoal-400 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              No project plans match this filter
            </h3>
            <p className="text-xs text-charcoal-600 max-w-sm mx-auto">
              Try adjusting your tile quantity, switching condition, or viewing all plans.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResults.map((match) => (
              <Card
                key={match.projectId}
                className={`bg-white transition-all ${
                  match.isFeasible
                    ? match.tier === 1
                      ? "border-emerald-300 ring-1 ring-emerald-200"
                      : "border-ceramic-300"
                    : "border-ceramic-300 opacity-75 bg-ceramic-50/50"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Column: Title, Category, Explanation */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {match.isFeasible ? (
                        <>
                          {match.tier === 1 && (
                            <Badge variant="sage" size="sm">
                              TIER 1: EXACT FIT
                            </Badge>
                          )}
                          {match.tier === 2 && (
                            <Badge variant="amber" size="sm">
                              TIER 2: TRIMMING REQUIRED
                            </Badge>
                          )}
                          {match.tier === 3 && (
                            <Badge variant="terracotta" size="sm">
                              TIER 3: MOSAIC COMPATIBLE
                            </Badge>
                          )}
                        </>
                      ) : (
                        <Badge variant="outline" size="sm" className="bg-red-50 text-red-700 border-red-200">
                          {match.feasibility.replace("_", " ")}
                        </Badge>
                      )}
                      <span className="text-xs text-charcoal-500">{match.category}</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-charcoal-900">
                      {match.projectTitle}
                    </h3>

                    {/* Explanation */}
                    <p className="text-xs text-charcoal-700 leading-relaxed font-medium">
                      {match.explanation}
                    </p>

                    {/* Passing / Failing Badges */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px]">
                      {match.isFeasible ? (
                        <>
                          <span className="text-emerald-700 flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" />
                            <span>Area Coverage: {Math.round(match.coverageRatio * 100)}%</span>
                          </span>
                          {match.estimatedCutsCount > 0 && (
                            <span className="text-charcoal-600 flex items-center gap-1">
                              <Scissors className="h-3.5 w-3.5 text-charcoal-400" />
                              <span>Est. Straight Cuts: ~{match.estimatedCutsCount}</span>
                            </span>
                          )}
                        </>
                      ) : (
                        match.failingChecks.map((fail) => (
                          <span key={fail} className="text-red-600 flex items-center gap-1">
                            <XCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{fail}</span>
                          </span>
                        ))
                      )}
                    </div>

                    {/* Warnings */}
                    {match.warnings.length > 0 && (
                      <div className="pt-1">
                        {match.warnings.map((warn) => (
                          <p key={warn} className="text-[11px] text-amber-800 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-amber-600 shrink-0" />
                            <span>{warn}</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Score & Action Button */}
                  <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-ceramic-200 pt-3 md:pt-0 md:pl-6 shrink-0 gap-3">
                    <div className="text-left md:text-right">
                      <span className="text-[11px] text-charcoal-500 block">Match Score</span>
                      <span className="font-serif text-2xl font-bold text-charcoal-900">
                        {match.score}
                        <span className="text-xs text-charcoal-400 font-sans font-normal">/100</span>
                      </span>
                    </div>

                    <Button
                      href={`/projects/${match.projectSlug}`}
                      variant={match.isFeasible ? "primary" : "outline"}
                      size="sm"
                    >
                      <span>Preview Plan ($4.99)</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
