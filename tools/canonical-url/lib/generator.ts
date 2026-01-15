import type { ToolOutput } from "@/lib/utils/tool-registry";

import { DEFAULT_STATE, type CanonicalUrlState } from "../types";

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(input: string): string {
  return input.replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

export function normalizeUrl(
  rawUrl: string,
  state: CanonicalUrlState
): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  // Add protocol if missing
  let urlStr = trimmed;
  if (!urlStr.startsWith("http://") && !urlStr.startsWith("https://")) {
    urlStr = `https://${urlStr}`;
  }

  let url: URL;
  try {
    url = new URL(urlStr);
  } catch {
    return null;
  }

  // Protocol preference
  if (state.protocol === "https") {
    url.protocol = "https:";
  } else if (state.protocol === "http") {
    url.protocol = "http:";
  }
  // "keep" leaves it as-is

  // WWW preference
  if (state.www === "www") {
    if (!url.hostname.startsWith("www.")) {
      url.hostname = `www.${url.hostname}`;
    }
  } else if (state.www === "no-www") {
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
    }
  }
  // "keep" leaves it as-is

  // Strip query parameters
  if (state.stripParams) {
    const keepList = state.keepParams
      .split(",")
      .map((p) => p.trim().toLowerCase())
      .filter(Boolean);

    if (keepList.length > 0) {
      const newParams = new URLSearchParams();
      for (const [key, value] of url.searchParams) {
        if (keepList.includes(key.toLowerCase())) {
          newParams.append(key, value);
        }
      }
      url.search = newParams.toString() ? `?${newParams.toString()}` : "";
    } else {
      url.search = "";
    }
  }

  // Trailing slash preference (only for paths, not root)
  let pathname = url.pathname;
  if (pathname !== "/") {
    if (state.trailingSlash === "add") {
      if (!pathname.endsWith("/")) {
        pathname = `${pathname}/`;
      }
    } else if (state.trailingSlash === "remove") {
      if (pathname.endsWith("/")) {
        pathname = pathname.slice(0, -1);
      }
    }
    url.pathname = pathname;
  }

  // Remove default ports
  if (
    (url.protocol === "https:" && url.port === "443") ||
    (url.protocol === "http:" && url.port === "80")
  ) {
    url.port = "";
  }

  // Remove hash (fragments should not be in canonicals)
  url.hash = "";

  return url.toString();
}

export function generateCanonicalTag(canonicalUrl: string): string {
  return `<link rel="canonical" href="${escapeAttr(canonicalUrl)}" />`;
}

export function generateCanonicalOutput(
  state: Partial<CanonicalUrlState>
): ToolOutput {
  const s: CanonicalUrlState = { ...DEFAULT_STATE, ...state };

  const canonicalUrl = normalizeUrl(s.pageUrl, s);

  if (!canonicalUrl) {
    return {
      type: "html",
      content: "",
      preview: `
        <div style="padding:16px;text-align:center;color:rgba(120,120,120,1);">
          Enter a URL to generate the canonical tag
        </div>
      `.trim(),
    };
  }

  const tag = generateCanonicalTag(canonicalUrl);

  const previewHtml = `
    <div>
      <div style="font-size:12px;color:rgba(120,120,120,1);margin-bottom:8px;">
        Canonical URL
      </div>
      <div style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:13px;padding:12px;background:rgba(0,0,0,0.03);border-radius:6px;word-break:break-all;">
        ${escapeHtml(canonicalUrl)}
      </div>
      <div style="font-size:12px;color:rgba(120,120,120,1);margin-top:16px;margin-bottom:8px;">
        HTML Tag
      </div>
      <pre style="margin:0;white-space:pre-wrap;word-break:break-word;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:12px;line-height:1.5;padding:12px;background:rgba(0,0,0,0.03);border-radius:6px;">
${escapeHtml(tag)}
      </pre>
    </div>
  `.trim();

  return {
    type: "files",
    content: tag,
    files: [
      {
        filename: "canonical.html",
        content: tag,
        mimeType: "text/html",
      },
    ],
    preview: previewHtml,
  };
}
