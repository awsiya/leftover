"use client";

import React from "react";
import Link from "next/link";
import { SlidersHorizontal, Calculator, FileCheck, CheckCircle2, ArrowRight } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      badge: "Inventory Audit",
      icon: SlidersHorizontal,
      title: "Input Inventory & Condition",
      description:
        "Enter your leftover tile dimensions, total piece count, and physical state (intact, cut scraps, or shattered mosaic fragments).",
      formula: "Usable Area = (L × W × Q) × (1 - WasteFactor)",
      features: [
        "Supports inches, cm, and mm",
        "Evaluates ceramic, porcelain, and natural stone",
        "Accounts for fractured shard geometry",
      ],
    },
    {
      step: "02",
      badge: "Algorithmic Match",
      icon: Calculator,
      title: "Deterministic Match Calculation",
      description:
        "Our engine applies strict geometric formulas to calculate net usable surface area, kerf loss from saw cuts, and substrate structural loads.",
      formula: "Kerf Deduction = 2.5mm per straight cut line",
      features: [
        "Zero AI hallucinations or guesses",
        "Automated 10–25% waste deduction",
        "Filter by indoor or outdoor frost safety",
      ],
    },
    {
      step: "03",
      badge: "Printable Blueprint",
      icon: FileCheck,
      title: "Download Architectural Plan ($4.99)",
      description:
        "Unlock the complete printable 3-page PDF guide containing full 1:1 cut templates, adhesive formulas, grout color pairings, and step-by-step instructions.",
      formula: "Output: 3-Page Vector PDF (US Letter & A4)",
      features: [
        "Vector-sharp printable cut sheets",
        "Respirator and silica safety steps",
        "Lifetime PDF download entitlement",
      ],
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-ceramic-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-700 bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-200">
            Engineered DIY Process
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900 tracking-tight">
            How the Matching Engine Works
          </h2>
          <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed max-w-2xl mx-auto">
            Eliminate project guesswork. We connect real-world leftover tile inventory with verified DIY
            engineering to ensure your pieces fit perfectly the first time.
          </p>
        </div>

        {/* 3 Steps Grid with Connecting Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl border-2 border-ceramic-300 bg-ceramic-50/70 p-6 sm:p-8 flex flex-col justify-between hover:border-terracotta-400 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-card group"
              >
                <div>
                  {/* Step Badge & Number */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta-600 text-white shadow-subtle group-hover:scale-105 transition-transform">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="font-serif text-3xl font-black text-ceramic-300 group-hover:text-terracotta-400 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta-800 bg-terracotta-100/70 px-2 py-0.5 rounded border border-terracotta-200 inline-block mb-2">
                    {item.badge}
                  </span>

                  <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Formula / Technical Specification Box */}
                  <div className="p-2.5 rounded-lg bg-white border border-ceramic-200 text-[11px] font-mono text-charcoal-700 mb-5 font-semibold">
                    {item.formula}
                  </div>
                </div>

                {/* Features Checklist */}
                <ul className="space-y-2 border-t border-ceramic-200 pt-4 text-xs text-charcoal-700">
                  {item.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-charcoal-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif text-xl sm:text-2xl font-bold">
              Ready to see what your surplus tiles can build?
            </h4>
            <p className="text-xs sm:text-sm text-charcoal-300">
              Enter your tile inventory in 60 seconds with zero signup required.
            </p>
          </div>
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-editorial bg-terracotta-600 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-subtle shrink-0"
          >
            <span>Launch Tile Matcher</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
