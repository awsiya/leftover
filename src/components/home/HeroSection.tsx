import React from "react";
import { ArrowRight, Ruler, ShieldCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ceramic-50 py-16 sm:py-24 lg:py-28 border-b border-ceramic-300">
      {/* Subtle organic background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#171513 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          {/* Editorial pill tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-ceramic-300 bg-white px-3 py-1 text-xs font-medium text-charcoal-700 shadow-subtle">
            <span className="h-2 w-2 rounded-full bg-terracotta-500" />
            <span>Sustainable Ceramic & Stone Upcycling</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl font-bold tracking-tight text-charcoal-900 sm:text-5xl lg:text-6xl leading-[1.12]">
            Turn your leftover renovation tiles into <span className="text-terracotta-600 italic">functional works of art</span>.
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-charcoal-700 leading-relaxed sm:text-xl">
            Don’t let surplus tiles collect dust in the garage or end up in landfills. Enter your
            dimensions, condition, and count. Our deterministic engine matches your exact inventory
            to verified DIY project plans with precise cut sheets.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <Button href="/calculator" variant="primary" size="lg" className="shadow-card">
              <span>Enter Tile Inventory</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href="/projects" variant="outline" size="lg">
              <span>Browse 20 DIY Project Plans</span>
            </Button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-ceramic-300 text-xs text-charcoal-600">
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-terracotta-600 shrink-0" />
              <span>Strict mathematical cut calculation</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-terracotta-600 shrink-0" />
              <span>One-time $4.99 per verified printable plan</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-terracotta-600 shrink-0" />
              <span>Includes silica safety & adhesive specs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
