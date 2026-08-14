import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { programs } from "@/content/programs";
import { campaigns } from "@/content/campaigns";
import { newsPosts, events } from "@/content/news";

const staticRoutes = [
  "",
  "/about",
  "/programs",
  "/apply",
  "/campaigns",
  "/get-involved",
  "/get-involved/sponsor-an-athlete",
  "/get-involved/corporate-sponsorship",
  "/get-involved/volunteer",
  "/donate",
  "/impact",
  "/transparency",
  "/transparency/meeting-minutes",
  "/news",
  "/events",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
  "/donation-policy",
  "/refund-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");

  const staticEntries = staticRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));

  const programEntries = programs.map((p) => ({
    url: `${base}/programs/${p.slug}`,
    lastModified: new Date(),
  }));

  const campaignEntries = campaigns.map((c) => ({
    url: `${base}/campaigns/${c.slug}`,
    lastModified: new Date(),
  }));

  const newsEntries = newsPosts.map((p) => ({
    url: `${base}/news/${p.slug}`,
    lastModified: new Date(p.date),
  }));

  const eventEntries = events.map((e) => ({
    url: `${base}/events/${e.slug}`,
    lastModified: new Date(e.date),
  }));

  return [...staticEntries, ...programEntries, ...campaignEntries, ...newsEntries, ...eventEntries];
}
