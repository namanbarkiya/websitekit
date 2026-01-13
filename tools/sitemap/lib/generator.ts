import type { ToolOutput } from "@/lib/utils/tool-registry";

import { DEFAULT_STATE, type SitemapState } from "../types";

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

function escapeXml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function normalizeLoc({
  line,
  baseUrl,
  stripQueryAndHash,
  includeTrailingSlash,
}: {
  line: string;
  baseUrl: string;
  stripQueryAndHash: boolean;
  includeTrailingSlash: boolean;
}): string | null {
  const raw = line.trim();
  if (!raw) return null;
  if (raw.startsWith("#")) return null;

  const base = baseUrl.trim().replace(/\/+$/, "");
  const maybeUrl =
    raw.startsWith("http://") || raw.startsWith("https://")
      ? raw
      : base
        ? `${base}${raw.startsWith("/") ? raw : `/${raw}`}`
        : raw;

  try {
    const u = new URL(maybeUrl);
    if (stripQueryAndHash) {
      u.search = "";
      u.hash = "";
    }

    if (includeTrailingSlash) {
      if (!u.pathname.endsWith("/") && u.pathname !== "/") u.pathname += "/";
    } else {
      if (u.pathname.endsWith("/") && u.pathname !== "/") {
        u.pathname = u.pathname.replace(/\/+$/, "");
      }
    }

    return u.toString();
  } catch {
    return maybeUrl;
  }
}

function todayIsoDate(): string {
  // sitemap <lastmod> supports date or datetime; keep it simple and stable.
  return new Date().toISOString().slice(0, 10);
}

function buildSitemapXml({
  locs,
  includeLastmod,
  lastmodValue,
  includeChangefreq,
  changefreq,
  includePriority,
  priority,
}: {
  locs: string[];
  includeLastmod: boolean;
  lastmodValue: string | null;
  includeChangefreq: boolean;
  changefreq: string;
  includePriority: boolean;
  priority: number;
}): string {
  const lines: string[] = [];
  lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  lines.push(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
  );

  const pr = clamp(priority, 0, 1).toFixed(1);

  for (const loc of locs) {
    lines.push(`  <url>`);
    lines.push(`    <loc>${escapeXml(loc)}</loc>`);
    if (includeLastmod && lastmodValue) {
      lines.push(`    <lastmod>${escapeXml(lastmodValue)}</lastmod>`);
    }
    if (includeChangefreq) {
      lines.push(`    <changefreq>${escapeXml(changefreq)}</changefreq>`);
    }
    if (includePriority) {
      lines.push(`    <priority>${escapeXml(pr)}</priority>`);
    }
    lines.push(`  </url>`);
  }

  lines.push(`</urlset>`);
  return `${lines.join("\n")}\n`;
}

function buildHtmlSitemap({
  locs,
  title,
}: {
  locs: string[];
  title: string;
}): string {
  const escapedTitle = escapeHtml(title || "HTML Sitemap");
  const items = locs
    .map((loc) => {
      const href = escapeHtml(loc);
      return `<li><a href="${href}">${href}</a></li>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapedTitle}</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; padding: 24px; line-height: 1.5; }
      h1 { font-size: 20px; margin: 0 0 12px; }
      p { color: #555; margin: 0 0 16px; }
      ul { margin: 0; padding-left: 18px; }
      li { margin: 6px 0; word-break: break-word; }
      a { color: #0b57d0; text-decoration: none; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <h1>${escapedTitle}</h1>
    <p>Links listed: ${locs.length}</p>
    <ul>
${items}
    </ul>
  </body>
</html>
`;
}

export function generateSitemapOutput(
  state: Partial<SitemapState>,
  assetsDomain?: string
): ToolOutput {
  const s: SitemapState = { ...DEFAULT_STATE, ...state };

  const origin = s.baseUrl.trim()
    ? normalizeDomainToOrigin(s.baseUrl)
    : assetsDomain?.trim()
      ? normalizeDomainToOrigin(assetsDomain)
      : "";

  const rawLines = s.urls.split(/\r?\n/g);
  let locs = rawLines
    .map((line) =>
      normalizeLoc({
        line,
        baseUrl: origin,
        stripQueryAndHash: s.stripQueryAndHash,
        includeTrailingSlash: s.includeTrailingSlash,
      })
    )
    .filter((v): v is string => Boolean(v));

  if (s.sortAndDedupe) {
    locs = Array.from(new Set(locs)).sort((a, b) => a.localeCompare(b));
  }

  const lastmodValue =
    s.includeLastmod && s.lastmodMode === "today" ? todayIsoDate() : null;

  const xml = buildSitemapXml({
    locs,
    includeLastmod: s.includeLastmod,
    lastmodValue,
    includeChangefreq: s.includeChangefreq,
    changefreq: s.changefreq,
    includePriority: s.includePriority,
    priority: s.priority,
  });

  const files = [
    { filename: "sitemap.xml", content: xml, mimeType: "application/xml" },
  ];

  if (s.includeHtmlSitemap) {
    const html = buildHtmlSitemap({
      locs,
      title: origin ? `Sitemap for ${origin}` : "HTML Sitemap",
    });
    files.push({ filename: "sitemap.html", content: html, mimeType: "text/html" });
  }

  const xmlPreview = xml.split("\n").slice(0, 60).join("\n");
  const previewHtml = `
    <div>
      <div style="font-size:12px;color:rgba(120,120,120,1);margin-bottom:8px;">
        sitemap.xml preview (${locs.length} URL${locs.length === 1 ? "" : "s"})
      </div>
      <pre style="margin:0;white-space:pre-wrap;word-break:break-word;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:12px;line-height:1.5;">${escapeHtml(xmlPreview)}</pre>
      ${
        locs.length > 60
          ? `<div style="font-size:12px;color:rgba(120,120,120,1);margin-top:8px;">(preview truncated)</div>`
          : ""
      }
    </div>
  `.trim();

  return { type: "files", files, preview: previewHtml };
}
