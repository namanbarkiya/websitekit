/**
 * Tool Registry
 *
 * Central registry for all tools. Tools are registered here and can be
 * loaded dynamically by the tool host page.
 */

import type { ComponentType, ReactNode } from "react";
import type { WebsiteAssets } from "@/lib/store/asset-store";

/**
 * Supported output types that tools can generate
 */
export type OutputType = "html" | "json" | "text" | "file" | "image" | "files";

/**
 * Tool output structure
 */
export interface ToolOutput {
  /** Type of output */
  type: OutputType;
  /** Content for HTML/JSON/Text outputs */
  content?: string;
  /** File data for file/image outputs */
  files?: ToolOutputFile[];
  /** Filename for single file outputs */
  filename?: string;
  /** MIME type for file outputs */
  mimeType?: string;
  /** Preview data (optional) */
  preview?: string;
}

/**
 * File output structure
 */
export interface ToolOutputFile {
  filename: string;
  content: string | Blob;
  mimeType?: string;
}

export interface HeaderGenerateConfig {
  onGenerate: () => void | Promise<void>;
  disabled?: boolean;
  label?: string;
}

/**
 * Props passed to tool components
 */
export interface ToolProps {
  /** Website assets (read-only) */
  assets: Readonly<WebsiteAssets>;
  /** Current tool state (managed by tool) */
  state: Record<string, unknown>;
  /** Update tool state */
  setState: (updates: Partial<Record<string, unknown>>) => void;
  /** Generate output callback */
  onGenerate: (output: ToolOutput) => void;
  /**
   * Optional: allow a tool to place an action (e.g. "Generate") in the host header.
   * Tools should clear it on unmount (set to null) to avoid stale actions.
   */
  setHeaderAction?: (action: ReactNode | null) => void;
  /**
   * Optional: allow a tool to register a global "Generate" handler for the host header button.
   * Tools should clear it on unmount (set to null) to avoid stale handlers.
   */
  setHeaderGenerate?: (config: HeaderGenerateConfig | null) => void;
}

/**
 * Tool definition manifest
 */
export interface ToolDefinition {
  /** Unique tool identifier (matches route) */
  id: string;
  /** Tool display name */
  name: string;
  /** Tool description */
  description: string;
  /** Tool category */
  category: string;
  /** Search keywords */
  keywords: string[];
  /** Website asset fields this tool accepts */
  acceptedContext: Array<keyof WebsiteAssets>;
  /** Output types this tool can generate */
  outputs: OutputType[];
  /** Tool UI component */
  Component: ComponentType<ToolProps>;
  /** Optional generation logic (can be separate from component) */
  generate?: (
    state: Record<string, unknown>,
    assets: Readonly<WebsiteAssets>
  ) => ToolOutput | Promise<ToolOutput>;
}

/**
 * Tool registry map
 */
type ToolRegistryMap = Map<string, ToolDefinition>;

/**
 * Global tool registry
 */
const toolRegistry: ToolRegistryMap = new Map();

/**
 * Register a tool in the registry
 */
export function registerTool(tool: ToolDefinition): void {
  if (toolRegistry.has(tool.id)) {
    console.warn(`Tool with ID "${tool.id}" is already registered. Overwriting.`);
  }

  // Validate tool definition
  if (!tool.id || !tool.name || !tool.Component) {
    throw new Error(
      `Invalid tool definition: tool must have id, name, and Component`
    );
  }

  if (!tool.keywords || tool.keywords.length === 0) {
    console.warn(`Tool "${tool.id}" has no keywords. This may affect searchability.`);
  }

  toolRegistry.set(tool.id, tool);
}

/**
 * Get a tool by ID
 */
export function getTool(id: string): ToolDefinition | undefined {
  return toolRegistry.get(id);
}

/**
 * Check if a tool exists
 */
export function hasTool(id: string): boolean {
  return toolRegistry.has(id);
}

/**
 * Get all registered tools
 */
export function getAllTools(): ToolDefinition[] {
  return Array.from(toolRegistry.values());
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: string): ToolDefinition[] {
  return getAllTools().filter((tool) => tool.category === category);
}

/**
 * Get tools that match search query
 */
export function searchTools(query: string): ToolDefinition[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return getAllTools();

  return getAllTools().filter((tool) => {
    // Search in name
    if (tool.name.toLowerCase().includes(lowerQuery)) return true;

    // Search in description
    if (tool.description.toLowerCase().includes(lowerQuery)) return true;

    // Search in keywords
    if (tool.keywords.some((keyword) => keyword.toLowerCase().includes(lowerQuery)))
      return true;

    // Search in category
    if (tool.category.toLowerCase().includes(lowerQuery)) return true;

    return false;
  });
}

/**
 * Clear all registered tools (useful for testing)
 */
export function clearRegistry(): void {
  toolRegistry.clear();
}

/**
 * Get registry stats
 */
export function getRegistryStats() {
  const tools = getAllTools();
  const categories = new Set(tools.map((t) => t.category));

  return {
    total: tools.length,
    categories: categories.size,
    byCategory: Object.fromEntries(
      Array.from(categories).map((cat) => [
        cat,
        tools.filter((t) => t.category === cat).length,
      ])
    ),
  };
}
