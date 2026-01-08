/**
 * Output Utilities
 *
 * Helper functions for handling tool outputs
 */

import type { ToolOutput, ToolOutputFile } from "@/lib/utils/tool-registry";

/**
 * Output format options for rendering
 */
export interface OutputFormatOptions {
  /** Whether to minify output */
  minify?: boolean;
  /** Indentation for formatted output */
  indent?: number;
  /** Line ending style */
  lineEnding?: "lf" | "crlf" | "auto";
}

/**
 * File download options
 */
export interface FileDownloadOptions {
  /** Filename (will be auto-generated if not provided) */
  filename?: string;
  /** MIME type */
  mimeType?: string;
  /** Whether to trigger download */
  download?: boolean;
}

/**
 * Format content with options
 */
export function formatOutput(
  content: string,
  options: OutputFormatOptions = {}
): string {
  let formatted = content;

  if (options.minify) {
    // Basic minification (remove extra whitespace)
    formatted = formatted.replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
  } else {
    // Basic formatting
    if (options.indent !== undefined) {
      const indent = " ".repeat(options.indent);
      // Simple indentation (can be enhanced)
      formatted = formatted
        .split("\n")
        .map((line) => (line.trim() ? indent + line.trim() : ""))
        .filter(Boolean)
        .join("\n");
    }
  }

  // Handle line endings
  if (options.lineEnding && options.lineEnding !== "auto") {
    const eol = options.lineEnding === "crlf" ? "\r\n" : "\n";
    formatted = formatted.replace(/\r\n|\r|\n/g, eol);
  }

  return formatted;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Download a single file
 */
export function downloadFile(
  content: string | Blob,
  options: FileDownloadOptions = {}
): void {
  const blob =
    content instanceof Blob
      ? content
      : new Blob([content], {
          type: options.mimeType || "text/plain",
        });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = options.filename || "download";
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Download multiple files as a ZIP
 * Note: Requires jszip package to be installed (npm install jszip)
 */
export async function downloadFilesAsZip(
  files: ToolOutputFile[]
): Promise<void> {
  // Dynamic import for JSZip (only load when needed)
  try {
    // Try to import JSZip (optional dependency)
    const JSZipModule = await import("jszip");
    const JSZip = JSZipModule.default || JSZipModule;

    if (!JSZip) {
      throw new Error("JSZip not found");
    }

    const zip = new JSZip();

    // Add files to zip
    for (const file of files) {
      let content: string | ArrayBuffer;
      if (file.content instanceof Blob) {
        content = await file.content.arrayBuffer();
      } else if (typeof file.content === "string") {
        content = file.content;
      } else {
        content = file.content;
      }
      zip.file(file.filename, content);
    }

    // Generate zip and download
    const blob = await zip.generateAsync({ type: "blob" });
    downloadFile(blob, {
      filename: "websitekit-outputs.zip",
      mimeType: "application/zip",
    });
  } catch (error) {
    console.error("Failed to create ZIP file:", error);
    // Fallback: download files individually
    throw new Error(
      "ZIP creation failed. Install 'jszip' package for ZIP downloads, or download files individually."
    );
  }
}

/**
 * Get language for syntax highlighting based on output type
 */
export function getSyntaxLanguage(output: ToolOutput): string {
  if (output.type === "html") return "html";
  if (output.type === "json") return "json";
  if (output.type === "text" && output.mimeType?.includes("css")) return "css";
  if (output.type === "text" && output.mimeType?.includes("javascript"))
    return "javascript";
  if (output.type === "text" && output.mimeType?.includes("xml")) return "xml";
  return "text";
}

/**
 * Generate default filename based on output type
 */
export function generateFilename(
  output: ToolOutput,
  toolName?: string
): string {
  if (output.filename) return output.filename;

  const sanitizedName = toolName
    ? toolName.toLowerCase().replace(/\s+/g, "-")
    : "output";

  switch (output.type) {
    case "html":
      return `${sanitizedName}.html`;
    case "json":
      return `${sanitizedName}.json`;
    case "image":
      return `${sanitizedName}.png`;
    case "file":
      return `${sanitizedName}.txt`;
    default:
      return `${sanitizedName}.txt`;
  }
}
