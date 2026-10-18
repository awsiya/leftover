import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://leftovertileplanner.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/checkout/",
          "/*?*session_id=*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
