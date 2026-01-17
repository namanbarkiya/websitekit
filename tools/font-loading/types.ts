/**
 * Font Loading Tool Types
 *
 * Type definitions for the Font Loading tool state and configuration.
 */

export type FontDisplay =
  | "auto"
  | "block"
  | "swap"
  | "fallback"
  | "optional";

export interface FontFace {
  id: string;
  fontFamily: string;
  src: string; // URL or local font name
  fontWeight?: string;
  fontStyle?: string;
  fontDisplay?: FontDisplay;
  unicodeRange?: string;
}

export interface FontLoadingState {
  fonts: FontFace[];
  includePreload: boolean;
  includeFontDisplay: boolean;
  defaultFontDisplay: FontDisplay;
}

export const DEFAULT_STATE: FontLoadingState = {
  fonts: [],
  includePreload: true,
  includeFontDisplay: true,
  defaultFontDisplay: "swap",
};
