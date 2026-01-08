"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  BotIcon,
  GaugeIcon,
  HammerIcon,
  LockIcon,
  PaletteIcon,
  ShareIcon,
  ShieldIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";

import { AssetForm } from "@/components/asset-form";
import { AssetModal } from "@/components/asset-modal";
import { Button } from "@/components/ui/button";
import { sidebarConfig } from "@/config/sidebar";
import { useHasAssets } from "@/lib/hooks/use-website-assets";

const categoryMeta: Record<
  string,
  { icon: typeof ZapIcon; color: string; bg: string }
> = {
  "Setup & Identity": {
    icon: PaletteIcon,
    color: "text-primary",
    bg: "bg-primary",
  },
  "SEO & Discoverability": {
    icon: BotIcon,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500",
  },
  "Social & Branding": {
    icon: ShareIcon,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-500",
  },
  Performance: {
    icon: GaugeIcon,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500",
  },
  Security: {
    icon: ShieldIcon,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500",
  },
  Utilities: {
    icon: SparklesIcon,
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-500",
  },
};

export default function Home() {
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const hasAssets = useHasAssets();

  const unlockedTools = sidebarConfig.categories.reduce(
    (acc, cat) => acc + cat.items.filter((item) => !item.locked).length,
    0
  );

  const liveNowTools = sidebarConfig.categories
    .flatMap((cat) => cat.items)
    .filter((item) => !item.locked)
    .slice(0, 6);

  return (
    <div className="pb-16 px-4 md:px-6 lg:px-8 overflow-x-hidden">
      {/* Section 1: Head + tagline */}
      <section className="relative py-4 md:py-8">
        {/* Ambient Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 size-[300px] md:size-[500px] rounded-full bg-primary/5 blur-[80px] md:blur-[100px]" />
          <div className="absolute bottom-0 left-0 size-[250px] md:size-[400px] rounded-full bg-primary/5 blur-[60px] md:blur-[80px]" />
        </div>

        <div className="mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-y-14 lg:gap-x-24 items-start">
            <div>
              <div className="inline-flex items-center gap-2 text-sm text-primary mb-4">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                {unlockedTools} tools ready
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  No signup required
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-3">
                Every FREAKN&apos; website tool, in one place.
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Set your website assets once, then generate production-ready
                outputs (meta tags, favicons, sitemaps, headers) in seconds.
              </p>

              <div className="mt-4 flex items-center gap-3">
                <Button asChild className="group relative overflow-hidden gap-2 group-hover:animate-[wk-button-shake_450ms_ease-in-out_both]">
                  <Link href="/tools" className="inline-flex items-center gap-2">
                    <span className="inline-flex origin-bottom-left group-hover:animate-[wk-hammer-swing_450ms_ease-in-out_both]">
                      <HammerIcon className="size-4" />
                    </span>
                    <span className="relative">
                      Browse tools
                      {/* "Crack/impact" overlay */}
                      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:animate-[wk-crack-flash_450ms_ease-out_both]">
                        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_60%,rgba(255,255,255,0.45),transparent_60%)]" />
                        <span className="absolute left-1/2 top-1/2 h-px w-10 -translate-x-1/2 -translate-y-1/2 rotate-12 bg-primary-foreground/70 mix-blend-overlay" />
                        <span className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 -translate-y-1/2 -rotate-18 bg-primary-foreground/70 mix-blend-overlay" />
                      </span>
                    </span>
                    <span className="inline-flex transition-transform group-hover:translate-x-0.5">
                      <ArrowRightIcon className="size-4" />
                    </span>
                  </Link>
                </Button>
                {hasAssets ? (
                  <Button
                    variant="outline"
                    onClick={() => setAssetModalOpen(true)}
                  >
                    Edit assets
                  </Button>
                ) : null}
              </div>
            </div>

            {!hasAssets ? (
              <div className="lg:pt-1">
                <div className="mb-3">
                  <h2 className="text-lg font-semibold">Set your assets</h2>
                  <p className="text-sm text-muted-foreground">
                    Saved locally in your browser
                  </p>
                </div>
                <div className="rounded-2xl border bg-card p-5">
                  <AssetForm
                    active
                    variant="compact"
                    showCancel={false}
                    saveLabel="Save"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-linear-to-r from-transparent via-border to-transparent my-8" />

      {/* Section 3: Tools list (as-is) + Live now */}
      <section className="py-8">
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="text-3xl font-bold">Tools</h2>
          <span className="text-sm text-muted-foreground tabular-nums">
            {unlockedTools} available
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
            const meta = categoryMeta[category.title] || {
              icon: SparklesIcon,
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
                  <div className={`size-1.5 rounded-full ${meta.bg}`} />
                  <h3
                    className={`text-sm font-semibold uppercase tracking-wider ${meta.color}`}
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

      <AssetModal open={assetModalOpen} onOpenChange={setAssetModalOpen} />
    </div>
  );
}
