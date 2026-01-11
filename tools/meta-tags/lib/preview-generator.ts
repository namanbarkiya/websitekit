/**
 * Meta Tags Preview Generator
 *
 * Generates HTML string showing how meta tags appear on different platforms
 * (Google, X, Facebook, etc.). This HTML is passed to output.preview and
 * rendered by the shared PreviewTab component.
 */

import type { MetaTagsState } from "../types";

export function generatePreviewHTML(
  state: MetaTagsState,
  primaryColor?: string
): string {
  // Use primary color from assets for fallback backgrounds when no image
  // primaryColor is in hex format (e.g., "#3b82f6")
  // For CSS variable fallback, we need to use a computed value or default blue
  const brandColor = primaryColor || "#3b82f6";
  const title = state.title || state.ogTitle || "Untitled";
  const description = state.description || state.ogDescription || "";
  const url = state.canonicalUrl || state.ogUrl || "";
  const image = state.ogImage || state.twitterImage || "";
  const siteName = state.ogSiteName || "";

  // Extract domain from URL
  const domain = url
    ? new URL(url.startsWith("http") ? url : `https://${url}`).hostname
    : "";

  return `
<div class="meta-preview-container space-y-6">
  <!-- Google Preview -->
  <div class="meta-preview-section">
    <div class="text-xs text-muted-foreground mb-2 font-medium">Google</div>
    <div class="border rounded-lg p-4 bg-background">
      <div class="space-y-1">
        <div class="text-blue-600 dark:text-blue-400 text-lg font-normal leading-tight cursor-pointer hover:underline">
          ${escapeHtml(title)}
        </div>
        <div class="text-green-700 dark:text-green-500 text-sm leading-tight">
          ${escapeHtml(domain)}
          ${domain ? '<span class="text-muted-foreground">▼</span>' : ""}
        </div>
        <div class="text-muted-foreground text-sm leading-snug line-clamp-2">
          ${escapeHtml(truncate(description, 155))}
        </div>
      </div>
    </div>
  </div>

  <!-- X (Twitter) Preview -->
  <div class="meta-preview-section">
    <div class="text-xs text-muted-foreground mb-2 font-medium">X (Formerly Twitter)</div>
    <div class="border rounded-lg overflow-hidden bg-background max-w-lg">
      ${
        image
          ? `<div class="aspect-[1.91/1] relative overflow-hidden" style="background-color: ${brandColor};">
            <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
            <div class="absolute inset-0 flex flex-col items-center justify-center text-white p-6" style="display: none; background-color: ${brandColor};">
              <div class="text-4xl font-bold mb-2">${escapeHtml(siteName || title.substring(0, 1).toUpperCase())}</div>
              <div class="text-xl font-semibold">${escapeHtml(truncate(title, 30))}</div>
            </div>
          </div>`
          : `<div class="aspect-[1.91/1] flex flex-col items-center justify-center text-white p-6" style="background-color: ${brandColor};">
            <div class="text-4xl font-bold mb-2">${escapeHtml(siteName || title.substring(0, 1).toUpperCase())}</div>
            <div class="text-xl font-semibold">${escapeHtml(truncate(title, 30))}</div>
          </div>`
      }
      ${
        title || description
          ? `<div class="p-4 space-y-1">
            <div class="font-semibold text-sm line-clamp-2">${escapeHtml(title)}</div>
            ${description ? `<div class="text-muted-foreground text-sm line-clamp-2">${escapeHtml(truncate(description, 100))}</div>` : ""}
            ${domain ? `<div class="text-xs text-muted-foreground mt-1">From ${escapeHtml(domain)}</div>` : ""}
          </div>`
          : ""
      }
    </div>
  </div>

  <!-- Facebook Preview -->
  <div class="meta-preview-section">
    <div class="text-xs text-muted-foreground mb-2 font-medium">Facebook</div>
    <div class="border rounded-lg overflow-hidden bg-background max-w-lg">
      ${
        image
          ? `<div class="aspect-[1.91/1] relative overflow-hidden" style="background-color: ${brandColor};">
            <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
            <div class="absolute inset-0 flex flex-col items-center justify-center text-white p-6" style="display: none; background-color: ${brandColor};">
              <div class="text-4xl font-bold mb-2">${escapeHtml(siteName || title.substring(0, 1).toUpperCase())}</div>
              <div class="text-xl font-semibold">${escapeHtml(truncate(title, 30))}</div>
            </div>
          </div>`
          : `<div class="aspect-[1.91/1] flex flex-col items-center justify-center text-white p-6" style="background-color: ${brandColor};">
            <div class="text-4xl font-bold mb-2">${escapeHtml(siteName || title.substring(0, 1).toUpperCase())}</div>
            <div class="text-xl font-semibold">${escapeHtml(truncate(title, 30))}</div>
          </div>`
      }
      <div class="p-3 space-y-1">
        ${domain ? `<div class="text-xs text-muted-foreground uppercase">${escapeHtml(domain)}</div>` : ""}
        ${title ? `<div class="font-semibold text-base leading-tight line-clamp-2">${escapeHtml(title)}</div>` : ""}
        ${description ? `<div class="text-muted-foreground text-sm leading-snug line-clamp-3">${escapeHtml(truncate(description, 125))}</div>` : ""}
      </div>
    </div>
  </div>

  <!-- Pinterest Preview -->
  <div class="meta-preview-section">
    <div class="text-xs text-muted-foreground mb-2 font-medium">Pinterest</div>
    <div class="border rounded-lg overflow-hidden bg-background max-w-xs">
      ${
        image
          ? `<div class="aspect-square relative overflow-hidden" style="background-color: ${brandColor};">
            <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
            <div class="absolute inset-0 flex flex-col items-center justify-center text-white p-6" style="display: none; background-color: ${brandColor};">
              <div class="text-4xl font-bold mb-2">${escapeHtml(siteName || title.substring(0, 1).toUpperCase())}</div>
            </div>
          </div>`
          : `<div class="aspect-square flex flex-col items-center justify-center text-white p-6" style="background-color: ${brandColor};">
            <div class="text-4xl font-bold mb-2">${escapeHtml(siteName || title.substring(0, 1).toUpperCase())}</div>
          </div>`
      }
      ${
        title
          ? `<div class="p-3">
        <div class="font-semibold text-sm line-clamp-2">${escapeHtml(title)}</div>
      </div>`
          : ""
      }
    </div>
  </div>

  <!-- Slack Preview -->
  <div class="meta-preview-section">
    <div class="text-xs text-muted-foreground mb-2 font-medium">Slack</div>
    <div class="border rounded-lg p-3 bg-background max-w-lg">
      <div class="flex items-start gap-2 mb-2">
        <div class="w-4 h-4 rounded shrink-0 mt-0.5" style="background-color: ${brandColor};"></div>
        <div class="text-sm font-medium text-muted-foreground">${escapeHtml(siteName || domain || "Link")}</div>
      </div>
      ${title ? `<div class="text-blue-600 dark:text-blue-400 font-semibold text-sm mb-1 leading-tight">${escapeHtml(title)}</div>` : ""}
      ${description ? `<div class="text-sm text-muted-foreground mb-3 leading-snug line-clamp-3">${escapeHtml(truncate(description, 150))}</div>` : ""}
      ${
        image
          ? `<div class="rounded-lg overflow-hidden border">
            <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" class="w-full object-cover" style="max-height: 300px;" onerror="this.style.display='none';" />
          </div>`
          : ""
      }
    </div>
  </div>
</div>
  `.trim();
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}
