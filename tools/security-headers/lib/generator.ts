import type { ToolOutput, ToolOutputFile } from "@/lib/utils/tool-registry";

import { DEFAULT_STATE, type SecurityHeadersState } from "../types";

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function clampInt(n: number, min: number, max: number): number {
  const v = Number.isFinite(n) ? Math.trunc(n) : min;
  return Math.min(max, Math.max(min, v));
}

function buildHeaderMap(state: SecurityHeadersState): Array<{
  key: string;
  value: string;
}> {
  const s = { ...DEFAULT_STATE, ...state };
  const headers: Array<{ key: string; value: string }> = [];

  if (s.enableHsts) {
    const maxAge = clampInt(s.hstsMaxAgeSeconds, 0, 63072000); // up to 2 years
    const parts = [`max-age=${maxAge}`];
    if (s.hstsIncludeSubdomains) parts.push("includeSubDomains");
    if (s.hstsPreload) parts.push("preload");
    headers.push({ key: "Strict-Transport-Security", value: parts.join("; ") });
  }

  if (s.enableNosniff) {
    headers.push({ key: "X-Content-Type-Options", value: "nosniff" });
  }

  if (s.enableFrameOptions) {
    headers.push({
      key: "X-Frame-Options",
      value: s.frameOptions === "deny" ? "DENY" : "SAMEORIGIN",
    });
  }

  if (s.enableReferrerPolicy) {
    headers.push({ key: "Referrer-Policy", value: s.referrerPolicy });
  }

  if (s.enableCoop) {
    headers.push({ key: "Cross-Origin-Opener-Policy", value: s.coop });
  }

  if (s.enableCorp) {
    headers.push({ key: "Cross-Origin-Resource-Policy", value: s.corp });
  }

  return headers;
}

function asHeadersTxt(headers: Array<{ key: string; value: string }>): string {
  const lines = headers.map((h) => `${h.key}: ${h.value}`);
  return `${lines.join("\n")}\n`;
}

function asNextHeadersSnippet(
  headers: Array<{ key: string; value: string }>
): string {
  const items = headers
    .map(
      (h) =>
        `        { key: ${JSON.stringify(h.key)}, value: ${JSON.stringify(
          h.value
        )} },`
    )
    .join("\n");

  return `// next.config.ts (snippet)
// Adds security headers for all routes
//
// Note: HSTS should only be enabled on HTTPS-only production sites.

export const headers = async () => {
  return [
    {
      source: "/:path*",
      headers: [
${items}
      ],
    },
  ];
};
`;
}

function asVercelJson(headers: Array<{ key: string; value: string }>): string {
  const headerItems = headers
    .map(
      (h) =>
        `        { "key": ${JSON.stringify(h.key)}, "value": ${JSON.stringify(
          h.value
        )} }`
    )
    .join(",\n");

  return `{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
${headerItems}
      ]
    }
  ]
}
`;
}

export function generateSecurityHeadersOutput(
  state: Partial<SecurityHeadersState>
): ToolOutput {
  const merged: SecurityHeadersState = { ...DEFAULT_STATE, ...state };
  const headerMap = buildHeaderMap(merged);
  const headersTxt = asHeadersTxt(headerMap);
  const nextSnippet = asNextHeadersSnippet(headerMap);
  const vercelJson = asVercelJson(headerMap);

  const files: ToolOutputFile[] = [
    {
      filename: "headers.txt",
      content: headersTxt,
      mimeType: "text/plain",
    },
    {
      filename: "nextjs-headers-snippet.ts",
      content: nextSnippet,
      mimeType: "text/plain",
    },
    {
      filename: "vercel.json",
      content: vercelJson,
      mimeType: "application/json",
    },
  ];

  const previewHtml = `
    <div>
      <div style="font-size:12px;color:rgba(120,120,120,1);margin-bottom:8px;">
        Generated headers (${headerMap.length})
      </div>
      <pre style="margin:0;white-space:pre-wrap;word-break:break-word;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:12px;line-height:1.5;">${escapeHtml(
        headersTxt
      )}</pre>
    </div>
  `.trim();

  return { type: "files", files, preview: previewHtml };
}
