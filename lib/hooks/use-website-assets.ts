/**
 * Website Asset Hooks
 *
 * Hooks for tools to access website assets (read-only)
 */

import { useAssetStore } from "@/lib/store/asset-store";
import type { WebsiteAssets } from "@/lib/store/asset-store";

/**
 * Hook for tools to read website assets
 * Returns read-only assets that tools can use as defaults
 *
 * @example
 * ```tsx
 * const assets = useWebsiteAssets();
 * const title = assets.name || "My Website";
 * ```
 */
export function useWebsiteAssets(): Readonly<WebsiteAssets> {
  const store = useAssetStore();

  // Return read-only version
  return {
    name: store.name,
    domain: store.domain,
    description: store.description,
    primaryColor: store.primaryColor,
    logo: store.logo,
  };
}

/**
 * Hook to check if assets have been configured
 */
export function useHasAssets(): boolean {
  return useAssetStore((state) => state.hasAssets());
}
