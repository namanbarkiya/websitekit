"use client";

import { useMemo } from "react";
import Link from "next/link";

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
    <>
      <div className="pb-16 px-4 md:px-6 lg:px-8 overflow-x-hidden">
        <HeroSection unlockedToolsCount={unlockedToolsCount} />

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-border to-transparent my-8" />

        <ToolsSection
          unlockedToolsCount={unlockedToolsCount}
          liveNowTools={liveNowTools}
        />
      </div>

      {/* Minimal Footer */}
      <footer className="border-t mt-16">
        <div className="px-4 md:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/tools"
                className="hover:text-foreground transition-colors"
              >
                Tools
              </Link>
              <Link
                href="/faq"
                className="hover:text-foreground transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
            <div className="text-center sm:text-right">
              © {new Date().getFullYear()} WebsiteKit. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
