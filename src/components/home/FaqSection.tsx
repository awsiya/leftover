"use client";

import React from "react";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";

export function FaqSection() {
  const faqs = [
    {
      id: "broken-tiles",
      question: "Can I use chipped, cracked, or irregularly broken tile pieces?",
      answer:
        "Yes, absolutely. Several of our plans—such as the Mediterranean Kitchen Trivet, Mosaic Mirror Frame, and Garden Stepping Stones—are specifically engineered for fractured shards (trencadís style). When using the calculator, select 'Broken / Shards' as your condition, and the engine will apply a 25% mosaic fracture allowance to calculate usable coverage.",
    },
    {
      id: "deterministic-engine",
      question: "How does the tile matching engine work?",
      answer:
        "The engine uses deterministic geometric calculations rather than generative AI guesses. It normalizes your tile dimensions into millimeters, computes gross surface area, deducts kerf loss for saw cuts (10%) or mosaic fractures (25%), and filters projects based on tile hardness, water absorption rates, and minimum piece counts.",
    },
    {
      id: "plan-contents",
      question: "What is included in the $4.99 printable project plan?",
      answer:
        "Each downloadable plan is a high-resolution, vector-sharp PDF document that includes: (1) An exact 1:1 cutting layout diagram, (2) A complete bill of materials with adhesive type and grout volume formulas, (3) A detailed tool checklist, (4) Step-by-step assembly instructions with safety precautions, and (5) Tips for achieving smooth, professional grout lines.",
    },
    {
      id: "outdoor-safety",
      question: "Can I use standard ceramic wall tiles for outdoor garden stepping stones?",
      answer:
        "No. Standard glazed ceramic wall tiles have high water absorption (often 7% to 15%) and will absorb moisture, freeze in winter, and shatter due to ice expansion. Outdoor stepping stones and planters require porcelain tile (absorption rate < 0.5%) or quarry tile. Our planner automatically excludes outdoor projects if your tiles are standard ceramic.",
    },
    {
      id: "essential-tools",
      question: "Do I need an expensive wet tile saw to build these projects?",
      answer:
        "Not for most beginner projects. Many projects can be completed with an inexpensive manual score-and-snap cutter ($20–$35) or compound tile nippers for mosaics ($15). Only thicker porcelain and intricate diagonal cuts require a diamond wet saw or continuous-rim angle grinder wheel.",
    },
    {
      id: "silica-safety",
      question: "How do I safely cut tiles without inhaling crystalline silica dust?",
      answer:
        "Respirable crystalline silica is hazardous to the lungs. We recommend: (1) Using wet scoring or wet sponge cutting to suppress dust at the source, (2) Wearing a properly fitted NIOSH-approved N95 or P100 particulate respirator, and (3) Cutting outdoors or in a well-ventilated workshop while wearing ANSI Z87.1 eye protection.",
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-700">
            Common Questions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-charcoal-600 leading-relaxed">
            Everything you need to know about upcycling leftover tiles, safety standards, and our
            printable plans.
          </p>
        </div>

        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.id}
              id={faq.id}
              title={faq.question}
              defaultOpen={index === 0}
            >
              <p>{faq.answer}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
