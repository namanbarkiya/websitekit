import type { ToolOutput } from "@/lib/utils/tool-registry";

import { DEFAULT_STATE, type RobotsState } from "../types";

function normalizeDomainToOrigin(domain: string): string {
  const raw = domain.trim();
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      return new URL(raw).origin;
    } catch {
      return raw;
    }
  }
  return `https://${raw.replace(/\/+$/, "")}`;
}

function toRobotsPathLines(value: string): string[] {
  return value
    .split(/\r?\n/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => (p.startsWith("/") ? p : `/${p}`));
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function generateRobotsTxt(state: Partial<RobotsState>): {
  txt: string;
  previewHtml: string;
} {
  const s: RobotsState = { ...DEFAULT_STATE, ...state };

  const lines: string[] = [];
  lines.push("User-agent: *");

  if (s.policy === "block-all") {
    lines.push("Disallow: /");
  } else if (s.policy === "custom") {
    const allowLines = toRobotsPathLines(s.allow);
    const disallowLines = toRobotsPathLines(s.disallow);

    for (const p of allowLines) lines.push(`Allow: ${p}`);
    for (const p of disallowLines) lines.push(`Disallow: ${p}`);

    if (allowLines.length === 0 && disallowLines.length === 0) {
      // Valid but confusing; default to allow-all behavior.
      lines.push("Allow: /");
    }
  } else {
    lines.push("Allow: /");
  }

  if (s.includeSitemap && s.sitemapUrl.trim()) {
    lines.push("");
    lines.push(`Sitemap: ${s.sitemapUrl.trim()}`);
  }

  const txt = `${lines.join("\n")}\n`;
  const previewHtml = `
    <div>
      <div style="font-size:12px;color:rgba(120,120,120,1);margin-bottom:8px;">
        robots.txt preview
      </div>
      <pre style="margin:0;white-space:pre-wrap;word-break:break-word;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:12px;line-height:1.5;">
${escapeHtml(txt)}
      </pre>
    </div>
  `.trim();

  return { txt, previewHtml };
}

export function generateRobotsOutput(
  state: Partial<RobotsState>,
  assetsDomain?: string
): ToolOutput {
  const next: Partial<RobotsState> = { ...state };

  if (!next.sitemapUrl?.trim() && assetsDomain?.trim()) {
    const origin = normalizeDomainToOrigin(assetsDomain);
    if (origin) next.sitemapUrl = `${origin}/sitemap.xml`;
  }

  const { txt, previewHtml } = generateRobotsTxt(next);

  return {
    type: "files",
    files: [{ filename: "robots.txt", content: txt, mimeType: "text/plain" }],
    preview: previewHtml,
  };
}

