import { ImageResponse } from "next/og";

import { sidebarConfig } from "@/config/sidebar";

export const runtime = "edge";

export const alt = "WebsiteKit tool preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const SITE_URL = "https://websitekit.dev";

function findTool(toolId: string) {
  for (const category of sidebarConfig.categories) {
    const item = category.items.find(
      (it) => it.href.replace("/tools/", "") === toolId
    );
    if (item) return item;
  }
  return null;
}

// Helper to convert ArrayBuffer to base64 in edge runtime
async function arrayBufferToBase64(buffer: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

export default async function Image({
  params,
}: {
  params: Promise<{ toolId: string }>;
}) {
  const { toolId } = await params;
  const tool = findTool(toolId);
  const toolTitle = tool?.title || toolId;
  const toolDescription = tool?.description || "Free online tool";

  // Fetch the tool banner template as background
  const templateResponse = await fetch(
    new URL("/logo/og_tool_banner.png", SITE_URL)
  ).catch(() => null);

  if (!templateResponse || !templateResponse.ok) {
    // Fallback if image can't be loaded
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #fd6d2c 0%, #ff8c5a 100%)",
          padding: 72,
          justifyContent: "center",
          color: "white",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 800 }}>{toolTitle}</div>
        <div style={{ fontSize: 28, marginTop: 16, opacity: 0.9 }}>
          Free online tool • No signup required
        </div>
      </div>,
      { ...size }
    );
  }

  // Convert to base64 for edge runtime
  const templateArrayBuffer = await templateResponse.arrayBuffer();
  const templateBase64 = await arrayBufferToBase64(templateArrayBuffer);
  const templateDataUrl = `data:image/png;base64,${templateBase64}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
      }}
    >
      {/* Background: og_tool_banner.png */}
      <img
        src={templateDataUrl}
        alt="Tool Banner Template"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {/* Dynamic tool title overlay - positioned on the left side */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 235,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "flex-start",
          textAlign: "left",
          maxWidth: 500,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#1a1a1a",
            letterSpacing: -1.2,
            lineHeight: 1.1,
            textAlign: "left",
          }}
        >
          {toolTitle}
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: "#666666",
            lineHeight: 1.4,
            textAlign: "left",
            maxWidth: 450,
          }}
        >
          {toolDescription}
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  );
}
