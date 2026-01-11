"use client";

import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SidebarNavCategory, SidebarNavItem } from "@/config/sidebar";

import { ToolRow } from "./tool-row";

type SortMode = "relevance" | "az" | "category";

interface ToolsResultsProps {
  filtered: SidebarNavItem[];
  grouped: Array<{ title: string; icon: React.ComponentType<{ className?: string }>; items: SidebarNavItem[] }>;
  sortMode: SortMode;
  query: string;
  onQueryChange: (query: string) => void;
}

export function ToolsResults({
  filtered,
  grouped,
  sortMode,
  query,
  onQueryChange,
}: ToolsResultsProps) {
  if (filtered.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted">
          <SearchIcon className="size-5 text-muted-foreground" />
        </div>
        <h2 className="mt-4 font-semibold">No matches</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Try a different keyword, remove filters, or browse by category.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {["meta", "qr", "sitemap", "security"].map((s) => (
            <Button
              key={s}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onQueryChange(s)}
              className="h-8"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (sortMode === "az") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((t) => (
          <ToolRow key={t.href} item={t} query={query} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {grouped.map((group) => (
        <section key={group.title}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <group.icon className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold">{group.title}</h2>
              <p className="text-xs text-muted-foreground tabular-nums">
                {group.items.filter((i) => !i.locked).length}/{group.items.length}{" "}
                live
              </p>
            </div>
            <span className="ml-auto text-xs text-muted-foreground tabular-nums">
              {group.items.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {group.items.map((t) => (
              <ToolRow key={t.href} item={t} query={query} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
