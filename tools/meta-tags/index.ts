/**
 * Meta Tags Tool
 *
 * Generates SEO, Open Graph, and Twitter Card meta tags.
 */

import { registerTool } from "@/lib/utils/tool-registry";

import { MetaTagsComponent } from "./component";

// Tool definition
registerTool({
  id: "meta-tags",
  name: "Meta Tags",
  description: "Generate SEO, Open Graph, Twitter, and AI-friendly meta tags",
  category: "Setup & Identity",
  keywords: [
    "meta",
    "tags",
    "seo",
    "open graph",
    "og",
    "twitter card",
    "social",
    "head",
    "html",
    "title",
    "description",
    "search engine",
    "ai",
    "metadata",
  ],
  acceptedContext: ["name", "domain", "description", "logo"],
  outputs: ["html"],
  Component: MetaTagsComponent,
});
