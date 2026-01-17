import type { ToolOutput } from "@/lib/utils/tool-registry";

import {
  DEFAULT_STATE,
  type FontLoadingState,
  type FontFace,
} from "../types";

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeCss(input: string): string {
  return input.replaceAll('"', '\\"').replaceAll("'", "\\'");
}

function generateFontFace(font: FontFace, defaultDisplay: FontDisplay): string {
  const rules: string[] = [];
  rules.push(`  font-family: ${escapeCss(font.fontFamily)};`);

  // Handle src - can be URL or local()
  if (font.src.startsWith("http://") || font.src.startsWith("https://")) {
    rules.push(`  src: url("${escapeCss(font.src)}") format("woff2");`);
  } else if (font.src.startsWith("local(")) {
    rules.push(`  src: ${font.src};`);
  } else {
    // Assume it's a URL
    rules.push(`  src: url("${escapeCss(font.src)}") format("woff2");`);
  }

  if (font.fontWeight) {
    rules.push(`  font-weight: ${font.fontWeight};`);
  }

  if (font.fontStyle) {
    rules.push(`  font-style: ${font.fontStyle};`);
  }

  const display = font.fontDisplay || defaultDisplay;
  rules.push(`  font-display: ${display};`);

  if (font.unicodeRange) {
    rules.push(`  unicode-range: ${font.unicodeRange};`);
  }

  return `@font-face {\n${rules.join("\n")}\n}`;
}

function generatePreloadTag(font: FontFace): string {
  const url = font.src.startsWith("http")
    ? font.src
    : font.src.startsWith("local(")
      ? ""
      : font.src;

  if (!url) return "";

  return `<link rel="preload" as="font" href="${escapeHtml(url)}" crossorigin="anonymous" />`;
}

export function generateFontLoadingOutput(
  state: Partial<FontLoadingState>
): ToolOutput {
  const s: FontLoadingState = { ...DEFAULT_STATE, ...state };
  const validFonts = s.fonts.filter((f) => f.fontFamily.trim() && f.src.trim());

  if (validFonts.length === 0) {
    return {
      type: "html",
      content: "",
      preview: `
        <div style="padding:16px;text-align:center;color:rgba(120,120,120,1);">
          Add fonts to generate @font-face declarations and loading hints
        </div>
      `.trim(),
    };
  }

  const parts: string[] = [];

  // Generate preload tags if enabled
  if (s.includePreload) {
    const preloadTags = validFonts
      .map(generatePreloadTag)
      .filter(Boolean)
      .join("\n");
    if (preloadTags) {
      parts.push("<!-- Preload font files -->");
      parts.push(preloadTags);
      parts.push("");
    }
  }

  // Generate @font-face declarations
  if (s.includeFontDisplay) {
    parts.push("/* @font-face declarations */");
    validFonts.forEach((font) => {
      parts.push(generateFontFace(font, s.defaultFontDisplay));
      parts.push("");
    });
  } else {
    // Without font-display
    parts.push("/* @font-face declarations (without font-display) */");
    validFonts.forEach((font) => {
      const fontCopy = { ...font };
      delete fontCopy.fontDisplay;
      parts.push(generateFontFace(fontCopy, s.defaultFontDisplay));
      parts.push("");
    });
  }

  const css = parts.join("\n").trim();
  const html = `<style>\n${css}\n</style>`;

  const previewHtml = `
    <div>
      <div style="font-size:12px;color:rgba(120,120,120,1);margin-bottom:8px;">
        Font Loading Code (${validFonts.length} font${validFonts.length !== 1 ? "s" : ""})
      </div>
      <pre style="margin:0;white-space:pre-wrap;word-break:break-word;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:11px;line-height:1.5;max-height:400px;overflow:auto;padding:12px;background:rgba(0,0,0,0.03);border-radius:6px;">
${escapeHtml(css)}
      </pre>
    </div>
  `.trim();

  return {
    type: "files",
    content: html,
    files: [
      {
        filename: "fonts.css",
        content: css,
        mimeType: "text/css",
      },
      {
        filename: "font-loading.html",
        content: html,
        mimeType: "text/html",
      },
    ],
    preview: previewHtml,
  };
}
