import React from "react";
import { Flame, Recycle, Sparkles, DollarSign } from "lucide-react";

export function EditorialFeaturesSection() {
  const principles = [
    {
      icon: Flame,
      title: "Heat & Moisture Resistance",
      description:
        "Fired ceramic and porcelain tiles effortlessly withstand boiling kettles, condensation, and direct hot cookware that would scorch or warp wooden surfaces.",
    },
    {
      icon: Recycle,
      title: "Zero-Landfill Upcycling",
      description:
        "Vitrified clay tiles never decompose in landfills. Transforming construction cutoffs into heirloom tabletop pieces keeps architectural mass in active domestic use.",
    },
    {
      icon: Sparkles,
      title: "Bespoke Artisanal Character",
      description:
        "Glaze variations, crackle finishes, and natural stone striations turn simple plant pedestals and wall mirrors into gallery-grade decorative statements.",
    },
    {
      icon: DollarSign,
      title: "Luxury Finish for Pennies",
      description:
        "Convert leftover designer tiles ($15–$30/sq ft remnant value) into high-end home accessories for merely the cost of a $4.99 plan and a container of mastic.",
    },
  ];

  return (
    <section className="bg-ceramic-100/70 py-16 sm:py-20 border-b border-ceramic-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-700">
            Material Science & Craft
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 tracking-tight">
            Why Ceramic Remnants Make Ideal DIY Substrates
          </h2>
          <p className="text-base text-charcoal-600 leading-relaxed">
            Understanding the structural advantages of fired minerals over timber and resin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-editorial border border-ceramic-300 bg-white p-6 shadow-subtle hover:border-ceramic-400 transition-colors"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-editorial bg-ceramic-200 text-terracotta-700 mb-4">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-serif text-lg font-bold text-charcoal-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
