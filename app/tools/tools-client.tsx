"use client";

import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckIcon, SparklesIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  sidebarConfig,
  type SidebarNavItem,
} from "@/config/sidebar";
import { useRecentTools } from "@/lib/hooks/use-recent-tools";
import { useSearchKeyboardShortcuts } from "@/lib/hooks/use-search-keyboard-shortcuts";
import { useToolsSearch } from "@/lib/hooks/use-tools-search";
import { ToolFilters } from "@/components/tools/tool-filters";
import { ToolsSearchHeader } from "@/components/tools/tools-search-header";
import { ToolsResults } from "@/components/tools/tools-results";
import { ToolsQuickPicks } from "@/components/tools/tools-quick-picks";

type SortMode = "relevance" | "az" | "category";
type Availability = "live" | "soon";


export function ToolsClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => new Set()
  );
  const [availability, setAvailability] = useState<Availability>("soon");
  const [showBadges, setShowBadges] = useState<
    Set<NonNullable<SidebarNavItem["badge"]>>
  >(() => new Set());
  const [sortMode, setSortMode] = useState<SortMode>("relevance");
  const [showMostUsedOnly, setShowMostUsedOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categories = sidebarConfig.categories;
  const allTools: SidebarNavItem[] = useMemo(
    () =>
      categories.flatMap((cat) =>
        cat.items.map((it) => ({ ...it, category: cat.title }))
      ),
    [categories]
  );

  const mostUsed = useMemo(
    () => allTools.filter((t) => t.mostUsed && !t.locked),
    [allTools]
  );

  const recents = useRecentTools(allTools);
  useSearchKeyboardShortcuts(inputRef, () => setQuery(""));

  const onToggleCategory = (title: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const { filtered, grouped } = useToolsSearch({
    allTools,
    categories,
    query,
    selectedCategories,
    availability,
    showBadges,
    showMostUsedOnly,
    sortMode,
  });

  const hasActiveFilters =
    Boolean(query.trim()) ||
    selectedCategories.size > 0 ||
    availability !== "soon" ||
    showBadges.size > 0 ||
    showMostUsedOnly;

  const handleResetFilters = () => {
    setQuery("");
    setSelectedCategories(new Set());
    setAvailability("soon");
    setShowBadges(new Set());
    setShowMostUsedOnly(false);
  };

  return (
    <div className="min-h-full">
      <ToolsSearchHeader
        query={query}
        onQueryChange={setQuery}
        sortMode={sortMode}
        onSortModeChange={setSortMode}
        resultCount={filtered.length}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        onOpenMobileFilters={() => setMobileFiltersOpen(true)}
        inputRef={inputRef}
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Desktop filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-44">
              <Card className="p-4">
                <ToolFilters
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onToggleCategory={onToggleCategory}
                  availability={availability}
                  setAvailability={setAvailability}
                  showBadges={showBadges}
                  setShowBadges={setShowBadges}
                  showMostUsedOnly={showMostUsedOnly}
                  setShowMostUsedOnly={setShowMostUsedOnly}
                />
              </Card>
            </div>
          </aside>

          <main className="min-w-0">
            {/* Quick picks */}
            {!hasActiveFilters ? (
              <ToolsQuickPicks
                recents={recents}
                mostUsed={mostUsed}
                query={query}
              />
            ) : null}

            {/* Results */}
            <ToolsResults
              filtered={filtered}
              grouped={grouped}
              sortMode={sortMode}
              query={query}
              onQueryChange={setQuery}
            />

            <div className="mt-10 rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <SparklesIcon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground">Pro tips</p>
                  <ul className="mt-1 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckIcon className="size-4 text-emerald-500" />
                      Use multiple keywords: &quot;meta twitter&quot; or
                      &quot;qr png&quot;.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="size-4 text-emerald-500" />
                      Use filters to narrow down &quot;Live&quot; vs
                      &quot;Soon&quot;.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="size-4 text-emerald-500" />
                      Press{" "}
                      <kbd className="rounded border px-1 font-mono text-xs">
                        /
                      </kbd>{" "}
                      anywhere to jump to search.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile filters sheet */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <ToolFilters
              categories={categories}
              selectedCategories={selectedCategories}
              onToggleCategory={onToggleCategory}
              availability={availability}
              setAvailability={setAvailability}
              showBadges={showBadges}
              setShowBadges={setShowBadges}
              showMostUsedOnly={showMostUsedOnly}
              setShowMostUsedOnly={setShowMostUsedOnly}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
