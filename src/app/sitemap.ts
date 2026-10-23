import type { MetadataRoute } from "next";
import { getPublicProjects, getPublicWorks } from "@/lib/queries";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [projects, works] = await Promise.all([getPublicProjects(), getPublicWorks()]);

  return [
    ...["", "/about", "/projects", "/works", "/commission"].map((path) => ({ url: `${base}${path}` })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: p.updated_at })),
    ...works.map((w) => ({ url: `${base}/works/${w.slug}`, lastModified: w.updated_at })),
  ];
}
