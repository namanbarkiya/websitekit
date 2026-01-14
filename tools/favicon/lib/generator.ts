import type { ToolOutput, ToolOutputFile } from "@/lib/utils/tool-registry";

import { DEFAULT_STATE, type FaviconState } from "../types";

type FaviconImage = {
  filename: string;
  size: number;
  mimeType: string;
  blob: Blob;
  dataUrl: string;
};

type FaviconOutput = {
  files: ToolOutputFile[];
  previewHtml: string;
};

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to generate image blob"));
        return;
      }
      resolve(blob);
    }, type);
  });
}

function drawIcon({
  image,
  size,
  backgroundColor,
  transparentBackground,
  paddingPercent,
}: {
  image: HTMLImageElement;
  size: number;
  backgroundColor: string;
  transparentBackground: boolean;
  paddingPercent: number;
}): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  if (!transparentBackground) {
    ctx.fillStyle = backgroundColor || "#ffffff";
    ctx.fillRect(0, 0, size, size);
  } else {
    ctx.clearRect(0, 0, size, size);
  }

  const padding = clamp(paddingPercent, 0, 40) / 100;
  const targetSize = size * (1 - padding * 2);

  const imgRatio = image.width / image.height;
  let drawW = targetSize;
  let drawH = targetSize;
  if (imgRatio > 1) {
    drawH = targetSize / imgRatio;
  } else if (imgRatio < 1) {
    drawW = targetSize * imgRatio;
  }

  const dx = (size - drawW) / 2;
  const dy = (size - drawH) / 2;
  ctx.drawImage(image, dx, dy, drawW, drawH);
  return canvas;
}

async function buildPngIcons(
  state: FaviconState
): Promise<FaviconImage[]> {
  const s: FaviconState = { ...DEFAULT_STATE, ...state };
  const img = await loadImage(s.sourceImage);

  const sizes: Array<{ size: number; filename: string; enabled: boolean }> = [
    { size: 16, filename: "favicon-16x16.png", enabled: s.includeBrowserPngs },
    { size: 32, filename: "favicon-32x32.png", enabled: s.includeBrowserPngs },
    { size: 48, filename: "favicon-48x48.png", enabled: s.includeBrowserPngs },
    { size: 96, filename: "favicon-96x96.png", enabled: s.includeBrowserPngs },
    { size: 180, filename: "apple-touch-icon.png", enabled: s.includeApple },
    { size: 192, filename: "android-chrome-192x192.png", enabled: s.includeAndroid },
    { size: 512, filename: "android-chrome-512x512.png", enabled: s.includeAndroid },
  ];

  const results: FaviconImage[] = [];
  for (const entry of sizes) {
    if (!entry.enabled) continue;
    const canvas = drawIcon({
      image: img,
      size: entry.size,
      backgroundColor: s.backgroundColor,
      transparentBackground: s.transparentBackground,
      paddingPercent: s.paddingPercent,
    });
    const blob = await canvasToBlob(canvas, "image/png");
    const dataUrl = canvas.toDataURL("image/png");
    results.push({
      filename: entry.filename,
      size: entry.size,
      mimeType: "image/png",
      blob,
      dataUrl,
    });
  }

  return results;
}

function buildIco(images: Array<{ size: number; data: ArrayBuffer }>): Blob {
  const count = images.length;
  const headerSize = 6;
  const entrySize = 16;
  const entriesSize = count * entrySize;
  const imageDataSize = images.reduce((sum, img) => sum + img.data.byteLength, 0);
  const totalSize = headerSize + entriesSize + imageDataSize;

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  let offset = 0;

  // ICONDIR
  view.setUint16(offset, 0, true); // reserved
  offset += 2;
  view.setUint16(offset, 1, true); // type = 1 (icon)
  offset += 2;
  view.setUint16(offset, count, true);
  offset += 2;

  let imageOffset = headerSize + entriesSize;
  for (let i = 0; i < count; i += 1) {
    const { size, data } = images[i];
    const width = size === 256 ? 0 : size;
    const height = size === 256 ? 0 : size;

    view.setUint8(offset, width);
    view.setUint8(offset + 1, height);
    view.setUint8(offset + 2, 0); // color count
    view.setUint8(offset + 3, 0); // reserved
    view.setUint16(offset + 4, 1, true); // planes
    view.setUint16(offset + 6, 32, true); // bit count
    view.setUint32(offset + 8, data.byteLength, true); // bytes in res
    view.setUint32(offset + 12, imageOffset, true); // image offset
    offset += entrySize;

    new Uint8Array(buffer, imageOffset, data.byteLength).set(
      new Uint8Array(data)
    );
    imageOffset += data.byteLength;
  }

  return new Blob([buffer], { type: "image/x-icon" });
}

function buildTagsHtml({
  includeBrowserPngs,
  includeApple,
  includeAndroid,
  includeManifest,
}: {
  includeBrowserPngs: boolean;
  includeApple: boolean;
  includeAndroid: boolean;
  includeManifest: boolean;
}): string {
  const lines: string[] = [];
  if (includeBrowserPngs) {
    lines.push(`<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">`);
    lines.push(`<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">`);
  }
  if (includeApple) {
    lines.push(`<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`);
  }
  if (includeManifest) {
    lines.push(`<link rel="manifest" href="/site.webmanifest">`);
  }
  if (includeAndroid) {
    lines.push(`<meta name="theme-color" content="#ffffff">`);
  }
  return `${lines.join("\n")}\n`;
}

function buildManifestJson({
  name,
  includeAndroid,
}: {
  name?: string;
  includeAndroid: boolean;
}): string {
  const appName = name?.trim() || "Website";
  const icons = includeAndroid
    ? [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ]
    : [];

  return JSON.stringify(
    {
      name: appName,
      short_name: appName,
      icons,
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
    },
    null,
    2
  );
}

export async function generateFaviconOutput({
  state,
  appName,
}: {
  state: Partial<FaviconState>;
  appName?: string;
}): Promise<FaviconOutput> {
  const s: FaviconState = { ...DEFAULT_STATE, ...state };
  const images = await buildPngIcons(s);
  const files: ToolOutputFile[] = images.map((img) => ({
    filename: img.filename,
    content: img.blob,
    mimeType: img.mimeType,
  }));

  if (s.includeIco) {
    const icoSources = images
      .filter((img) => img.size === 16 || img.size === 32)
      .sort((a, b) => a.size - b.size);
    if (icoSources.length > 0) {
      const buffers = await Promise.all(
        icoSources.map(async (img) => ({
          size: img.size,
          data: await img.blob.arrayBuffer(),
        }))
      );
      const icoBlob = buildIco(buffers);
      files.push({
        filename: "favicon.ico",
        content: icoBlob,
        mimeType: "image/x-icon",
      });
    }
  }

  const tagsHtml = buildTagsHtml({
    includeBrowserPngs: s.includeBrowserPngs,
    includeApple: s.includeApple,
    includeAndroid: s.includeAndroid,
    includeManifest: s.includeManifest,
  });
  files.push({
    filename: "favicon-tags.html",
    content: tagsHtml,
    mimeType: "text/html",
  });

  if (s.includeManifest) {
    files.push({
      filename: "site.webmanifest",
      content: buildManifestJson({
        name: appName,
        includeAndroid: s.includeAndroid,
      }),
      mimeType: "application/manifest+json",
    });
  }

  const previewItems = images
    .sort((a, b) => a.size - b.size)
    .map(
      (img) => `
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <div style="width:56px;height:56px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(120,120,120,0.2);border-radius:10px;background:#fff;">
            <img src="${img.dataUrl}" alt="${img.filename}" style="width:${Math.min(
        48,
        img.size
      )}px;height:${Math.min(48, img.size)}px;object-fit:contain;" />
          </div>
          <div style="font-size:11px;color:rgba(120,120,120,1);text-align:center;">${
            img.size
          }px</div>
        </div>
      `
    )
    .join("");

  const previewHtml = `
    <div style="padding:16px;">
      <div style="display:flex;flex-wrap:wrap;gap:12px;">
        ${previewItems || ""}
      </div>
      <div style="margin-top:16px;">
        <div style="font-size:12px;color:rgba(120,120,120,1);margin-bottom:6px;">HTML tags</div>
        <pre style="margin:0;white-space:pre-wrap;word-break:break-word;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:12px;line-height:1.5;">${escapeHtml(
          tagsHtml
        )}</pre>
      </div>
    </div>
  `.trim();

  return { files, previewHtml };
}

export async function generateFaviconToolOutput({
  state,
  appName,
}: {
  state: Partial<FaviconState>;
  appName?: string;
}): Promise<ToolOutput> {
  const { files, previewHtml } = await generateFaviconOutput({ state, appName });
  return { type: "files", files, preview: previewHtml };
}
