import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "WebsiteKit - Free Online Website Tools for Developers";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
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
          </div>

          <div
            style={{
              fontSize: 68,
              lineHeight: 1.1,
              fontWeight: 800,
              color: "white",
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            Every website tool, in one place.
          </div>

          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.75)",
              maxWidth: 800,
            }}
          >
            Meta tags, QR codes, favicons, sitemaps, security headers — generate
            production-ready outputs in seconds.
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
                background: "rgba(124, 58, 237, 0.3)",
                padding: "8px 16px",
                borderRadius: 8,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Free
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
            <span
              style={{
                background: "rgba(124, 58, 237, 0.3)",
                padding: "8px 16px",
                borderRadius: 8,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Production Ready
            </span>
          </div>
          <div style={{ opacity: 0.75 }}>websitekit.dev</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
