import React from "react";
import { notFound } from "next/navigation";
import { LOCALES, isValidLocale } from "@/lib/i18n/config";
import { EditorialDisclosureBanner } from "@/components/layout/EditorialDisclosureBanner";

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <>
      <EditorialDisclosureBanner locale={locale} />
      {children}
    </>
  );
}
