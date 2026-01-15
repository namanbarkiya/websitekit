/**
 * Canonical URL Tool
 *
 * Generates canonical URL tags to prevent duplicate content issues.
 */

import { registerTool } from "@/lib/utils/tool-registry";

import { CanonicalUrlComponent } from "./component";

registerTool({
  id: "canonical-url",
  name: "Canonical URL",
  description: "Generate canonical URL tags to prevent duplicate content",
  category: "SEO & Discoverability",
  keywords: [
    "canonical",
    "canonical url",
    "duplicate content",
    "seo",
    "link tag",
    "rel canonical",
    "url normalization",
    "tracking parameters",
    "www",
    "trailing slash",
  ],
  acceptedContext: ["domain"],
  outputs: ["text"],
  Component: CanonicalUrlComponent,
});
