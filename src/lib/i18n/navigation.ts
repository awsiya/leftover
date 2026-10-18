import { AppLocale } from "./config";

export interface NavTranslations {
  calculator: string;
  projects: string;
  articles: string;
  admin: string;
  matchTilesCta: string;
  brandTagline: string;
  footerRights: string;
  footerTagline: string;
  disclosureTitle: string;
}

export const NAV_TRANSLATIONS: Record<AppLocale, NavTranslations> = {
  en: {
    calculator: "Tile Calculator",
    projects: "Project Catalogue",
    articles: "DIY Guides",
    admin: "Admin Portal",
    matchTilesCta: "Match My Tiles",
    brandTagline: "Architectural DIY Project Planner for Leftover Renovation Tiles",
    footerRights: "All rights reserved. Professional DIY plans for upcycling surplus tiles.",
    footerTagline: "Transforming leftover construction tiles into functional architectural home decor.",
    disclosureTitle: "Editorial Notice",
  },
  de: {
    calculator: "Fliesen-Rechner",
    projects: "Projektkatalog",
    articles: "DIY-Ratgeber",
    admin: "Admin-Portal",
    matchTilesCta: "Fliesen abgleichen",
    brandTagline: "Architektonischer DIY-Projektplaner für übriggebliebene Fliesen",
    footerRights: "Alle Rechte vorbehalten. Professionelle DIY-Pläne zur Fliesen-Wiederverwendung.",
    footerTagline: "Verwandeln Sie Renovierungsreste in funktionale, architektonische Wohnaccessoires.",
    disclosureTitle: "Redaktioneller Transparenzhinweis",
  },
  fr: {
    calculator: "Calculateur de carrelage",
    projects: "Catalogue de projets",
    articles: "Guides bricolage",
    admin: "Portail admin",
    matchTilesCta: "Trouver mon projet",
    brandTagline: "Planificateur de projets DIY pour surplus de carrelage et faïence",
    footerRights: "Tous droits réservés. Plans de bricolage professionnels pour recycler les carreaux.",
    footerTagline: "Transformez vos chutes de carrelage en objets de décoration utiles et durables.",
    disclosureTitle: "Avis éditorial de transparence",
  },
  es: {
    calculator: "Calculadora de azulejos",
    projects: "Catálogo de proyectos",
    articles: "Guías de bricolaje",
    admin: "Portal admin",
    matchTilesCta: "Buscar proyectos",
    brandTagline: "Planificador de proyectos DIY para azulejos sobrantes de reformas",
    footerRights: "Todos los derechos reservados. Planos profesionales de bricolaje para reutilizar azulejos.",
    footerTagline: "Transformando restos de cerámica en decoración arquitectónica funcional.",
    disclosureTitle: "Aviso editorial de transparencia",
  },
};

export function getNavTranslations(locale: AppLocale): NavTranslations {
  return NAV_TRANSLATIONS[locale] || NAV_TRANSLATIONS.en;
}
