import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/donate/success"],
      },
    ],
    sitemap: `${site.url.replace(/\/$/, "")}/sitemap.xml`,
  };
}
