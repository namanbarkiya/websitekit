import { ImageResponse } from "next/og";

import { sidebarConfig } from "@/config/sidebar";

export const runtime = "edge";

export const alt = "WebsiteKit tool preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

function findToolTitle(toolId: string) {
  for (const category of sidebarConfig.categories) {
    const item = category.items.find(
      (it) => it.href.replace("/tools/", "") === toolId
    );
    if (item) return item.title;
  }
  return toolId;
}

export default async function Image({
  params,
}: {
  params: Promise<{ toolId: string }>;
}) {
  const { toolId } = await params;
  const toolTitle = findToolTitle(toolId);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0b1220 0%, #141b2d 60%, #0b1220 100%)",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              fontSize: 26,
              color: "rgba(255,255,255,0.8)",
              letterSpacing: -0.2,
            }}
          >
            <span style={{ fontWeight: 700, color: "white" }}>WebsiteKit</span>
            <span style={{ opacity: 0.8 }}>•</span>
            <span style={{ opacity: 0.85 }}>Tools</span>
          </div>

          <div
            style={{
              fontSize: 74,
              lineHeight: 1.05,
              fontWeight: 800,
              color: "white",
              letterSpacing: -1.2,
            }}
          >
            {toolTitle}
          </div>

          <div
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.8)",
              maxWidth: 980,
            }}
          >
            Fast, production-ready website outputs.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "rgba(255,255,255,0.65)",
            fontSize: 22,
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: "#7c3aed",
              }}
            />
            <span>websitekit</span>
          </div>
          <div style={{ opacity: 0.75 }}>{`/tools/${toolId}`}</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

