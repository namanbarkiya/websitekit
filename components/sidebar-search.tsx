"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockIcon, SearchIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils/cn";
import { searchTools, type SearchResult } from "@/lib/utils/search";

export function SidebarSearch() {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const { state, isMobile, setOpen } = useSidebar();

  const results = React.useMemo(() => searchTools(query), [query]);

  // Reset selection when results change
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Escape") {
        setQuery("");
        inputRef.current?.blur();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected && !selected.locked) {
          router.push(selected.href);
          setQuery("");
          setIsOpen(false);
          inputRef.current?.blur();
        }
        break;
      case "Escape":
        e.preventDefault();
        setQuery("");
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.locked) return;
    router.push(result.href);
    setQuery("");
    setIsOpen(false);
  };

  // In collapsed (icon) mode, render a compact icon button
  if (!isMobile && state === "collapsed") {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          setOpen(true);
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
      >
        <SearchIcon />
        <span className="sr-only">Search</span>
      </Button>
    );
  }

  return (
    <div className="relative">
      <SearchIcon className="text-muted-foreground pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 z-10" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search tools…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          // Delay to allow click on results
          setTimeout(() => setIsOpen(false), 150);
        }}
        onKeyDown={handleKeyDown}
        className="bg-background h-8 w-full pl-9 shadow-none"
        data-slot="sidebar-input"
        data-sidebar="input"
      />

      {/* Search Results Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[300px] overflow-auto rounded-md border bg-popover p-1 shadow-md">
          {results.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No tools found for "{query}"
            </div>
          ) : (
            <ul className="space-y-0.5">
              {results.map((result, index) => {
                const Icon = result.icon;
                const isSelected = index === selectedIndex;
                const isLocked = result.locked;

                return (
                  <li key={result.href}>
                    <button
                      type="button"
                      onClick={() => handleResultClick(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      disabled={isLocked}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-sm px-2 py-2 text-left text-sm transition-colors",
                        isSelected &&
                          !isLocked &&
                          "bg-accent text-accent-foreground",
                        isLocked && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <Icon className="mt-0.5 size-4 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {result.title}
                          </span>
                          {result.badge === "soon" && (
                            <Badge
                              variant="outline"
                              className="h-4 px-1 text-[9px] font-normal"
                            >
                              Soon
                            </Badge>
                          )}
                          {isLocked && !result.badge && (
                            <LockIcon className="size-3 opacity-50" />
                          )}
                        </div>
                        {result.description && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {result.description}
                          </p>
                        )}
                        {result.category && (
                          <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                            {result.category}
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Keyboard hint */}
          <div className="border-t mt-1 pt-1 px-2 pb-1">
            <p className="text-[10px] text-muted-foreground">
              <kbd className="rounded border px-1 font-mono">↑↓</kbd> navigate{" "}
              <kbd className="rounded border px-1 font-mono">↵</kbd> select{" "}
              <kbd className="rounded border px-1 font-mono">esc</kbd> close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
