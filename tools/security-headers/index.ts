/**
 * Security Headers Tool
 *
 * Generates recommended HTTP security headers + deployment snippets.
 */

import { registerTool } from "@/lib/utils/tool-registry";

import { SecurityHeadersComponent } from "./component";

registerTool({
  id: "security-headers",
  name: "Security Headers",
  description: "Generate HSTS, X-Frame-Options, Referrer-Policy, and more",
  category: "Security",
  keywords: [
    "security",
    "headers",
    "http",
    "hsts",
    "strict-transport-security",
    "x-frame-options",
    "clickjacking",
    "x-content-type-options",
    "nosniff",
    "referrer-policy",
    "coop",
    "corp",
  ],
  acceptedContext: [],
  outputs: ["files"],
  Component: SecurityHeadersComponent,
});
