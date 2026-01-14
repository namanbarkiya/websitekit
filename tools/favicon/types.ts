export interface FaviconState {
  /** Data URL for the source image */
  sourceImage: string;
  /** Background color behind transparent icons */
  backgroundColor: string;
  /** Use transparent background */
  transparentBackground: boolean;
  /** Padding around the logo inside the icon (0-40%) */
  paddingPercent: number;
  /** Include favicon.ico */
  includeIco: boolean;
  /** Include PNG browser icons */
  includeBrowserPngs: boolean;
  /** Include Apple touch icon */
  includeApple: boolean;
  /** Include Android icons */
  includeAndroid: boolean;
  /** Include site.webmanifest */
  includeManifest: boolean;
}

export const DEFAULT_STATE: FaviconState = {
  sourceImage: "",
  backgroundColor: "#ffffff",
  transparentBackground: true,
  paddingPercent: 0,
  includeIco: true,
  includeBrowserPngs: true,
  includeApple: true,
  includeAndroid: true,
  includeManifest: true,
};
