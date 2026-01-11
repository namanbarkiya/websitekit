"use client";

import { useMemo } from "react";

import type { SidebarNavCategory, SidebarNavItem } from "@/config/sidebar";
import { searchTools } from "@/lib/utils/search";

type SortMode = "relevance" | "az" | "category";
type Availability = "live" | "soon";

interface UseToolsSearchParams {
  allTools: SidebarNavItem[];
  categories: SidebarNavCategory[];
  query: string;
  selectedCategories: Set<string>;
  availability: Availability;
  showBadges: Set<NonNullable<SidebarNavItem["badge"]>>;
  showMostUsedOnly: boolean;
  sortMode: SortMode;
}

export function useToolsSearch({
  allTools,
  categories,
  query,
  selectedCategories,
  availability,
  showBadges,
  showMostUsedOnly,
  sortMode,
}: UseToolsSearchParams) {
  const filtered = useMemo(() => {
    const categoryFilterActive = selectedCategories.size > 0;

    const applyCommonFilters = (items: SidebarNavItem[]) =>
      items
        .filter((t) => (availability === "live" ? !t.locked : true))
        .filter((t) =>
          showBadges.size > 0
            ? t.badge
              ? showBadges.has(t.badge)
              : false
            : true
        )
        .filter((t) => (showMostUsedOnly ? Boolean(t.mostUsed) : true))
        .filter((t) =>
          categoryFilterActive ? selectedCategories.has(t.category || "") : true
        );

    if (query.trim()) {
      const results = searchTools(query)
        .filter((r) => r.href.startsWith("/tools"))
        .map((r) => ({
          title: r.title,
          href: r.href,
          icon: r.icon,
          description: r.description,
          keywords: r.keywords,
          category: r.category,
          locked: r.locked,
          badge: r.badge,
          mostUsed: r.mostUsed,
          __score: r.score,
        })) as (SidebarNavItem & { __score?: number })[];

      const out = applyCommonFilters(results);
      return sortMode === "az"
        ? [...out].sort((a, b) => a.title.localeCompare(b.title))
        : sortMode === "category"
          ? [...out].sort((a, b) =>
              `${a.category ?? ""}${a.title}`.localeCompare(
                `${b.category ?? ""}${b.title}`
              )
            )
          : out;
    }

    const out = applyCommonFilters(allTools);
    if (sortMode === "az")
      return [...out].sort((a, b) => a.title.localeCompare(b.title));
    if (sortMode === "category")
      return [...out].sort((a, b) =>
        `${a.category ?? ""}${a.title}`.localeCompare(
          `${b.category ?? ""}${b.title}`
        )
      );
    return out;
  }, [
    allTools,
    availability,
    query,
    selectedCategories,
    showBadges,
    showMostUsedOnly,
    sortMode,
  ]);

  const grouped = useMemo(() => {
    const map = new Map<string, SidebarNavItem[]>();
    for (const item of filtered) {
      const cat = item.category || "Other";
      const arr = map.get(cat) ?? [];
      arr.push(item);
      map.set(cat, arr);
    }
    return categories
      .map((c) => ({
        title: c.title,
        icon: c.icon,
        items: map.get(c.title) ?? [],
      }))
      .filter((g) => g.items.length > 0);
  }, [filtered, categories]);

  return { filtered, grouped };
}
