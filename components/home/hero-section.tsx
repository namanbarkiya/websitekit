"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, HammerIcon } from "lucide-react";

import { AssetForm } from "@/components/asset-form";
import { AssetModal } from "@/components/asset-modal";
import { Button } from "@/components/ui/button";
import { useHasAssets } from "@/lib/hooks/use-website-assets";

interface HeroSectionProps {
  unlockedToolsCount: number;
}

export function HeroSection({ unlockedToolsCount }: HeroSectionProps) {
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const hasAssets = useHasAssets();

  return (
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
              {unlockedToolsCount} tools ready
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">No signup required</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-3">
              Every FREAKN&apos; website tool, in one place.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Set your website assets once, then generate production-ready
              outputs (meta tags, favicons, sitemaps, headers) in seconds.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <Button
                asChild
                className="group relative overflow-hidden gap-2 group-hover:animate-[wk-button-shake_450ms_ease-in-out_both]"
              >
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

      <AssetModal open={assetModalOpen} onOpenChange={setAssetModalOpen} />
    </section>
  );
}
