import type { MetadataRoute } from "next";
import { services } from "./_data/content";
import { cities, departments, isIndexableCity, regions } from "./_data/local/geo";
import { guides } from "./guides/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.mabenneenligne.fr";
  const updated = new Date("2026-07-21T00:00:00.000Z");
  const staticRoutes = ["", "/devis", "/comment-ca-marche", "/tarifs", "/nos-services", "/departements", "/regions", "/a-propos", "/notre-reseau", "/devenir-partenaire", "/pro", "/guides", "/avis-clients", "/contact", "/faq", "/mentions-legales", "/cgu", "/politique-confidentialite"];

  return [
    ...staticRoutes.map((url) => ({ url: `${base}${url}`, lastModified: updated, changeFrequency: url === "" ? "weekly" as const : "monthly" as const, priority: url === "" ? 1 : 0.7 })),
    ...regions.map((region) => ({ url: `${base}/regions/${region.slug}`, lastModified: updated, changeFrequency: "monthly" as const, priority: 0.78 })),
    ...departments.map((department) => ({ url: `${base}/departements/${department.slug}`, lastModified: updated, changeFrequency: "monthly" as const, priority: 0.82 })),
    ...cities.filter(isIndexableCity).map((city) => ({ url: `${base}/location-benne/${city.slug}`, lastModified: updated, changeFrequency: "monthly" as const, priority: (city.population ?? 0) >= 10000 ? 0.72 : 0.58 })),
    ...Object.keys(services).map((slug) => ({ url: `${base}/nos-services/${slug}`, lastModified: updated, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...guides.map((guide) => ({ url: `${base}/guides/${guide.slug}`, lastModified: updated, changeFrequency: "monthly" as const, priority: 0.68 })),
  ];
}
