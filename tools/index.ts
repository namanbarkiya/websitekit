/**
 * Tools Initialization
 *
 * This file imports all tool definitions to trigger their registration.
 * Tools are automatically registered when their index.ts files are imported.
 */

// Import all tools here - this triggers registration
import "./canonical-url";
import "./favicon";
import "./gradient";
import "./html-head";
import "./json-ld";
import "./meta-tags";
import "./preload";
import "./qr-code";
import "./robots";
import "./security-headers";
import "./sitemap";

// Re-export SEO helpers and types from the central seo module
export {
  getToolSeo,
  toolSeoMap,
  toolMetaTitle,
  toolMetaDescription,
  toolTitle,
  toolDescription,
  toolInfoMetaTitle,
  toolInfoMetaDescription,
  toolKeywords,
  getRelatedTools,
  type ToolSeo,
  type ToolMeta,
} from "./seo";

// Re-export content types
export { type ToolSeo as ToolContent, defaultToolSeo } from "./content-types";
