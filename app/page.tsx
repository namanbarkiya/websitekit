"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  BotIcon,
  CheckIcon,
  CodeIcon,
  GaugeIcon,
  LockIcon,
  PaletteIcon,
  ShareIcon,
  ShieldIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";

import { sidebarConfig } from "@/config/sidebar";

const categoryMeta: Record<
  string,
  { icon: typeof ZapIcon; color: string; bg: string }
> = {
  "Setup & Identity": {
    icon: PaletteIcon,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500",
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
  const totalTools = sidebarConfig.categories.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  );
  const unlockedTools = sidebarConfig.categories.reduce(
    (acc, cat) => acc + cat.items.filter((item) => !item.locked).length,
    0
  );

  return (
    <div className="pb-16 px-4 md:px-6 lg:px-8 overflow-x-hidden">
      {/* Hero */}
      <section className="relative py-2 md:py-8">
        {/* Ambient Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 size-[300px] md:size-[500px] rounded-full bg-primary/5 blur-[80px] md:blur-[100px]" />
          <div className="absolute bottom-0 left-0 size-[250px] md:size-[400px] rounded-full bg-amber-500/5 blur-[60px] md:blur-[80px]" />
        </div>

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-sm text-primary mb-8">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {unlockedTools} tools ready
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">No signup required</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] mb-6">
            Website setup,
            <br />
            <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
              done right.
            </span>
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl">
            Meta tags, favicons, sitemaps, security headers—everything your site
            needs to launch, generated in seconds.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-16">
            <Link
              href="/tools/assets"
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-4 rounded-full font-medium transition-all hover:gap-3 hover:shadow-xl hover:shadow-primary/20"
            >
              Get Started
              <ArrowRightIcon className="size-4" />
            </Link>
            <Link
              href="/tools/meta-tags"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-4"
            >
              <CodeIcon className="size-4" />
              Try Meta Tags →
            </Link>
          </div>

          {/* Inline Stats */}
          <div className="flex items-center gap-8 text-sm">
            <div>
              <span className="text-3xl font-bold">{totalTools}</span>
              <span className="text-muted-foreground ml-2">tools</span>
            </div>
            <div>
              <span className="text-3xl font-bold">
                {sidebarConfig.categories.length}
              </span>
              <span className="text-muted-foreground ml-2">categories</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="size-5 text-emerald-500" />
              <span className="text-muted-foreground">100% free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-8" />

      {/* Categories */}
      <section className="py-8">
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="text-3xl font-bold">Tools</h2>
          <span className="text-sm text-muted-foreground tabular-nums">
            {unlockedTools} available
          </span>
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

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-8" />

      {/* How It Works */}
      <section className="py-8">
        <h2 className="text-3xl font-bold mb-12">How it works</h2>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              num: "01",
              title: "Set your brand",
              desc: "Enter site name, domain, and color once. They'll be used across all tools.",
              icon: PaletteIcon,
            },
            {
              num: "02",
              title: "Generate outputs",
              desc: "Pick any tool. Your info auto-fills. Customize if needed.",
              icon: ZapIcon,
            },
            {
              num: "03",
              title: "Copy or download",
              desc: "Get production-ready code, files, or images. Ship it.",
              icon: CheckIcon,
            },
          ].map((step) => (
            <div key={step.num} className="relative">
              <span className="text-6xl font-bold text-muted/30 absolute -top-2 -left-2">
                {step.num}
              </span>
              <div className="relative pt-8">
                <step.icon className="size-6 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <p className="text-muted-foreground mb-6">
          Ready to set up your website properly?
        </p>
        <Link
          href="/tools/assets"
          className="group inline-flex items-center gap-2 text-lg font-medium text-primary hover:gap-3 transition-all"
        >
          Start with Website Assets
          <ArrowRightIcon className="size-5" />
        </Link>
      </section>
    </div>
  );
}
