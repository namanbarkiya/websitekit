/* eslint-disable react/jsx-key */
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BotIcon,
  GaugeIcon,
  HeartIcon,
  PaletteIcon,
  ShieldIcon,
  SparklesIcon,
} from "lucide-react";

import { AssetModal } from "@/components/asset-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { sidebarConfig } from "@/config/sidebar";

const categoryMeta: Record<
  string,
  { icon: any; color: string; accent: string }
> = {
  "Setup & Identity": {
    icon: PaletteIcon,
    color: "text-primary",
    accent: "bg-primary/10",
  },
  "SEO & Discoverability": {
    icon: BotIcon,
    color: "text-blue-600 dark:text-blue-400",
    accent: "bg-blue-500/10",
  },
  "Social & Branding": {
    icon: HeartIcon,
    color: "text-pink-600 dark:text-pink-400",
    accent: "bg-pink-500/10",
  },
  Performance: {
    icon: GaugeIcon,
    color: "text-emerald-600 dark:text-emerald-400",
    accent: "bg-emerald-500/10",
  },
  Security: {
    icon: ShieldIcon,
    color: "text-violet-600 dark:text-violet-400",
    accent: "bg-violet-500/10",
  },
  Utilities: {
    icon: SparklesIcon,
    color: "text-yellow-600 dark:text-yellow-400",
    accent: "bg-yellow-500/10",
  },
};

export default function ToolsDashboardPage() {
  const [assetModalOpen, setAssetModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tools</h1>
          <p className="text-muted-foreground">
            Browse all website setup and optimization tools.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setAssetModalOpen(true)}
          className="gap-2"
        >
          <PaletteIcon className="size-4" />
          Set Website Assets
        </Button>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-10">
        {sidebarConfig.categories.map((category) => {
          const meta = categoryMeta[category.title] || {
            icon: SparklesIcon,
            color: "text-gray-600",
            accent: "bg-muted",
          };
          const UnlockedIcon = meta.icon;
          const unlockedCount = category.items.filter(
            (item) => !item.locked
          ).length;

          return (
            <section key={category.title} className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`size-2 rounded-full ${meta.color.replace(
                    "text-",
                    "bg-"
                  )}`}
                />
                <h2
                  className={`text-sm font-semibold uppercase tracking-wider ${meta.color}`}
                >
                  {category.title}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {unlockedCount}/{category.items.length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item) => (
                  <Card
                    key={item.href}
                    className="group relative p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${meta.accent}`}
                      >
                        <UnlockedIcon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{item.title}</h3>
                          {item.badge && (
                            <span className="text-[10px] rounded px-1.5 py-0.5 border text-muted-foreground">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                        <div className="mt-3">
                          {item.locked ? (
                            <span className="text-xs text-muted-foreground">
                              Coming soon
                            </span>
                          ) : (
                            <Link
                              href={item.href}
                              className="text-sm text-primary hover:underline"
                            >
                              Open →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <AssetModal open={assetModalOpen} onOpenChange={setAssetModalOpen} />
    </div>
  );
}

