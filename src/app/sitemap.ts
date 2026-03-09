import { MetadataRoute } from "next";
import { getAllSectors } from "@/lib/sectors";

export default function sitemap(): MetadataRoute.Sitemap {
  const sectors = getAllSectors();

  const sectorPages = sectors.map((sector) => ({
    url: `https://monmarche.fr/${sector.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [
    {
      url: "https://monmarche.fr",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...sectorPages,
    {
      url: "https://monmarche.fr/mentions-legales",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: "https://monmarche.fr/cgv",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: "https://monmarche.fr/confidentialite",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
