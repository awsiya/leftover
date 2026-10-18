export type ArticleCategory =
  | "Safety & Tools"
  | "Material Science"
  | "Mosaic Techniques"
  | "Bonding & Adhesives"
  | "Grouting & Finishing"
  | "Sealing & Care"
  | "Power Tools & Blades"
  | "Outdoor Engineering"
  | "Structural Substrates"
  | "Precision Drilling"
  | "Restoration & Salvage"
  | "Thermal Engineering"
  | "Moisture Control"
  | "Math & Estimation"
  | "Design & Layout";

export interface ArticleSection {
  id: string;
  title: string;
  content: string; // Markdown / HTML paragraphs
}

export interface LocalizedSlugMap {
  en: string;
  de: string;
  fr: string;
  es: string;
}

export interface LocalizedArticleMeta {
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
}

export interface ArticleRecord {
  id: string;
  slug: string; // Primary canonical English slug
  localizedSlugs: LocalizedSlugMap;
  title: string;
  subtitle: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
  wordCount: number;
  category: ArticleCategory;
  featuredImageUrl: string;
  metaTitle: string;
  metaDescription: string;
  relatedProjectSlugs: string[];
  relatedArticleSlugs: string[];
  tableOfContents: { id: string; title: string }[];
  sections: ArticleSection[];
  translations: Record<"de" | "fr" | "es", LocalizedArticleMeta>;
}
