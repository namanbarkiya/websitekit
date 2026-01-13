import type { ToolOutput } from "@/lib/utils/tool-registry";

import { DEFAULT_STATE, type GradientState, type GradientStop } from "../types";

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

function normalizeStop(stop: GradientStop): GradientStop {
  const position = clamp(
    Number.isFinite(stop.position) ? stop.position : 0,
    0,
    100
  );
  const color = (stop.color || "#000000").trim();
  return { color, position };
}

export function toGradientCss(state: Partial<GradientState>): {
  css: string;
  declaration: string;
} {
  const s: GradientState = { ...DEFAULT_STATE, ...state };
  const stops = (s.stops || DEFAULT_STATE.stops)
    .map(normalizeStop)
    .sort((a, b) => a.position - b.position);

  const stopsStr = stops
    .map((st) => `${st.color} ${clamp(st.position, 0, 100)}%`)
    .join(", ");

  const declaration =
    s.type === "radial"
      ? `radial-gradient(circle at ${clamp(s.radialX, 0, 100)}% ${clamp(
          s.radialY,
          0,
          100
        )}%, ${stopsStr})`
      : `linear-gradient(${clamp(s.angle, 0, 360)}deg, ${stopsStr})`;

  const fallback = stops[0]?.color || "#000000";
  const cssLines: string[] = [];
  cssLines.push("/* CSS gradient */");
  if (s.includeFallback) cssLines.push(`background-color: ${fallback};`);
  cssLines.push(`background-image: ${declaration};`);

  return { css: `${cssLines.join("\n")}\n`, declaration };
}

export function generateGradientOutput(
  state: Partial<GradientState>
): ToolOutput {
  const { css, declaration } = toGradientCss(state);

  const previewHtml = `
    <div style="padding:16px;">
      <div style="border-radius:16px;border:1px solid rgba(120,120,120,0.25);overflow:hidden;">
        <div style="height:220px;background-image:${escapeHtml(
          declaration
        )};"></div>
        <div style="padding:12px;background:rgba(0,0,0,0.03);">
          <div style="font-size:12px;color:rgba(120,120,120,1);margin-bottom:6px;">CSS</div>
          <pre style="margin:0;white-space:pre-wrap;word-break:break-word;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:12px;line-height:1.5;">${escapeHtml(
            css
          )}</pre>
        </div>
      </div>
    </div>
  `.trim();

  return {
    type: "files",
    files: [{ filename: "gradient.css", content: css, mimeType: "text/css" }],
    preview: previewHtml,
  };
}

