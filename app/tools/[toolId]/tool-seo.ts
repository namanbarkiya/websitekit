import type { Metadata } from "next";

export type ToolMeta = {
  toolId: string;
  title: string;
  description?: string;
  keywords?: string[];
  locked?: boolean;
};

function isGeneratorishTitle(title: string) {
  const t = title.toLowerCase();
  if (t.includes("guide")) return false;
  if (t.includes("checklist")) return false;
  if (t.includes("generator")) return false;
  if (t.includes("export")) return true;
  if (t.includes("preview")) return true;
  return true;
}

export function toolTitle(tool: ToolMeta): string {
  // SEO-friendly, high intent, without stuffing.
  switch (tool.toolId) {
    case "meta-tags":
      return "Free Meta Tags Generator (SEO + Open Graph)";
    case "qr-code":
      return "Free QR Code Generator (SVG + PNG)";
    case "robots":
      return "Free robots.txt Generator";
    case "sitemap":
      return "Free Sitemap.xml Generator";
    case "security-headers":
      return "Free Security Headers Generator";
    case "gradient":
      return "Free CSS Gradient Generator";
    default: {
      if (tool.title.toLowerCase().includes("generator")) {
        return `${tool.title} (Free)`;
      }
      if (tool.title.toLowerCase().includes("checklist")) {
        return `${tool.title} (Free)`;
      }
      if (tool.title.toLowerCase().includes("guide")) {
        return `${tool.title} (Free)`;
      }
      if (isGeneratorishTitle(tool.title)) {
        return `${tool.title} Generator (Free)`;
      }
      return `${tool.title} Tool (Free)`;
    }
  }
}

export function toolDescription(tool: ToolMeta): string {
  const fallback =
    tool.description ??
    `Generate ${tool.title.toLowerCase()} outputs in seconds with WebsiteKit.`;

  switch (tool.toolId) {
    case "meta-tags":
      return "Generate SEO meta tags, Open Graph, and Twitter Cards in one clean <head> snippet. Fast, correct, and copy‑paste ready.";
    case "qr-code":
      return "Create scannable QR codes for URLs or text and download as SVG/PNG. Crisp output, no signup.";
    case "robots":
      return "Generate a production-ready robots.txt with safe defaults and an optional Sitemap line. Great for launch and SEO hygiene.";
    case "sitemap":
      return "Generate a clean sitemap.xml from a list of URLs/paths. Export a ready-to-host file and keep crawl discovery simple.";
    case "security-headers":
      return "Generate recommended HTTP security headers (HSTS, X-Frame-Options, Referrer-Policy, and more) with copy‑paste deployment snippets.";
    case "gradient":
      return "Design linear and radial CSS gradients with live preview. Drag stops, copy CSS, and ship polished backgrounds fast.";
    default:
      return fallback;
  }
}

export function toolKeywords(tool: ToolMeta): NonNullable<Metadata["keywords"]> {
  const kw = tool.keywords ?? [];
  const extras = [
    "free",
    "online",
    "generator",
    "websitekit",
    tool.title.toLowerCase(),
  ];
  return Array.from(new Set([...kw, ...extras])).slice(0, 25);
}

