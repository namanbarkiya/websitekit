/**
 * Preload Hints Tool Types
 *
 * Type definitions for the Preload Hints tool state and configuration.
 */

export type ResourceHintType = "preload" | "preconnect" | "prefetch" | "dns-prefetch";

export type CrossOrigin = "anonymous" | "use-credentials";

export type AsType =
  | "script"
  | "style"
  | "image"
  | "font"
  | "audio"
  | "video"
  | "document"
  | "embed"
  | "fetch"
  | "object"
  | "track"
  | "worker";

export interface ResourceHint {
  id: string;
  type: ResourceHintType;
  href: string;
  as?: AsType;
  crossorigin?: CrossOrigin;
  typeAttr?: string; // For preload, e.g., "text/css", "application/javascript"
  media?: string; // For preload, e.g., "(max-width: 600px)"
}

export interface PreloadState {
  hints: ResourceHint[];
}

export const DEFAULT_STATE: PreloadState = {
  hints: [],
};
