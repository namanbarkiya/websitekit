"use client";

import Link from "next/link";
import { LockIcon } from "lucide-react";

import { sidebarConfig } from "@/config/sidebar";

const categoryColors: Record<string, { color: string; bg: string }> = {
  "Setup & Identity": {
    color: "text-primary",
    bg: "bg-primary",
  },
  "SEO & Discoverability": {
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500",
  },
  "Social & Branding": {
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-500",
  },
  Performance: {
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500",
  },
  Security: {
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500",
  },
  Utilities: {
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-500",
  },
};

interface ToolsSectionProps {
  unlockedToolsCount: number;
  liveNowTools: (typeof sidebarConfig.categories)[number]["items"];
}

export function ToolsSection({
  unlockedToolsCount,
  liveNowTools,
}: ToolsSectionProps) {
  return (
    <section className="py-8">
      <div className="flex items-baseline justify-between mb-12">
        <h2 className="text-3xl font-bold">Tools</h2>
        <span className="text-sm text-muted-foreground tabular-nums">
          {unlockedToolsCount} available
        </span>
      </div>

      {/* Live now */}
      <div className="mb-14">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="text-lg font-semibold inline-flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Live now
          </h3>
          <Link
            href="/tools"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          {liveNowTools.map((item) => {
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-4 py-3 transition-all hover:translate-x-1"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ItemIcon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium mb-0.5 group-hover:text-primary">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="space-y-16">
        {sidebarConfig.categories.map((category) => {
          const colors = categoryColors[category.title] || {
            color: "text-gray-600",
            bg: "bg-gray-500",
          };
          const unlockedCount = category.items.filter(
            (item) => !item.locked
          ).length;

          return (
            <div key={category.title}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`size-1.5 rounded-full ${colors.bg}`} />
                <h3
                  className={`text-sm font-semibold uppercase tracking-wider ${colors.color}`}
                >
                  {category.title}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {unlockedCount}/{category.items.length}
                </span>
              </div>

              {/* Tools Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                {category.items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.locked ? "#" : item.href}
                      onClick={(e) => item.locked && e.preventDefault()}
                      className={`group flex items-start gap-4 py-3 transition-all ${
                        item.locked
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:translate-x-1"
                      }`}
                    >
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          item.locked
                            ? "bg-muted"
                            : "bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground"
                        }`}
                      >
                        {item.locked ? (
                          <LockIcon className="size-4" />
                        ) : (
                          <ItemIcon className="size-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium mb-0.5 ${
                            item.locked ? "" : "group-hover:text-primary"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
