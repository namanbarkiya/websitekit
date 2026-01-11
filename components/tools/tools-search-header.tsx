"use client";

import { FilterIcon, SearchIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SortMode = "relevance" | "az" | "category";

interface ToolsSearchHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  sortMode: SortMode;
  onSortModeChange: (mode: SortMode) => void;
  resultCount: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onOpenMobileFilters: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function ToolsSearchHeader({
  query,
  onQueryChange,
  sortMode,
  onSortModeChange,
  resultCount,
  hasActiveFilters,
  onResetFilters,
  onOpenMobileFilters,
  inputRef,
}: ToolsSearchHeaderProps) {
  return (
    <div className="sticky -top-6 z-10 border-b bg-background/80 backdrop-blur -mx-6 -mt-6">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Browse tools</h1>
            <p className="text-muted-foreground">
              Search by name, category, or keyword. Jump in with{" "}
              <kbd className="rounded border px-1 font-mono text-xs">/</kbd>{" "}
              or{" "}
              <kbd className="rounded border px-1 font-mono text-xs">⌘K</kbd>.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-muted-foreground tabular-nums">
              {resultCount} results
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
          <div className="relative flex-1 min-w-0 md:min-w-[360px]">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder='Search: "meta", "qr", "security headers"…'
              className="pl-9 pr-10"
            />
            {query.trim() ? (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
                title="Clear"
              >
                <XIcon className="size-4" />
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end md:flex-nowrap md:shrink-0">
            <Tabs
              value={sortMode}
              onValueChange={(v) => onSortModeChange(v as SortMode)}
            >
              <TabsList className="w-auto">
                <TabsTrigger value="relevance">Smart</TabsTrigger>
                <TabsTrigger value="az">A–Z</TabsTrigger>
                <TabsTrigger value="category">Category</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              type="button"
              variant="outline"
              className="lg:hidden gap-2"
              onClick={onOpenMobileFilters}
            >
              <FilterIcon className="size-4" />
              Filters
            </Button>

            <Button
              type="button"
              variant="outline"
              className="lg:hidden gap-2"
              onClick={onOpenMobileFilters}
            >
              Filters
            </Button>
          </div>
        </div>

        {hasActiveFilters ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 gap-2"
              onClick={onResetFilters}
            >
              <XIcon className="size-4" />
              Reset
            </Button>
            <span className="text-xs text-muted-foreground tabular-nums">
              {resultCount} results
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
