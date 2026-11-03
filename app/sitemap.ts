import type { MetadataRoute } from "next";
import { projects, siteUrl } from "@/data/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const projectPages = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/resume`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...projectPages,
  ];
}
