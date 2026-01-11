"use client";

import { useMemo } from "react";

import { HeroSection } from "@/components/home/hero-section";
import { ToolsSection } from "@/components/home/tools-section";
import { sidebarConfig } from "@/config/sidebar";

export function HomeClient() {
  const unlockedToolsCount = useMemo(
    () =>
      sidebarConfig.categories.reduce(
        (acc, cat) => acc + cat.items.filter((item) => !item.locked).length,
        0
      ),
    []
  );

  const liveNowTools = useMemo(
    () =>
      sidebarConfig.categories
        .flatMap((cat) => cat.items)
        .filter((item) => !item.locked)
        .slice(0, 6),
    []
  );

  return (
    <div className="pb-16 px-4 md:px-6 lg:px-8 overflow-x-hidden">
      <HeroSection unlockedToolsCount={unlockedToolsCount} />

      {/* Divider */}
      <div className="h-px bg-linear-to-r from-transparent via-border to-transparent my-8" />

      <ToolsSection
        unlockedToolsCount={unlockedToolsCount}
        liveNowTools={liveNowTools}
      />
    </div>
  );
}
