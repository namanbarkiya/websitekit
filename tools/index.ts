/**
 * Tools Initialization
 *
 * This file imports all tool definitions to trigger their registration.
 * Tools are automatically registered when their index.ts files are imported.
 */

// Import all tools here - this triggers registration
import "./meta-tags";
import "./qr-code";
import "./robots";

// Tool content for SEO/AEO pages
import { defaultToolContent, type ToolContent } from "./content-types";
import { content as metaTagsContent } from "./meta-tags/lib/content";
import { content as qrCodeContent } from "./qr-code/lib/content";
import { content as robotsContent } from "./robots/lib/content";

export type { ToolContent };

const toolContentMap: Record<string, ToolContent> = {
  "meta-tags": metaTagsContent,
  "qr-code": qrCodeContent,
  robots: robotsContent,
};

export function getToolContent(toolId: string): ToolContent {
  return toolContentMap[toolId] ?? defaultToolContent;
}
