import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppLocale, isValidLocale } from "@/lib/i18n/config";
import { createLocalizedMetadata } from "@/lib/i18n/metadata";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickCalculatorTeaser } from "@/components/home/QuickCalculatorTeaser";
import { SampleProjectsSection } from "@/components/home/SampleProjectsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { EditorialFeaturesSection } from "@/components/home/EditorialFeaturesSection";
import { FaqSection } from "@/components/home/FaqSection";

interface LocalePageProps {
  params: Promise<{
    locale: string;
  }>;
}

const LOCALIZED_HOME_META: Record<AppLocale, { title: string; description: string }> = {
  en: {
    title: "Leftover Tile Project Planner — Upcycle Surplus Ceramic & Stone Tiles",
    description:
      "Match your leftover renovation tiles to curated DIY projects. Deterministic area calculations, 1:1 cutting templates, and architectural printable plans for $4.99.",
  },
  de: {
    title: "Fliesen-Projektplaner — Restfliesen & Keramik nachhaltig upcyclen",
    description:
      "Gleichen Sie Ihre Restfliesen präzise mit überprüften DIY-Bauplänen ab. Exakte Schnittberechnung, 1:1 Schablonen und druckbare Pläne für 4,99 $.",
  },
  fr: {
    title: "Planificateur de projets carrelage — Recyclez vos chutes de faïence",
    description:
      "Associez vos restes de carrelage à des projets de bricolage vérifiés. Calculs de découpe déterministes, gabarits 1:1 et plans imprimables pour 4,99 $.",
  },
  es: {
    title: "Planificador de proyectos con azulejos sobrantes — Bricolaje y reciclaje",
    description:
      "Empareje sus azulejos sobrantes con proyectos de bricolaje calculados matemáticamente. Plantillas a escala 1:1 y planos descargables por 4,99 $.",
  },
};

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    return {};
  }

  const meta = LOCALIZED_HOME_META[locale];
  return createLocalizedMetadata({
    locale,
    path: "/",
    title: meta.title,
    description: meta.description,
  });
}

export default async function LocalizedHomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Leftover Tile Project Planner",
    inLanguage: locale,
    description: LOCALIZED_HOME_META[locale].description,
    applicationCategory: "DesignApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "4.99",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    publisher: {
      "@type": "Organization",
      name: "Leftover Tile Project Planner",
      url: "https://leftovertileplanner.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <QuickCalculatorTeaser />
      <SampleProjectsSection />
      <HowItWorksSection />
      <EditorialFeaturesSection />
      <FaqSection />
    </>
  );
}
