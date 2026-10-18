"use client";

import React, { useState, useMemo } from "react";
import { Calculator, ArrowRight, Layers, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TileUnit, TileCondition } from "@/lib/types/tile";

export function QuickCalculatorTeaser() {
  const [unit, setUnit] = useState<TileUnit>("inches");
  const [length, setLength] = useState<number>(6);
  const [width, setWidth] = useState<number>(6);
  const [quantity, setQuantity] = useState<number>(8);
  const [condition, setCondition] = useState<TileCondition>("intact");

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
      // mm
      grossSqFt = (l * w * q) / 92903.04;
    }

    const wasteMultiplier = condition === "broken_mosaic" ? 0.75 : condition === "mixed" ? 0.85 : 0.90;
    const netSqFt = grossSqFt * wasteMultiplier;

    let suggestedType = "Artisan Coaster Set or Small Trivet";
    if (netSqFt >= 4) {
      suggestedType = "Bistro Tabletop or Garden Mosaic Stepping Stones";
    } else if (netSqFt >= 2) {
      suggestedType = "Large Mosaic Serving Tray or Plant Pedestal";
    }

    return {
      grossSqFt: grossSqFt.toFixed(2),
      netSqFt: netSqFt.toFixed(2),
      suggestedType,
    };
  }, [length, width, quantity, unit, condition]);

  return (
    <section className="bg-white py-12 sm:py-16 border-b border-ceramic-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-editorial border border-ceramic-300 bg-ceramic-50/70 p-6 sm:p-8 lg:p-10 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left side: Teaser Form */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded bg-terracotta-100 text-terracotta-700">
                  <Calculator className="h-4 w-4" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                  Instant Inventory Preview
                </span>
              </div>

              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 tracking-tight">
                  What can you make with your leftover tiles?
                </h2>
                <p className="mt-1 text-sm text-charcoal-600">
                  Test your dimensions below to estimate usable surface area and immediate project suitability:
                </p>
              </div>

              {/* Input grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {/* Unit Switcher */}
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="quick-unit-select" className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-1">
                    Units
                  </label>
                  <select
                    id="quick-unit-select"
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
                  <label htmlFor="quick-length-input" className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-1">
                    Length ({unit === "inches" ? "in" : unit})
                  </label>
                  <input
                    id="quick-length-input"
                    type="number"
                    min="1"
                    step="0.5"
                    value={length}
                    onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-editorial border border-ceramic-300 bg-white px-3 py-2 text-sm text-charcoal-900 focus:border-terracotta-500 focus:outline-none"
                  />
                </div>

                {/* Width */}
                <div>
                  <label htmlFor="quick-width-input" className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-1">
                    Width ({unit === "inches" ? "in" : unit})
                  </label>
                  <input
                    id="quick-width-input"
                    type="number"
                    min="1"
                    step="0.5"
                    value={width}
                    onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-editorial border border-ceramic-300 bg-white px-3 py-2 text-sm text-charcoal-900 focus:border-terracotta-500 focus:outline-none"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label htmlFor="quick-qty-input" className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-1">
                    Tile Count
                  </label>
                  <input
                    id="quick-qty-input"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-editorial border border-ceramic-300 bg-white px-3 py-2 text-sm text-charcoal-900 focus:border-terracotta-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Condition Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-1.5">
                  Condition of Leftover Tiles
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCondition("intact")}
                    className={`px-3 py-2 text-xs font-medium rounded-editorial border text-center transition-colors ${
                      condition === "intact"
                        ? "border-terracotta-500 bg-terracotta-50 text-terracotta-800"
                        : "border-ceramic-300 bg-white text-charcoal-700 hover:bg-ceramic-100"
                    }`}
                  >
                    100% Intact
                  </button>
                  <button
                    type="button"
                    onClick={() => setCondition("mixed")}
                    className={`px-3 py-2 text-xs font-medium rounded-editorial border text-center transition-colors ${
                      condition === "mixed"
                        ? "border-terracotta-500 bg-terracotta-50 text-terracotta-800"
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
                        ? "border-terracotta-500 bg-terracotta-50 text-terracotta-800"
                        : "border-ceramic-300 bg-white text-charcoal-700 hover:bg-ceramic-100"
                    }`}
                  >
                    Broken / Shards
                  </button>
                </div>
              </div>
            </div>

            {/* Right side: Instant Metric Output & CTA */}
            <div className="lg:col-span-5 bg-white rounded-editorial border border-ceramic-300 p-6 space-y-4 shadow-subtle">
              <div className="flex items-center justify-between border-b border-ceramic-200 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-600 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-terracotta-600" />
                  <span>Calculated Usability</span>
                </span>
                <Badge variant="sage" size="sm">
                  Deterministic Math
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded bg-ceramic-100 p-3">
                  <span className="block text-xs text-charcoal-500">Gross Coverage</span>
                  <span className="font-serif text-xl font-bold text-charcoal-900">
                    {stats.grossSqFt} <span className="text-xs font-sans font-normal">sq ft</span>
                  </span>
                </div>
                <div className="rounded bg-ceramic-100 p-3">
                  <span className="block text-xs text-charcoal-500">Net Usable Area</span>
                  <span className="font-serif text-xl font-bold text-terracotta-600">
                    {stats.netSqFt} <span className="text-xs font-sans font-normal">sq ft</span>
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-xs text-charcoal-500 block">Recommended Project Category:</span>
                <p className="text-sm font-semibold text-charcoal-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-sage-600 shrink-0" />
                  <span>{stats.suggestedType}</span>
                </p>
              </div>

              <p className="text-xs text-charcoal-500 leading-relaxed">
                Includes automated deduction for straight kerf saw cuts and mosaic fracture waste.
              </p>

              <Button href="/calculator" variant="primary" size="md" className="w-full justify-center">
                <span>Open Full Tile Calculator</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
