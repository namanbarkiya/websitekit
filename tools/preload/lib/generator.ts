import type { ToolOutput } from "@/lib/utils/tool-registry";

import { DEFAULT_STATE, type PreloadState, type ResourceHint } from "../types";

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

function generateResourceHintTag(hint: ResourceHint): string {
  const attrs: string[] = [`rel="${escapeAttr(hint.type)}"`];
  attrs.push(`href="${escapeAttr(hint.href)}"`);

  if (hint.as) {
    attrs.push(`as="${escapeAttr(hint.as)}"`);
  }

  if (hint.crossorigin) {
    attrs.push(`crossorigin="${escapeAttr(hint.crossorigin)}"`);
  }

  if (hint.typeAttr) {
    attrs.push(`type="${escapeAttr(hint.typeAttr)}"`);
  }

  if (hint.media) {
    attrs.push(`media="${escapeAttr(hint.media)}"`);
  }

  return `<link ${attrs.join(" ")} />`;
}

export function generatePreloadOutput(
  state: Partial<PreloadState>
): ToolOutput {
  const s: PreloadState = { ...DEFAULT_STATE, ...state };
  const validHints = s.hints.filter((h) => h.href.trim());

  if (validHints.length === 0) {
    return {
      type: "html",
      content: "",
      preview: `
        <div style="padding:16px;text-align:center;color:rgba(120,120,120,1);">
          Add resource hints to generate preload/preconnect tags
        </div>
      `.trim(),
    };
  }

  const tags = validHints.map(generateResourceHintTag);
  const html = tags.join("\n");

  const previewHtml = `
    <div>
      <div style="font-size:12px;color:rgba(120,120,120,1);margin-bottom:8px;">
        Resource Hints (${validHints.length})
      </div>
      <pre style="margin:0;white-space:pre-wrap;word-break:break-word;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:11px;line-height:1.5;max-height:400px;overflow:auto;padding:12px;background:rgba(0,0,0,0.03);border-radius:6px;">
${escapeHtml(html)}
      </pre>
    </div>
  `.trim();

  return {
    type: "files",
    content: html,
    files: [
      {
        filename: "resource-hints.html",
        content: html,
        mimeType: "text/html",
      },
    ],
    preview: previewHtml,
  };
}
