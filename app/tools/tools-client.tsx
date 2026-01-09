"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckIcon,
  FilterIcon,
  FlameIcon,
  LockIcon,
  SearchIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sidebarConfig,
  type SidebarNavCategory,
  type SidebarNavItem,
} from "@/config/sidebar";
import { cn } from "@/lib/utils/cn";
import { searchTools } from "@/lib/utils/search";

type SortMode = "relevance" | "az" | "category";
type Availability = "live" | "soon";

const RECENTS_STORAGE_KEY = "websitekit-recent-tools";

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const tokens = q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  if (tokens.length === 0) return <>{text}</>;
  const pattern = tokens.map(escapeRegExp).join("|");
  const re = new RegExp(`(${pattern})`, "ig");
  const parts = text.split(re);
  return (
    <>
      {parts.map((part, idx) => {
        const isMatch = new RegExp(`^(${pattern})$`, "i").test(part);
        return isMatch ? (
          <mark
            key={`${idx}:${part}`}
            className="rounded bg-primary/15 px-1 py-0.5 text-foreground"
          >
            {part}
          </mark>
        ) : (
          <span key={`${idx}:${part}`}>{part}</span>
        );
      })}
    </>
  );
}

function ToolRow({ item, query }: { item: SidebarNavItem; query: string }) {
  const Icon = item.icon;
  const locked = Boolean(item.locked);

  const badge =
    item.badge === "new"
      ? { label: "New", variant: "default" as const }
      : item.badge === "beta"
        ? { label: "Beta", variant: "secondary" as const }
        : item.badge === "soon"
          ? { label: "Soon", variant: "outline" as const }
          : null;

  const content = (
    <div
      className={cn(
        "group flex items-start gap-4 rounded-xl border bg-card p-4 transition-all",
        locked
          ? "opacity-50 cursor-not-allowed"
          : "hover:-translate-y-0.5 hover:shadow-md"
      )}
    >
      <div
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors",
          locked
            ? "bg-muted"
            : "bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground"
        )}
      >
        {locked ? <LockIcon className="size-4" /> : <Icon className="size-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium leading-5 truncate">
            <Highlight text={item.title} query={query} />
          </p>
          {badge ? (
            <span
              className={cn(
                "text-[10px] rounded px-1.5 py-0.5 border",
                badge.variant === "default" &&
                  "bg-primary text-primary-foreground border-transparent",
                badge.variant === "secondary" &&
                  "bg-secondary text-secondary-foreground border-transparent",
                badge.variant === "outline" && "text-muted-foreground"
              )}
            >
              {badge.label}
            </span>
          ) : null}
          {locked && !badge ? (
            <span className="text-[10px] rounded px-1.5 py-0.5 border text-muted-foreground">
              Soon
            </span>
          ) : null}
        </div>
        {item.description ? (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            <Highlight text={item.description} query={query} />
          </p>
        ) : null}
        {item.category ? (
          <p className="text-[11px] text-muted-foreground/80 mt-2">
            {item.category}
          </p>
        ) : null}
      </div>
    </div>
  );

  return locked ? (
    <div aria-disabled="true">{content}</div>
  ) : (
    <Link href={item.href} className="block">
      {content}
    </Link>
  );
}

function FiltersPanel({
  categories,
  selectedCategories,
  onToggleCategory,
  availability,
  setAvailability,
  showBadges,
  setShowBadges,
  showMostUsedOnly,
  setShowMostUsedOnly,
}: {
  categories: SidebarNavCategory[];
  selectedCategories: Set<string>;
  onToggleCategory: (title: string) => void;
  availability: Availability;
  setAvailability: (v: Availability) => void;
  showBadges: Set<NonNullable<SidebarNavItem["badge"]>>;
  setShowBadges: (next: Set<NonNullable<SidebarNavItem["badge"]>>) => void;
  showMostUsedOnly: boolean;
  setShowMostUsedOnly: (v: boolean) => void;
}) {
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
  const [recents, setRecents] = useState<SidebarNavItem[]>([]);

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

  // Load recent tools from localStorage
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

  // Keyboard shortcuts: "/" or Cmd/Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      const key = e.key.toLowerCase();
      const cmdK = (e.metaKey || e.ctrlKey) && key === "k";
      const slash = e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey;
      if ((cmdK || slash) && !inEditable) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (key === "escape" && document.activeElement === inputRef.current) {
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const onToggleCategory = (title: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

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

  const hasActiveFilters =
    Boolean(query.trim()) ||
    selectedCategories.size > 0 ||
    availability !== "soon" ||
    showBadges.size > 0 ||
    showMostUsedOnly;

  return (
    <div className="min-h-full">
      {/* Sticky search header */}
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
                {filtered.length} results
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
            <div className="relative flex-1 min-w-0 md:min-w-[360px]">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search: "meta", "qr", "security headers"…'
                className="pl-9 pr-10"
              />
              {query.trim() ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
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
                onValueChange={(v) => setSortMode(v as SortMode)}
              >
                <TabsList className="w-auto">
                  <TabsTrigger value="relevance">Smart</TabsTrigger>
                  <TabsTrigger value="az">A–Z</TabsTrigger>
                  <TabsTrigger value="category">Category</TabsTrigger>
                </TabsList>
              </Tabs>

              <Sheet
                open={mobileFiltersOpen}
                onOpenChange={setMobileFiltersOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="lg:hidden gap-2"
                  >
                    <FilterIcon className="size-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="p-4">
                    <FiltersPanel
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
          </div>

          {hasActiveFilters ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 gap-2"
                onClick={() => {
                  setQuery("");
                  setSelectedCategories(new Set());
                  setAvailability("soon");
                  setShowBadges(new Set());
                  setShowMostUsedOnly(false);
                }}
              >
                <XIcon className="size-4" />
                Reset
              </Button>
              <span className="text-xs text-muted-foreground tabular-nums">
                {filtered.length} results
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Desktop filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-44">
              <Card className="p-4">
                <FiltersPanel
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
              <div className="space-y-6">
                {recents.length > 0 ? (
                  <section>
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Recent
                      </h2>
                      <span className="text-xs text-muted-foreground">
                        Stored locally
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {recents.map((t) => (
                        <ToolRow key={t.href} item={t} query={query} />
                      ))}
                    </div>
                  </section>
                ) : null}

                {mostUsed.length > 0 ? (
                  <section>
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Live now
                      </h2>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {mostUsed.length} tools
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {mostUsed.slice(0, 6).map((t) => (
                        <ToolRow key={t.href} item={t} query={query} />
                      ))}
                    </div>
                  </section>
                ) : null}

                <Separator className="my-6" />
              </div>
            ) : null}

            {/* Results */}
            {filtered.length === 0 ? (
              <div className="rounded-xl border bg-card p-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted">
                  <SearchIcon className="size-5 text-muted-foreground" />
                </div>
                <h2 className="mt-4 font-semibold">No matches</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Try a different keyword, remove filters, or browse by
                  category.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {["meta", "qr", "sitemap", "security"].map((s) => (
                    <Button
                      key={s}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setQuery(s)}
                      className="h-8"
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {sortMode === "az" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filtered.map((t) => (
                      <ToolRow key={t.href} item={t} query={query} />
                    ))}
                  </div>
                ) : (
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
                              {group.items.filter((i) => !i.locked).length}/
                              {group.items.length} live
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
                )}
              </>
            )}

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
    </div>
  );
}
