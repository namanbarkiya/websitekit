import { ImageResponse } from "next/og";

import { sidebarConfig } from "@/config/sidebar";

export const runtime = "edge";

export const alt = "WebsiteKit Tools - Free Online Website Tools";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  const liveToolsCount = sidebarConfig.categories
    .flatMap((c) => c.items)
    .filter((item) => !item.locked).length;

  const totalToolsCount = sidebarConfig.categories.flatMap(
    (c) => c.items
  ).length;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "linear-gradient(135deg, #0b1220 0%, #141b2d 60%, #0b1220 100%)",
        padding: 72,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            fontSize: 28,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: -0.3,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              background: "#7c3aed",
            }}
          />
          <span style={{ fontWeight: 700 }}>WebsiteKit</span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span style={{ opacity: 0.8 }}>Tools</span>
        </div>

        <div
          style={{
            fontSize: 64,
            lineHeight: 1.1,
            fontWeight: 800,
            color: "white",
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          {totalToolsCount}+ Free Website Tools
        </div>

        <div
          style={{
            fontSize: 28,
            lineHeight: 1.4,
            color: "rgba(255,255,255,0.75)",
            maxWidth: 800,
          }}
        >
          Meta tags, QR codes, favicons, sitemaps, security headers — all the
          tools you need to launch your website.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          color: "rgba(255,255,255,0.6)",
          fontSize: 22,
        }}
      >
        <div style={{ display: "flex", gap: 24 }}>
          <span
            style={{
              background: "rgba(34, 197, 94, 0.3)",
              padding: "8px 16px",
              borderRadius: 8,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {liveToolsCount} Live
          </span>
          <span
            style={{
              background: "rgba(124, 58, 237, 0.3)",
              padding: "8px 16px",
              borderRadius: 8,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Free Forever
          </span>
          <span
            style={{
              background: "rgba(124, 58, 237, 0.3)",
              padding: "8px 16px",
              borderRadius: 8,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            No Signup
          </span>
        </div>
        <div style={{ opacity: 0.75 }}>/tools</div>
      </div>
    </div>,
    {
      ...size,
    }
  );
}
