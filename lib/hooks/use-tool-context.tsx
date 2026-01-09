/**
 * Tool Context Hook
 *
 * Provides website assets to tools as read-only context
 */

"use client";

import { createContext, useContext } from "react";

import type { WebsiteAssets } from "@/lib/store/asset-store";

export interface ToolContextValue {
  /** Website assets (read-only) */
  assets: Readonly<WebsiteAssets>;
}

const ToolContext = createContext<ToolContextValue | undefined>(undefined);

export interface ToolProviderProps {
  assets: Readonly<WebsiteAssets>;
  children: React.ReactNode;
}

/**
 * Tool context provider
 */
export function ToolProvider({ assets, children }: ToolProviderProps) {
  return (
    <ToolContext.Provider value={{ assets }}>{children}</ToolContext.Provider>
  );
}

/**
 * Hook to access tool context
 */
export function useToolContext(): ToolContextValue {
  const context = useContext(ToolContext);
  if (!context) {
    throw new Error("useToolContext must be used within ToolProvider");
  }
  return context;
}
