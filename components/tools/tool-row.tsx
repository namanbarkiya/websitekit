"use client";

import Link from "next/link";
import { LockIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { SidebarNavItem } from "@/config/sidebar";

import { ToolHighlight } from "./tool-highlight";

interface ToolRowProps {
  item: SidebarNavItem;
  query: string;
}

export function ToolRow({ item, query }: ToolRowProps) {
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
            <ToolHighlight text={item.title} query={query} />
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
            <ToolHighlight text={item.description} query={query} />
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
