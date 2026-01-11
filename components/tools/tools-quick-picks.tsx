"use client";

import { Separator } from "@/components/ui/separator";
import type { SidebarNavItem } from "@/config/sidebar";

import { ToolRow } from "./tool-row";

interface ToolsQuickPicksProps {
  recents: SidebarNavItem[];
  mostUsed: SidebarNavItem[];
  query: string;
}

export function ToolsQuickPicks({
  recents,
  mostUsed,
  query,
}: ToolsQuickPicksProps) {
  return (
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
  );
}
