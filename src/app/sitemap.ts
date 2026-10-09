import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/profile";
import { getSortedWorks } from "@/lib/getWorks";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // 作品の詳細ページ（microCMS の作品から自動で追加される）
    ...(await getSortedWorks()).map((w) => ({
      url: `${siteUrl}/work/${w.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
