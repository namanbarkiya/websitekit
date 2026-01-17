/**
 * Central SEO aggregation and helpers.
 * Each tool defines its own seo-content.ts with the unified ToolSeo schema.
 * This file imports them all and provides lookup functions.
 */

import type { Metadata } from "next";

import { defaultToolSeo, type ToolSeo } from "../content-types";
// Import SEO content from each tool
import { seo as canonicalUrlSeo } from "../canonical-url/seo-content";
import { seo as faviconSeo } from "../favicon/seo-content";
import { seo as gradientSeo } from "../gradient/seo-content";
import { seo as htmlHeadSeo } from "../html-head/seo-content";
import { seo as jsonLdSeo } from "../json-ld/seo-content";
import { seo as metaTagsSeo } from "../meta-tags/seo-content";
import { seo as preloadSeo } from "../preload/seo-content";
import { seo as qrCodeSeo } from "../qr-code/seo-content";
import { seo as robotsSeo } from "../robots/seo-content";
import { seo as securityHeadersSeo } from "../security-headers/seo-content";
import { seo as sitemapSeo } from "../sitemap/seo-content";

/** Aggregated SEO data for all tools */
export const toolSeoMap: Record<string, ToolSeo> = {
  "canonical-url": canonicalUrlSeo,
  favicon: faviconSeo,
  gradient: gradientSeo,
  "html-head": htmlHeadSeo,
  "json-ld": jsonLdSeo,
  "meta-tags": metaTagsSeo,
  preload: preloadSeo,
  "qr-code": qrCodeSeo,
  robots: robotsSeo,
  "security-headers": securityHeadersSeo,
  sitemap: sitemapSeo,
};

/** Get SEO data for a tool, falling back to defaults */
export function getToolSeo(toolId: string): ToolSeo {
  return toolSeoMap[toolId] ?? defaultToolSeo;
}

// ============================================================================
// Helper types and functions for page components
// ============================================================================

export type ToolMeta = {
  toolId: string;
  title: string;
  description?: string;
  keywords?: string[];
  locked?: boolean;
};

/** Tool page meta title (for <title> tag) */
export function toolMetaTitle(tool: ToolMeta): string {
  const seo = toolSeoMap[tool.toolId];
  if (seo) {
    return `${seo.meta.title} | WebsiteKit`;
  }
  return `Free ${tool.title} Generator | WebsiteKit`;
}

/** Tool page meta description */
export function toolMetaDescription(tool: ToolMeta): string {
  const seo = toolSeoMap[tool.toolId];
  if (seo) {
    return seo.meta.description;
  }
  return `Need to create ${tool.title.toLowerCase()}? Generate clean output in seconds with this free tool.`;
}

/** Tool page display title (for H1) */
export function toolTitle(tool: ToolMeta): string {
  const seo = toolSeoMap[tool.toolId];
  if (seo) {
    return seo.meta.title;
  }
  return `Free ${tool.title} Generator`;
}

/** Tool page display description */
export function toolDescription(tool: ToolMeta): string {
  const seo = toolSeoMap[tool.toolId];
  if (seo) {
    return seo.meta.description;
  }
  return `Generate ${tool.title.toLowerCase()} instantly with this free tool.`;
}

/** Info page meta title */
export function toolInfoMetaTitle(tool: ToolMeta): string {
  const seo = toolSeoMap[tool.toolId];
  if (seo) {
    return `${seo.meta.infoTitle} | WebsiteKit`;
  }
  return `How to Use ${tool.title} – Guide | WebsiteKit`;
}

/** Info page meta description */
export function toolInfoMetaDescription(tool: ToolMeta): string {
  const seo = toolSeoMap[tool.toolId];
  if (seo) {
    return seo.meta.infoDescription;
  }
  return `Learn what ${tool.title.toLowerCase()} is, why it matters, common mistakes, and best practices.`;
}

/** Keywords for meta tags */
export function toolKeywords(
  tool: ToolMeta
): NonNullable<Metadata["keywords"]> {
  const seo = toolSeoMap[tool.toolId];
  const toolKw = seo?.meta.keywords ?? [];
  const baseKw = tool.keywords ?? [];
  const extras = [
    "free",
    "online",
    "generator",
    "websitekit",
    tool.title.toLowerCase(),
  ];
  return Array.from(new Set([...toolKw, ...baseKw, ...extras])).slice(0, 25);
}

/** Get related tools for internal linking */
export function getRelatedTools(toolId: string): string[] {
  const seo = toolSeoMap[toolId];
  return seo?.relatedTools ?? [];
}

// Re-export the ToolSeo type
export type { ToolSeo };
