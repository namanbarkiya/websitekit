/**
 * Website Asset Store
 *
 * Zustand store for managing global website assets.
 * Assets are persisted to localStorage and are read-only for tools.
 */

import { persist } from "zustand/middleware";
import { create } from "zustand";

/**
 * Website Asset Types
 */
export interface WebsiteAssets {
  /** Website name/title */
  name: string;
  /** Website domain (e.g., "example.com") */
  domain: string;
  /** Website description */
  description: string;
  /** Primary brand color (hex format, e.g., "#3b82f6") */
  primaryColor: string;
  /** Logo image (base64 data URL or blob URL) */
  logo: string | null;
}

export const DEFAULT_ASSETS: WebsiteAssets = {
  name: "",
  domain: "",
  description: "",
  primaryColor: "#3b82f6",
  logo: null,
};

/**
 * LocalStorage key for persisting website assets
 */
export const ASSETS_STORAGE_KEY = "websitekit-assets";

/**
 * Asset Store Interface
 */
export interface AssetStore extends WebsiteAssets {
  /**
   * Update website assets
   * This is the ONLY way to modify assets (via Asset Modal)
   */
  updateAssets: (assets: Partial<WebsiteAssets>) => void;

  /**
   * Reset assets to defaults
   */
  resetAssets: () => void;

  /**
   * Check if assets have been set (not just defaults)
   */
  hasAssets: () => boolean;
}

export const useAssetStore = create<AssetStore>()(
  persist(
    (set, get) => ({
      // Initial state (will be hydrated from localStorage by persist middleware)
      ...DEFAULT_ASSETS,

      updateAssets: (assets) => {
        set((state) => ({
          ...state,
          ...assets,
        }));
      },

      resetAssets: () => {
        set(DEFAULT_ASSETS);
      },

      hasAssets: () => {
        const state = get();
        return (
          state.name.trim() !== "" ||
          state.domain.trim() !== "" ||
          state.description.trim() !== ""
        );
      },
    }),
    {
      name: ASSETS_STORAGE_KEY,
      // Only persist specific fields (exclude methods)
      partialize: (state) => ({
        name: state.name,
        domain: state.domain,
        description: state.description,
        primaryColor: state.primaryColor,
        logo: state.logo,
      }),
    }
  )
);
