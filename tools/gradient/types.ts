export type GradientType = "linear" | "radial";

export interface GradientStop {
  color: string; // hex
  position: number; // 0-100 (%)
}

export interface GradientState {
  type: GradientType;
  /** Used only when type === "linear" */
  angle: number; // degrees
  /** Used only when type === "radial" (0-100%) */
  radialX: number;
  /** Used only when type === "radial" (0-100%) */
  radialY: number;
  stops: GradientStop[];
  /** Optional: include a background fallback color */
  includeFallback: boolean;
}

export const DEFAULT_STATE: GradientState = {
  type: "linear",
  angle: 135,
  radialX: 50,
  radialY: 50,
  stops: [
    { color: "#3b82f6", position: 0 },
    { color: "#a855f7", position: 100 },
  ],
  includeFallback: true,
};
