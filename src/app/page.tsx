import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickCalculatorTeaser } from "@/components/home/QuickCalculatorTeaser";
import { SampleProjectsSection } from "@/components/home/SampleProjectsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { EditorialFeaturesSection } from "@/components/home/EditorialFeaturesSection";
import { FaqSection } from "@/components/home/FaqSection";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Leftover Tile Project Planner",
    "description":
      "Deterministic DIY tile matching engine and printable project plan store for repurposing surplus ceramic and stone tiles.",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "4.99",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Leftover Tile Project Planner",
      "url": "https://leftovertileplanner.com",
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
