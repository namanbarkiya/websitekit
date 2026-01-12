import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppShell } from "@/components/app-shell";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://websitekit.dev"),
  title: {
    default: "WebsiteKit - Website setup, done right.",
    template: "%s",
  },
  description:
    "Meta tags, favicons, sitemaps, security headers—everything your site needs to launch, generated in seconds.",
  applicationName: "WebsiteKit",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "WebsiteKit - Website setup, done right.",
    description:
      "Meta tags, favicons, sitemaps, security headers—everything your site needs to launch, generated in seconds.",
    type: "website",
    siteName: "WebsiteKit",
    images: [{ url: "https://websitekit.dev/logo/primary_bg.png" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@websitekitdev",
    creator: "@websitekitdev",
    title: "WebsiteKit - Website setup, done right.",
    description:
      "Meta tags, favicons, sitemaps, security headers—everything your site needs to launch, generated in seconds.",
    images: ["https://websitekit.dev/logo/primary_bg.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      // Google SERP favicon requirement: >= 48x48 and crawlable.
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      // Common browser sizes
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      // Google Search favicons are expected to be at least 48x48.
      // Include a larger square icon to ensure eligibility.
      {
        url: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      // Also expose /favicon.ico for maximum compatibility.
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "manifest",
        url: "/favicon/site.webmanifest",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
