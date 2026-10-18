"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Ruler, ShieldCheck, Sparkles, Compass, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TilePreset {
  id: string;
  name: string;
  dimensions: string;
  matchedProject: string;
  matchScore: number;
  usableArea: string;
  condition: string;
}

const HERO_PRESETS: TilePreset[] = [
  {
    id: "subway",
    name: '3"×6" Subway Tiles',
    dimensions: '3" × 6" (76 × 152mm)',
    matchedProject: "Herringbone Plant Pedestal",
    matchScore: 98,
    usableArea: "2.25 sq ft",
    condition: "Intact",
  },
  {
    id: "shards",
    name: "Broken Ceramic Shards",
    dimensions: "Random 1–3\" Shards",
    matchedProject: "Mediterranean Mosaic Trivet",
    matchScore: 95,
    usableArea: "1.80 sq ft",
    condition: "Mosaic Shards",
  },
  {
    id: "square",
    name: '4"×4" Bathroom Wall',
    dimensions: '4" × 4" (100 × 100mm)',
    matchedProject: "Artisan Checkerboard Coasters",
    matchScore: 100,
    usableArea: "1.33 sq ft",
    condition: "Intact",
  },
];

export function HeroSection() {
  const [activePreset, setActivePreset] = useState<TilePreset>(HERO_PRESETS[0]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ceramic-100/90 via-ceramic-50 to-white pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 border-b border-ceramic-300">
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #171513 1px, transparent 1px),
            linear-gradient(to bottom, #171513 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* Warm Ambient Terracotta Glow */}
      <div
        className="absolute top-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-terracotta-400/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 left-10 -z-10 h-72 w-72 rounded-full bg-sand-400/20 blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline, Authority & Action */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
            {/* Trust Pill Ticker */}
            <div className="inline-flex items-center gap-2 rounded-full border border-ceramic-300 bg-white/95 px-3.5 py-1.5 text-xs font-medium text-charcoal-800 shadow-subtle backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-terracotta-500 animate-pulse" />
              <span className="font-semibold text-terracotta-700">Studio Grade DIY Engineering</span>
              <span className="text-ceramic-400">&bull;</span>
              <span className="text-charcoal-600">Zero Tile Waste</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal-900 leading-[1.12]">
              Turn your leftover renovation tiles into{" "}
              <span className="bg-gradient-to-r from-terracotta-700 via-terracotta-600 to-amber-700 bg-clip-text text-transparent italic">
                functional works of art
              </span>.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-charcoal-700 leading-relaxed max-w-2xl font-sans">
              Don’t let surplus ceramic, terracotta, or marble tiles collect dust in the garage or end up in landfills.
              Enter your inventory dimensions, condition, and piece count—our deterministic matching algorithm outputs
              mathematically verified project blueprints with precise 1:1 cutting templates.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Button href="/calculator" variant="primary" size="lg" className="shadow-card justify-center py-4 px-7 text-sm font-semibold">
                <span>Match Your Leftover Tiles</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button href="/projects" variant="outline" size="lg" className="bg-white/90 justify-center py-4 px-6 text-sm font-semibold">
                <Compass className="h-4 w-4 mr-2 text-terracotta-600" />
                <span>Explore 20 Project Blueprints</span>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-ceramic-300/80 text-xs text-charcoal-700">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-terracotta-600 shrink-0" />
                <span className="font-medium">Kerf-compensated cut math</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-medium">TCNA silica & mortar specs</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
                <span className="font-medium">One-time $4.99 per plan</span>
              </div>
            </div>
          </div>

          {/* Right Column: Studio-Grade Live Interactive Blueprint Showcase */}
          <div className="lg:col-span-5 w-full">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl border-2 border-ceramic-300 bg-white p-5 sm:p-6 shadow-card hover:shadow-subtle transition-all duration-300">
              
              {/* Studio Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-ceramic-200">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-800">
                    Live Blueprint Studio
                  </span>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-ceramic-100 text-charcoal-600 border border-ceramic-200">
                  TCNA-Verified
                </span>
              </div>

              {/* Preset Selector Chips */}
              <div className="py-3">
                <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block mb-2">
                  Select Sample Inventory:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {HERO_PRESETS.map((p) => {
                    const isSelected = p.id === activePreset.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setActivePreset(p)}
                        className={`py-2 px-2 text-[11px] font-semibold rounded-lg border text-center transition-all ${
                          isSelected
                            ? "bg-terracotta-600 text-white border-terracotta-600 shadow-sm"
                            : "bg-ceramic-50 text-charcoal-700 border-ceramic-200 hover:bg-ceramic-100"
                        }`}
                      >
                        {p.name.split(" ")[0]} {p.name.split(" ")[1] || ""}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Visual Blueprint Diagram Area */}
              <div className="relative rounded-xl border border-ceramic-300 bg-gradient-to-br from-ceramic-100 via-sand-50 to-ceramic-100 p-4 sm:p-5 my-2">
                {/* Blueprint Grid Watermark */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #b85d38 1px, transparent 1px),
                      linear-gradient(to bottom, #b85d38 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 20px",
                  }}
                  aria-hidden="true"
                />

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-charcoal-600 font-medium">Input: {activePreset.dimensions}</span>
                    <span className="font-mono font-bold text-terracotta-700 bg-white/90 px-2 py-0.5 rounded border border-ceramic-300">
                      {activePreset.condition}
                    </span>
                  </div>

                  {/* Visual Tile Cross-Section / Layout Graphic */}
                  <div className="h-28 w-full rounded-lg bg-white/90 border border-ceramic-300/80 p-2.5 flex items-center justify-center relative overflow-hidden shadow-inner">
                    {activePreset.id === "subway" && (
                      <div className="grid grid-cols-3 gap-1 w-full h-full p-1">
                        <div className="bg-terracotta-600/85 rounded-sm flex items-center justify-center text-[9px] font-mono text-white font-bold">1:1 Cut</div>
                        <div className="bg-terracotta-500/80 rounded-sm flex items-center justify-center text-[9px] font-mono text-white font-bold">Herringbone</div>
                        <div className="bg-terracotta-600/85 rounded-sm flex items-center justify-center text-[9px] font-mono text-white font-bold">1:1 Cut</div>
                        <div className="bg-terracotta-700/85 rounded-sm flex items-center justify-center text-[9px] font-mono text-white font-bold">Pattern</div>
                        <div className="bg-terracotta-600/85 rounded-sm flex items-center justify-center text-[9px] font-mono text-white font-bold">2.5mm Kerf</div>
                        <div className="bg-terracotta-700/85 rounded-sm flex items-center justify-center text-[9px] font-mono text-white font-bold">Mortar</div>
                      </div>
                    )}
                    {activePreset.id === "shards" && (
                      <div className="flex flex-wrap gap-1 w-full h-full p-1 items-center justify-center">
                        <div className="h-9 w-12 bg-amber-600/85 rounded-tl-xl text-[8px] font-mono text-white flex items-center justify-center font-bold">Shard A</div>
                        <div className="h-10 w-10 bg-terracotta-600/85 rounded-br-2xl text-[8px] font-mono text-white flex items-center justify-center font-bold">Shard B</div>
                        <div className="h-8 w-14 bg-amber-700/85 rounded-tr-xl text-[8px] font-mono text-white flex items-center justify-center font-bold">Shard C</div>
                        <div className="h-10 w-11 bg-terracotta-700/85 rounded-bl-xl text-[8px] font-mono text-white flex items-center justify-center font-bold">Mosaic</div>
                        <div className="h-7 w-12 bg-amber-800/85 rounded-md text-[8px] font-mono text-white flex items-center justify-center font-bold">Cork Base</div>
                      </div>
                    )}
                    {activePreset.id === "square" && (
                      <div className="grid grid-cols-2 gap-1.5 h-full aspect-square p-1 mx-auto">
                        <div className="bg-charcoal-800 rounded-sm flex items-center justify-center text-[9px] font-mono text-white font-bold">4&quot; Square</div>
                        <div className="bg-terracotta-600 rounded-sm flex items-center justify-center text-[9px] font-mono text-white font-bold">4&quot; Square</div>
                        <div className="bg-terracotta-600 rounded-sm flex items-center justify-center text-[9px] font-mono text-white font-bold">4&quot; Square</div>
                        <div className="bg-charcoal-800 rounded-sm flex items-center justify-center text-[9px] font-mono text-white font-bold">4&quot; Square</div>
                      </div>
                    )}
                  </div>

                  {/* Matched Plan Info Pill */}
                  <div className="bg-white rounded-lg p-3 border border-ceramic-200 shadow-sm space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-charcoal-500">Top Feasible Match:</span>
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{activePreset.matchScore}% Match Fit</span>
                      </span>
                    </div>
                    <div className="font-serif font-bold text-sm text-charcoal-900 line-clamp-1">
                      {activePreset.matchedProject}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-charcoal-600 pt-1 border-t border-ceramic-100">
                      <span>Usable: <strong>{activePreset.usableArea}</strong></span>
                      <span>Cut Waste Factor: <strong>10–15%</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="pt-2">
                <Link
                  href="/calculator"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-editorial bg-charcoal-900 hover:bg-black text-white text-xs font-bold transition-colors shadow-subtle group"
                >
                  <span>Test Your Leftover Inventory in Full Engine</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 text-terracotta-400" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
