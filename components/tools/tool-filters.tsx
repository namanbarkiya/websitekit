"use client";

import { FlameIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type {
  SidebarNavCategory,
  SidebarNavItem,
} from "@/config/sidebar";

type Availability = "live" | "soon";

interface ToolFiltersProps {
  categories: SidebarNavCategory[];
  selectedCategories: Set<string>;
  onToggleCategory: (title: string) => void;
  availability: Availability;
  setAvailability: (v: Availability) => void;
  showBadges: Set<NonNullable<SidebarNavItem["badge"]>>;
  setShowBadges: (next: Set<NonNullable<SidebarNavItem["badge"]>>) => void;
  showMostUsedOnly: boolean;
  setShowMostUsedOnly: (v: boolean) => void;
}

export function ToolFilters({
  categories,
  selectedCategories,
  onToggleCategory,
  availability,
  setAvailability,
  showBadges,
  setShowBadges,
  showMostUsedOnly,
  setShowMostUsedOnly,
}: ToolFiltersProps) {
  const toggleBadge = (b: NonNullable<SidebarNavItem["badge"]>) => {
    const next = new Set(showBadges);
    if (next.has(b)) next.delete(b);
    else next.add(b);
    setShowBadges(next);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Availability
        </p>
        <div className="inline-flex rounded-lg border bg-muted p-1">
          <button
            type="button"
            onClick={() => setAvailability("live")}
            className={cn(
              "px-3 py-1.5 text-sm rounded-md transition-colors",
              availability === "live"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Live
          </button>
          <button
            type="button"
            onClick={() => setAvailability("soon")}
            className={cn(
              "px-3 py-1.5 text-sm rounded-md transition-colors",
              availability === "soon"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Include soon
          </button>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Badges
        </p>
        <div className="flex flex-wrap gap-2">
          {(["new", "beta", "soon"] as const).map((b) => (
            <Button
              key={b}
              type="button"
              variant={showBadges.has(b) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleBadge(b)}
              className="h-8"
            >
              {b.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Collections
        </p>
        <Button
          type="button"
          variant={showMostUsedOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setShowMostUsedOnly(!showMostUsedOnly)}
          className="h-8 gap-2"
        >
          <FlameIcon className="size-4" />
          Most used
        </Button>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Categories
        </p>
        <div className="space-y-1">
          {categories.map((c) => {
            const active = selectedCategories.has(c.title);
            const liveCount = c.items.filter((it) => !it.locked).length;
            return (
              <button
                key={c.title}
                type="button"
                onClick={() => onToggleCategory(c.title)}
                className={cn(
                  "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                )}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <c.icon className="size-4 shrink-0" />
                  <span className="truncate">{c.title}</span>
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {liveCount}/{c.items.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
