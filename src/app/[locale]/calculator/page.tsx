import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calculator, ShieldCheck } from "lucide-react";
import { AppLocale, isValidLocale } from "@/lib/i18n/config";
import { createLocalizedMetadata, buildLocalizedPath } from "@/lib/i18n/metadata";
import { getNavTranslations } from "@/lib/i18n/navigation";
import { TileMatchingWizard } from "@/components/calculator/TileMatchingWizard";

interface CalculatorPageProps {
  params: Promise<{
    locale: string;
  }>;
}

const CALCULATOR_META: Record<AppLocale, { title: string; description: string }> = {
  en: {
    title: "Tile Inventory Calculator — Leftover Tile Project Planner",
    description:
      "Enter your surplus tile dimensions, units, and condition to calculate net usable surface area and match with verified DIY project plans.",
  },
  de: {
    title: "Fliesen-Inventarrechner — Passende DIY-Pläne finden",
    description:
      "Geben Sie Maße, Menge und Zustand Ihrer Fliesenreste ein. Unsere mathematische Engine ermittelt kompatible DIY-Baupläne.",
  },
  fr: {
    title: "Calculateur de carrelage — Trouvez des projets DIY adaptés",
    description:
      "Renseignez les dimensions, unités et l'état de vos chutes de carrelage pour calculer la surface utile et trouver des plans de bricolage vérifiés.",
  },
  es: {
    title: "Calculadora de azulejos sobrantes — Encuentre proyectos compatibles",
    description:
      "Introduzca dimensiones, unidades y estado de sus azulejos para calcular el área útil y descubrir planos de bricolaje viables.",
  },
};

export async function generateMetadata({ params }: CalculatorPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    return {};
  }

  const meta = CALCULATOR_META[locale];
  return createLocalizedMetadata({
    locale,
    path: "/calculator",
    title: meta.title,
    description: meta.description,
  });
}

export default async function LocalizedCalculatorPage({ params }: CalculatorPageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const nav = getNavTranslations(locale);
  const homeHref = buildLocalizedPath(locale, "/");
  const projectsHref = buildLocalizedPath(locale, "/projects");

  return (
    <div className="bg-ceramic-50 min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href={homeHref}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-600 hover:text-terracotta-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>&larr; Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-terracotta-700">
            <Calculator className="h-3.5 w-3.5" />
            <span>Deterministic Matching Engine</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 tracking-tight">
            {nav.calculator}
          </h1>
          <p className="text-base text-charcoal-600 leading-relaxed max-w-2xl">
            {CALCULATOR_META[locale].description}
          </p>
        </div>

        {/* Interactive Matching Wizard */}
        <TileMatchingWizard />

        {/* Security & Math Disclaimer */}
        <div className="mt-12 rounded-editorial border border-ceramic-300 bg-white p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-serif text-base font-bold text-charcoal-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-sage-600" />
              <span>Zero Generative AI Hallucinations</span>
            </h4>
            <p className="text-xs text-charcoal-600 max-w-2xl">
              All area equations, cutting waste percentages (10% straight saw kerf, 25% mosaic fracture),
              and structural piece yields are calculated using pure geometric mathematics verified by
              TCNA industry standards.
            </p>
          </div>
          <Link
            href={projectsHref}
            className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 whitespace-nowrap"
          >
            {nav.projects} &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
