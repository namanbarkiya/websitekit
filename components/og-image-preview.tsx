"use client";

import Image from "next/image";

/**
 * Sample OG Image Preview Component
 * 
 * This shows how the OG images will look when generated.
 * Use this to verify positioning and styling before deploying.
 */
export function OGImagePreview() {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Homepage OG Image</h2>
        <div className="border rounded-lg overflow-hidden bg-muted">
          <div className="relative" style={{ aspectRatio: "1200/630" }}>
            <Image
              src="/logo/og_banner.png"
              alt="Homepage OG Banner"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          URL: <code>/opengraph-image</code>
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tool OG Image Template</h2>
        <div className="border rounded-lg overflow-hidden bg-muted">
          <div className="relative" style={{ aspectRatio: "1200/630" }}>
            <Image
              src="/logo/og_tool_banner.png"
              alt="Tool OG Banner Template"
              fill
              className="object-cover"
            />
            {/* Overlay showing where text will be positioned */}
            <div className="absolute bottom-[120px] left-[72px] right-[72px] flex flex-col gap-4">
              <div className="text-6xl font-extrabold text-[#1a1a1a] leading-tight max-w-[1000px]">
                Meta Tags
              </div>
              <div className="text-2xl font-medium text-[#666666] leading-snug max-w-[900px]">
                Free online tool • No signup required
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          URL: <code>/tools/meta-tags/opengraph-image</code>
          <br />
          <span className="text-xs">
            (Text overlay shown for preview - actual OG image will have this
            rendered)
          </span>
        </p>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
        <h3 className="font-semibold">Note:</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
          <li>
            Tool title will be dynamically inserted based on the tool ID
          </li>
          <li>
            Text positioning (bottom: 120px, left: 72px) can be adjusted based
            on your template design
          </li>
          <li>
            Font sizes and colors can be customized in{" "}
            <code>app/tools/[toolId]/opengraph-image.tsx</code>
          </li>
        </ul>
      </div>
    </div>
  );
}
