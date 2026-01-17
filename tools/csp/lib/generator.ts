import type { ToolOutput } from "@/lib/utils/tool-registry";

import { DEFAULT_STATE, type CSPState, type CSPDirectiveConfig } from "../types";

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

function buildCSPHeader(state: CSPState): string {
  const enabledDirectives = state.directives.filter((d) => d.enabled);
  const parts: string[] = [];

  for (const dir of enabledDirectives) {
    if (
      dir.directive === "upgrade-insecure-requests" ||
      dir.directive === "block-all-mixed-content"
    ) {
      // These directives don't take values
      parts.push(dir.directive);
    } else if (dir.values.length > 0) {
      const values = dir.values.join(" ");
      parts.push(`${dir.directive} ${values}`);
    } else {
      parts.push(dir.directive);
    }
  }

  if (state.reportUri && state.reportUri.trim()) {
    parts.push(`report-uri ${escapeAttr(state.reportUri.trim())}`);
  }

  return parts.join("; ");
}

export function generateCSPOutput(state: Partial<CSPState>): ToolOutput {
  const s: CSPState = { ...DEFAULT_STATE, ...state };
  const headerValue = buildCSPHeader(s);

  if (!headerValue.trim()) {
    return {
      type: "text",
      content: "",
      preview: `
        <div style="padding:16px;text-align:center;color:rgba(120,120,120,1);">
          Enable at least one CSP directive to generate a policy
        </div>
      `.trim(),
    };
  }

  const headerName = s.reportOnly
    ? "Content-Security-Policy-Report-Only"
    : "Content-Security-Policy";

  const headerLine = `${headerName}: ${headerValue}`;

  // Generate different formats
  const nginxConfig = `add_header ${headerName} "${headerValue}" always;`;
  const apacheConfig = `Header always set ${headerName} "${headerValue}"`;
  const metaTag = `<meta http-equiv="${headerName}" content="${escapeAttr(headerValue)}" />`;

  const previewHtml = `
    <div>
      <div style="font-size:12px;color:rgba(120,120,120,1);margin-bottom:8px;">
        ${headerName}
      </div>
      <pre style="margin:0;white-space:pre-wrap;word-break:break-word;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:11px;line-height:1.5;max-height:400px;overflow:auto;padding:12px;background:rgba(0,0,0,0.03);border-radius:6px;">
${escapeHtml(headerLine)}
      </pre>
    </div>
  `.trim();

  return {
    type: "files",
    content: headerLine,
    files: [
      {
        filename: "csp-header.txt",
        content: headerLine,
        mimeType: "text/plain",
      },
      {
        filename: "nginx.conf",
        content: nginxConfig,
        mimeType: "text/plain",
      },
      {
        filename: "apache.conf",
        content: apacheConfig,
        mimeType: "text/plain",
      },
      {
        filename: "csp-meta.html",
        content: metaTag,
        mimeType: "text/html",
      },
    ],
    preview: previewHtml,
  };
}
