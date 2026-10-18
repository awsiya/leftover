import React from "react";
import { SlidersHorizontal, Calculator, FileCheck, CheckCircle2 } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      icon: SlidersHorizontal,
      title: "Input Inventory & Condition",
      description:
        "Enter your leftover tile dimensions, total piece count, and physical state (intact, cut scraps, or shattered mosaic fragments).",
      features: ["Supports inches, cm, and mm", "Evaluates ceramic, porcelain, and stone", "Accounts for broken tile pieces"],
    },
    {
      step: "02",
      icon: Calculator,
      title: "Deterministic Match Calculation",
      description:
        "Our engine applies strict geometric formulas to calculate net usable surface area, kerf loss from saw cuts, and substrate structural loads.",
      features: ["Zero AI hallucinations or guesses", "Automated 10–25% waste deduction", "Filter by indoor or outdoor safety"],
    },
    {
      step: "03",
      icon: FileCheck,
      title: "Download Architectural Plan ($4.99)",
      description:
        "Unlock the complete printable PDF guide containing full 1:1 cut templates, adhesive formulas, grout color pairings, and step-by-step instructions.",
      features: ["Vector-sharp printable cut sheets", "Respirator and silica safety steps", "Lifetime PDF download access"],
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-ceramic-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-700">
            Transparent Process
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 tracking-tight">
            How the Planner Works
          </h2>
          <p className="text-base text-charcoal-600 leading-relaxed">
            Eliminate project guesswork. We connect real-world tile inventory with verified DIY
            engineering to ensure your pieces fit perfectly the first time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-editorial border border-ceramic-300 bg-ceramic-50/60 p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-editorial bg-terracotta-500 text-white shadow-subtle">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-serif text-2xl font-bold text-ceramic-400">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-charcoal-600 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <ul className="space-y-2 border-t border-ceramic-200 pt-4 text-xs text-charcoal-700">
                  {item.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-sage-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
