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
import { toolContentMap } from "./tool-content";

export type { ToolContent };

export function getToolContent(toolId: string): ToolContent {
  return toolContentMap[toolId] ?? defaultToolContent;
}
