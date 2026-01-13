/**
 * sitemap.xml Tool
 *
 * Generates sitemap.xml (and optionally sitemap.html) from a list of URLs.
 */

import { registerTool } from "@/lib/utils/tool-registry";

import { SitemapComponent } from "./component";

registerTool({
  id: "sitemap",
  name: "Sitemap",
  description: "Create XML sitemaps from a list of URLs and paths",
  category: "SEO & Discoverability",
  keywords: [
    "sitemap",
    "xml",
    "sitemap.xml",
    "urls",
    "pages",
    "index",
    "search engine",
    "seo",
    "priority",
    "changefreq",
    "lastmod",
    "crawl",
  ],
  acceptedContext: ["domain"],
  outputs: ["files"],
  Component: SitemapComponent,
});
