import type { ToolOutput } from "@/lib/utils/tool-registry";

import { DEFAULT_STATE, type HtmlHeadState } from "../types";

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

export function generateHtmlHead(state: Partial<HtmlHeadState>): string {
  const s: HtmlHeadState = { ...DEFAULT_STATE, ...state };
  const lines: string[] = [];

  // Basic HTML
  lines.push(`<meta charset="${escapeAttr(s.charset)}" />`);
  lines.push(`<meta name="viewport" content="${escapeAttr(s.viewport)}" />`);

  // Meta Tags
  if (s.includeMetaTags) {
    if (s.title) {
      lines.push(`<title>${escapeHtml(s.title)}</title>`);
    }
    if (s.description) {
      lines.push(
        `<meta name="description" content="${escapeAttr(s.description)}" />`
      );
    }
    if (s.keywords) {
      lines.push(
        `<meta name="keywords" content="${escapeAttr(s.keywords)}" />`
      );
    }
    if (s.author) {
      lines.push(`<meta name="author" content="${escapeAttr(s.author)}" />`);
    }
    if (s.robots) {
      lines.push(`<meta name="robots" content="${escapeAttr(s.robots)}" />`);
    }
  }

  // Open Graph
  if (s.includeOpenGraph) {
    if (s.ogTitle) {
      lines.push(
        `<meta property="og:title" content="${escapeAttr(s.ogTitle)}" />`
      );
    }
    if (s.ogDescription) {
      lines.push(
        `<meta property="og:description" content="${escapeAttr(s.ogDescription)}" />`
      );
    }
    if (s.ogImage) {
      lines.push(
        `<meta property="og:image" content="${escapeAttr(s.ogImage)}" />`
      );
    }
    if (s.ogType) {
      lines.push(
        `<meta property="og:type" content="${escapeAttr(s.ogType)}" />`
      );
    }
    if (s.ogUrl) {
      lines.push(
        `<meta property="og:url" content="${escapeAttr(s.ogUrl)}" />`
      );
    }
    if (s.ogSiteName) {
      lines.push(
        `<meta property="og:site_name" content="${escapeAttr(s.ogSiteName)}" />`
      );
    }
  }

  // Twitter Card
  if (s.includeTwitterCard) {
    if (s.twitterCard) {
      lines.push(
        `<meta name="twitter:card" content="${escapeAttr(s.twitterCard)}" />`
      );
    }
    if (s.twitterTitle) {
      lines.push(
        `<meta name="twitter:title" content="${escapeAttr(s.twitterTitle)}" />`
      );
    }
    if (s.twitterDescription) {
      lines.push(
        `<meta name="twitter:description" content="${escapeAttr(s.twitterDescription)}" />`
      );
    }
    if (s.twitterImage) {
      lines.push(
        `<meta name="twitter:image" content="${escapeAttr(s.twitterImage)}" />`
      );
    }
    if (s.twitterSite) {
      lines.push(
        `<meta name="twitter:site" content="${escapeAttr(s.twitterSite)}" />`
      );
    }
    if (s.twitterCreator) {
      lines.push(
        `<meta name="twitter:creator" content="${escapeAttr(s.twitterCreator)}" />`
      );
    }
  }

  // Canonical URL
  if (s.includeCanonical && s.canonicalUrl) {
    lines.push(
      `<link rel="canonical" href="${escapeAttr(s.canonicalUrl)}" />`
    );
  }

  // Favicons
  if (s.includeFavicons) {
    if (s.faviconIco) {
      lines.push(`<link rel="icon" href="${escapeAttr(s.faviconIco)}" />`);
    }
    if (s.favicon16) {
      lines.push(
        `<link rel="icon" type="image/png" sizes="16x16" href="${escapeAttr(s.favicon16)}" />`
      );
    }
    if (s.favicon32) {
      lines.push(
        `<link rel="icon" type="image/png" sizes="32x32" href="${escapeAttr(s.favicon32)}" />`
      );
    }
    if (s.favicon96) {
      lines.push(
        `<link rel="icon" type="image/png" sizes="96x96" href="${escapeAttr(s.favicon96)}" />`
      );
    }
    if (s.appleTouchIcon) {
      lines.push(
        `<link rel="apple-touch-icon" href="${escapeAttr(s.appleTouchIcon)}" />`
      );
    }
    if (s.androidChrome192) {
      lines.push(
        `<link rel="icon" type="image/png" sizes="192x192" href="${escapeAttr(s.androidChrome192)}" />`
      );
    }
    if (s.androidChrome512) {
      lines.push(
        `<link rel="icon" type="image/png" sizes="512x512" href="${escapeAttr(s.androidChrome512)}" />`
      );
    }
    if (s.manifest) {
      lines.push(
        `<link rel="manifest" href="${escapeAttr(s.manifest)}" />`
      );
    }
  }

  // JSON-LD Schema
  if (s.includeJsonLd && s.jsonLdSchema.trim()) {
    lines.push(`<script type="application/ld+json">`);
    lines.push(s.jsonLdSchema.trim());
    lines.push(`</script>`);
  }

  // Security Headers (meta tags)
  if (s.includeSecurityMeta) {
    if (s.contentSecurityPolicy) {
      lines.push(
        `<meta http-equiv="Content-Security-Policy" content="${escapeAttr(s.contentSecurityPolicy)}" />`
      );
    }
    if (s.referrerPolicy) {
      lines.push(
        `<meta name="referrer" content="${escapeAttr(s.referrerPolicy)}" />`
      );
    }
    if (s.permissionsPolicy) {
      lines.push(
        `<meta http-equiv="Permissions-Policy" content="${escapeAttr(s.permissionsPolicy)}" />`
      );
    }
  }

  // PWA
  if (s.includePWA) {
    if (s.themeColor) {
      lines.push(
        `<meta name="theme-color" content="${escapeAttr(s.themeColor)}" />`
      );
    }
    if (s.appleMobileWebAppCapable) {
      lines.push(
        `<meta name="apple-mobile-web-app-capable" content="yes" />`
      );
      if (s.appleMobileWebAppStatusBarStyle) {
        lines.push(
          `<meta name="apple-mobile-web-app-status-bar-style" content="${escapeAttr(s.appleMobileWebAppStatusBarStyle)}" />`
        );
      }
      if (s.appleMobileWebAppTitle) {
        lines.push(
          `<meta name="apple-mobile-web-app-title" content="${escapeAttr(s.appleMobileWebAppTitle)}" />`
        );
      }
    }
  }

  // Other custom tags
  if (s.includeOther && s.otherTags.trim()) {
    lines.push(s.otherTags.trim());
  }

  return lines.join("\n");
}

export function generateHtmlHeadOutput(
  state: Partial<HtmlHeadState>
): ToolOutput {
  const s: HtmlHeadState = { ...DEFAULT_STATE, ...state };

  const headContent = generateHtmlHead(s);

  if (!headContent.trim()) {
    return {
      type: "html",
      content: "",
      preview: `
        <div style="padding:16px;text-align:center;color:rgba(120,120,120,1);">
          Configure the head elements you want to include
        </div>
      `.trim(),
    };
  }

  const fullHead = `<head>\n${headContent}\n</head>`;

  const previewHtml = `
    <div>
      <div style="font-size:12px;color:rgba(120,120,120,1);margin-bottom:8px;">
        HTML Head Preview
      </div>
      <pre style="margin:0;white-space:pre-wrap;word-break:break-word;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:11px;line-height:1.5;max-height:400px;overflow:auto;padding:12px;background:rgba(0,0,0,0.03);border-radius:6px;">
${escapeHtml(headContent)}
      </pre>
    </div>
  `.trim();

  return {
    type: "files",
    content: fullHead,
    files: [
      {
        filename: "head.html",
        content: fullHead,
        mimeType: "text/html",
      },
      {
        filename: "head-snippet.html",
        content: headContent,
        mimeType: "text/html",
      },
    ],
    preview: previewHtml,
  };
}
