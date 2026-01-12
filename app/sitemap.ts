import type { MetadataRoute } from "next";

import { sidebarConfig } from "@/config/sidebar";

const SITE_URL = "https://websitekit.dev";

// Last modified dates for different sections
// Update these when you make significant changes to pages
const LAST_MODIFIED = {
  home: new Date("2026-01-09"),
  tools: new Date("2026-01-09"),
  faq: new Date("2026-01-09"),
  contact: new Date("2026-01-09"),
  // Tool pages - update when tools are modified
  toolDefault: new Date("2026-01-09"),
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
    },
    // Tools index
    {
      url: `${baseUrl}/tools`,
      lastModified: LAST_MODIFIED.tools,
    },
    // Content-rich SEO pages (preferred for indexing)
    ...liveTools.map(({ toolId }) => ({
      url: `${baseUrl}/tools/${toolId}/info`,
      lastModified: LAST_MODIFIED.toolDefault,
    })),
    // FAQ page
    {
      url: `${baseUrl}/faq`,
      lastModified: LAST_MODIFIED.faq,
    },
    // Contact page
    {
      url: `${baseUrl}/contact`,
      lastModified: LAST_MODIFIED.contact,
    },
  ];

  return urls;
}
