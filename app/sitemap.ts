import type { MetadataRoute } from "next";

const siteUrl = "https://apropilot.com";

const publicRoutes = [
  {
    path: "",
    changeFrequency: "monthly",
    priority: 1,
  },
  {
    path: "/prop-firm-drawdown-calculator",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/lot-size-calculator",
    changeFrequency: "monthly",
    priority: 0.8,
  },
] satisfies Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: MetadataRoute.Sitemap[number]["priority"];
}>;

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
