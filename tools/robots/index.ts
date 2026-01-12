/**
 * robots.txt Tool
 *
 * Generates a production-ready robots.txt file (Allow/Disallow + Sitemap).
 */

import { registerTool } from "@/lib/utils/tool-registry";

import { RobotsComponent } from "./component";

registerTool({
  id: "robots",
  name: "robots.txt",
  description: "Generate crawler rules for search engines and AI bots",
  category: "SEO & Discoverability",
  keywords: [
    "robots",
    "robots.txt",
    "crawler",
    "bot",
    "spider",
    "google",
    "bing",
    "search engine",
    "crawl",
    "index",
    "disallow",
    "allow",
    "sitemap",
    "user agent",
  ],
  acceptedContext: ["domain"],
  outputs: ["files"],
  Component: RobotsComponent,
});
