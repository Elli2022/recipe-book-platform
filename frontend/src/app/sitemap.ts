import type { MetadataRoute } from "next";

const siteUrl = "https://recipe-book-platform.netlify.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: siteUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/recept`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/sparade`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/about`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/login`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
