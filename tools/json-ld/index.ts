/**
 * JSON-LD Schema Tool
 *
 * Generates structured data for SEO and rich results.
 */

import { registerTool } from "@/lib/utils/tool-registry";

import { JsonLdComponent } from "./component";

registerTool({
  id: "json-ld",
  name: "JSON-LD Schema",
  description: "Generate structured data for SEO and rich results",
  category: "SEO & Discoverability",
  keywords: [
    "json-ld",
    "schema",
    "structured data",
    "organization",
    "website",
    "article",
    "faq",
    "breadcrumbs",
    "rich snippets",
    "google",
    "seo",
  ],
  acceptedContext: ["domain"],
  outputs: ["json"],
  Component: JsonLdComponent,
});
