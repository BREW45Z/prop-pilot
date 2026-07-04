import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://apropilot.com/sitemap.xml",
    host: "https://apropilot.com",
  };
}
