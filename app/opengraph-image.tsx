import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "WebsiteKit - Free Online Website Tools for Developers";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const SITE_URL = "https://websitekit.dev";

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

export default async function Image() {
  // Fetch the banner image directly
  const bannerResponse = await fetch(
    new URL("/logo/og_banner.png", SITE_URL)
  ).catch(() => null);

  if (!bannerResponse || !bannerResponse.ok) {
    // Fallback if image can't be loaded
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #fd6d2c 0%, #ff8c5a 100%)",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 48,
          fontWeight: 800,
        }}
      >
        WebsiteKit
      </div>,
      { ...size }
    );
  }

  // Convert to base64 for edge runtime
  const bannerArrayBuffer = await bannerResponse.arrayBuffer();
  const bannerBase64 = await arrayBufferToBase64(bannerArrayBuffer);
  const bannerDataUrl = `data:image/png;base64,${bannerBase64}`;

  // Return the banner image directly, no overlays
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
      }}
    >
      <img
        src={bannerDataUrl}
        alt="WebsiteKit Banner"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>,
    {
      ...size,
    }
  );
}
