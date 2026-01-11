"use client";

import { useEffect, useState } from "react";

import type { SidebarNavItem } from "@/config/sidebar";

const RECENTS_STORAGE_KEY = "websitekit-recent-tools";

export function useRecentTools(allTools: SidebarNavItem[]) {
  const [recents, setRecents] = useState<SidebarNavItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENTS_STORAGE_KEY);
      if (!raw) return;
      const hrefs: unknown = JSON.parse(raw);
      if (!Array.isArray(hrefs)) return;
      const map = new Map(allTools.map((t) => [t.href, t]));
      const items = hrefs
        .map((h) => (typeof h === "string" ? map.get(h) : undefined))
        .filter(Boolean) as SidebarNavItem[];
      const next = items.slice(0, 6);
      // Avoid synchronous setState directly inside the effect body.
      Promise.resolve().then(() => setRecents(next));
    } catch {
      // ignore
    }
  }, [allTools]);

  return recents;
}
