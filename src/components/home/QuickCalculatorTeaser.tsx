"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, Layers, CheckCircle2, Minus, Plus, Sparkles } from "lucide-react";
import { TileUnit, TileCondition } from "@/lib/types/tile";

interface SizePreset {
  label: string;
  unit: TileUnit;
  l: number;
  w: number;
  q: number;
  condition: TileCondition;
}

const POPULAR_PRESETS: SizePreset[] = [
  { label: 'Subway (3"×6")', unit: "inches", l: 3, w: 6, q: 12, condition: "intact" },
  { label: 'Square Wall (4"×4")', unit: "inches", l: 4, w: 4, q: 8, condition: "intact" },
  { label: 'Floor Paver (12"×12")', unit: "inches", l: 12, w: 12, q: 3, condition: "intact" },
  { label: "Broken Ceramic Shards", unit: "inches", l: 2, w: 2, q: 24, condition: "broken_mosaic" },
];

export function QuickCalculatorTeaser() {
  const [unit, setUnit] = useState<TileUnit>("inches");
  const [length, setLength] = useState<number>(6);
  const [width, setWidth] = useState<number>(6);
  const [quantity, setQuantity] = useState<number>(8);
  const [condition, setCondition] = useState<TileCondition>("intact");

  // Apply quick preset
  const applyPreset = (preset: SizePreset) => {
    setUnit(preset.unit);
    setLength(preset.l);
    setWidth(preset.w);
    setQuantity(preset.q);
    setCondition(preset.condition);
  };

  // Deterministic live calculation
  const stats = useMemo(() => {
    const l = Math.max(0.5, length || 0);
    const w = Math.max(0.5, width || 0);
    const q = Math.max(1, quantity || 0);

    let grossSqFt = 0;
    if (unit === "inches") {
      grossSqFt = (l * w * q) / 144;
    } else if (unit === "cm") {
      grossSqFt = (l * w * q) / 929.03;
    } else {
      grossSqFt = (l * w * q) / 92903.04;
    }

    const wasteMultiplier = condition === "broken_mosaic" ? 0.75 : condition === "mixed" ? 0.85 : 0.90;
    const netSqFt = grossSqFt * wasteMultiplier;

    let tierLabel = "Compact Tier (Coasters & Trivets)";
    let tierColor = "text-amber-700 bg-amber-50 border-amber-200";
    let progressPercent = 33;
    let suggestedProject = "Artisan Coaster Set or Heatproof Table Trivet";

    if (netSqFt >= 4.0) {
      tierLabel = "Architectural Tier (Bistro Table / Stepping Stones)";
      tierColor = "text-terracotta-800 bg-terracotta-50 border-terracotta-200";
      progressPercent = 100;
      suggestedProject = "Bistro Table Refresh or Garden Stepping Stones";
    } else if (netSqFt >= 2.0) {
      tierLabel = "Standard Tier (Serving Trays & Plant Stands)";
      tierColor = "text-emerald-800 bg-emerald-50 border-emerald-200";
      progressPercent = 66;
      suggestedProject = "Herringbone Plant Pedestal or Ceramic Serving Tray";
    }

    return {
      grossSqFt: grossSqFt.toFixed(2),
      netSqFt: netSqFt.toFixed(2),
      tierLabel,
      tierColor,
      progressPercent,
      suggestedProject,
      unitLabel: unit === "inches" ? "in" : unit,
    };
  }, [length, width, quantity, unit, condition]);

  return (
    <section className="bg-white py-12 sm:py-20 border-b border-ceramic-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border-2 border-ceramic-300 bg-ceramic-50/90 p-5 sm:p-8 lg:p-10 shadow-card">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-ceramic-200 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-terracotta-700 mb-1">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-terracotta-100">
                  <Calculator className="h-3.5 w-3.5 text-terracotta-700" />
                </span>
                <span>Interactive Studio Calculator</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 tracking-tight">
                What can you build with your available tiles?
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-mono text-charcoal-500 bg-white px-3 py-1.5 rounded-full border border-ceramic-200">
                Deterministic Kerf Deduction Enabled
              </span>
            </div>
          </div>

          {/* Quick-Pick Popular Size Presets */}
          <div className="py-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block mb-2">
              Quick Pick Common Leftover Sizes:
            </span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-white hover:bg-ceramic-100 text-charcoal-800 border border-ceramic-300 transition-colors shadow-2xs active:scale-95"
                >
                  <Sparkles className="h-3 w-3 text-terracotta-600" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid: Inputs vs Real-Time Usability Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start pt-2">
            
            {/* Left Column: Interactive Inputs with Mobile Steppers */}
            <div className="lg:col-span-7 space-y-4 bg-white p-5 rounded-xl border border-ceramic-300 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Units */}
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="unit-select" className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-1">
                    Units
                  </label>
                  <select
                    id="unit-select"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as TileUnit)}
                    className="w-full h-11 rounded-editorial border border-ceramic-300 bg-ceramic-50 px-3 text-sm font-semibold text-charcoal-900 focus:border-terracotta-500 focus:outline-none"
                  >
                    <option value="inches">Inches (in)</option>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="mm">Millimeters (mm)</option>
                  </select>
                </div>

                {/* Length Stepper */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-1">
                    Length ({stats.unitLabel})
                  </label>
                  <div className="flex items-center h-11 border border-ceramic-300 rounded-editorial overflow-hidden bg-white">
                    <button
                      type="button"
                      aria-label="Decrease length"
                      onClick={() => setLength((v) => Math.max(0.5, Number((v - (unit === "mm" ? 10 : 1)).toFixed(1))))}
                      className="w-8 h-full flex items-center justify-center hover:bg-ceramic-100 text-charcoal-600 active:bg-ceramic-200"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <input
                      type="number"
                      step={unit === "mm" ? "5" : "0.5"}
                      value={length}
                      onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                      className="w-full text-center text-sm font-bold text-charcoal-900 border-none outline-none focus:ring-0 p-0"
                    />
                    <button
                      type="button"
                      aria-label="Increase length"
                      onClick={() => setLength((v) => Number((v + (unit === "mm" ? 10 : 1)).toFixed(1)))}
                      className="w-8 h-full flex items-center justify-center hover:bg-ceramic-100 text-charcoal-600 active:bg-ceramic-200"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Width Stepper */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-1">
                    Width ({stats.unitLabel})
                  </label>
                  <div className="flex items-center h-11 border border-ceramic-300 rounded-editorial overflow-hidden bg-white">
                    <button
                      type="button"
                      aria-label="Decrease width"
                      onClick={() => setWidth((v) => Math.max(0.5, Number((v - (unit === "mm" ? 10 : 1)).toFixed(1))))}
                      className="w-8 h-full flex items-center justify-center hover:bg-ceramic-100 text-charcoal-600 active:bg-ceramic-200"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <input
                      type="number"
                      step={unit === "mm" ? "5" : "0.5"}
                      value={width}
                      onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                      className="w-full text-center text-sm font-bold text-charcoal-900 border-none outline-none focus:ring-0 p-0"
                    />
                    <button
                      type="button"
                      aria-label="Increase width"
                      onClick={() => setWidth((v) => Number((v + (unit === "mm" ? 10 : 1)).toFixed(1)))}
                      className="w-8 h-full flex items-center justify-center hover:bg-ceramic-100 text-charcoal-600 active:bg-ceramic-200"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-1">
                    Piece Count
                  </label>
                  <div className="flex items-center h-11 border border-ceramic-300 rounded-editorial overflow-hidden bg-white">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity((v) => Math.max(1, v - 1))}
                      className="w-8 h-full flex items-center justify-center hover:bg-ceramic-100 text-charcoal-600 active:bg-ceramic-200"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                      className="w-full text-center text-sm font-bold text-charcoal-900 border-none outline-none focus:ring-0 p-0"
                    />
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity((v) => v + 1)}
                      className="w-8 h-full flex items-center justify-center hover:bg-ceramic-100 text-charcoal-600 active:bg-ceramic-200"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Physical Condition Selector (Touch Optimized) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-2">
                  Physical Condition of Leftover Tiles:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "intact", label: "100% Intact", sub: "Standard 10% kerf" },
                    { id: "mixed", label: "Mixed Scraps", sub: "15% cut loss" },
                    { id: "broken_mosaic", label: "Broken / Shards", sub: "25% mosaic fracture" },
                  ].map((c) => {
                    const isSelected = condition === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCondition(c.id as TileCondition)}
                        className={`py-2.5 px-2 rounded-lg border text-center transition-all ${
                          isSelected
                            ? "bg-terracotta-50 border-terracotta-600 text-terracotta-900 ring-2 ring-terracotta-500/20 font-bold"
                            : "bg-ceramic-50 border-ceramic-200 text-charcoal-700 hover:bg-ceramic-100 font-medium"
                        }`}
                      >
                        <div className="text-xs">{c.label}</div>
                        <div className="text-[10px] text-charcoal-500">{c.sub}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Calculated Usability Gauge & Direct Action */}
            <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-xl border border-ceramic-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-terracotta-600" />
                  <span>Calculated Net Usability</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Exact Math
                </span>
              </div>

              {/* Coverage Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-ceramic-100 rounded-lg border border-ceramic-200">
                  <div className="text-[11px] text-charcoal-500 font-medium">Gross Tile Surface</div>
                  <div className="font-serif text-2xl font-bold text-charcoal-900 mt-0.5">
                    {stats.grossSqFt} <span className="text-xs font-sans text-charcoal-600">sq ft</span>
                  </div>
                </div>

                <div className="p-3 bg-terracotta-50/70 rounded-lg border border-terracotta-200">
                  <div className="text-[11px] text-terracotta-800 font-semibold">Net Usable Area</div>
                  <div className="font-serif text-2xl font-bold text-terracotta-700 mt-0.5">
                    {stats.netSqFt} <span className="text-xs font-sans text-terracotta-800">sq ft</span>
                  </div>
                </div>
              </div>

              {/* Progress Level Gauge */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-charcoal-700">Project Capability Tier:</span>
                  <span className="font-mono font-bold text-charcoal-900">{stats.netSqFt} sq ft</span>
                </div>
                <div className="w-full bg-ceramic-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-terracotta-500 via-terracotta-600 to-amber-600 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${stats.progressPercent}%` }}
                  />
                </div>
                <div className={`text-xs px-2.5 py-1 rounded-md border font-medium ${stats.tierColor}`}>
                  {stats.tierLabel}
                </div>
              </div>

              {/* Recommended Project Callout */}
              <div className="p-3 bg-ceramic-50 rounded-lg border border-ceramic-200 text-xs space-y-1">
                <div className="text-charcoal-500 font-medium">Immediate Recommended Match:</div>
                <div className="font-bold text-charcoal-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{stats.suggestedProject}</span>
                </div>
              </div>

              {/* Direct Full Engine CTA */}
              <div className="pt-1">
                <Link
                  href="/calculator"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-editorial bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold text-sm transition-all shadow-subtle hover:shadow-card"
                >
                  <span>Open Full 20-Project Matching Engine</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
