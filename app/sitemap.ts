import type { MetadataRoute } from "next";

import { sidebarConfig } from "@/config/sidebar";

const SITE_URL = "https://websitekit.dev";

// Last modified dates for different sections
// Update these when you make significant changes to pages
const LAST_MODIFIED = {
  home: new Date("2026-01-15"),
  tools: new Date("2026-01-15"),
  faq: new Date("2026-01-15"),
  contact: new Date("2026-01-15"),
  // Tool pages - update when tools are modified
  toolDefault: new Date("2026-01-15"),
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const tools = sidebarConfig.categories.flatMap((c) =>
    c.items.map((it) => ({
      toolId: it.href.replace("/tools/", ""),
      locked: it.locked,
    }))
  );

  const liveTools = tools.filter((t) => !t.locked);

  const urls: MetadataRoute.Sitemap = [
    // Homepage
    {
      url: `${baseUrl}/`,
      lastModified: LAST_MODIFIED.home,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // Tools index
    {
      url: `${baseUrl}/tools`,
      lastModified: LAST_MODIFIED.tools,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Tool pages (action pages - use the tool)
    ...liveTools.map(({ toolId }) => ({
      url: `${baseUrl}/tools/${toolId}`,
      lastModified: LAST_MODIFIED.toolDefault,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // Tool info pages (educational content - learn more)
    ...liveTools.map(({ toolId }) => ({
      url: `${baseUrl}/tools/${toolId}/info`,
      lastModified: LAST_MODIFIED.toolDefault,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // FAQ page
    {
      url: `${baseUrl}/faq`,
      lastModified: LAST_MODIFIED.faq,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Contact page
    {
      url: `${baseUrl}/contact`,
      lastModified: LAST_MODIFIED.contact,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  return urls;
}
