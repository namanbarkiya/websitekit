import type { Metadata } from "next";

import { sidebarConfig } from "@/config/sidebar";

import { HomeClient } from "./home-client";

const SITE_URL = "https://websitekit.dev";

export const metadata: Metadata = {
  title: "WebsiteKit - Free Online Website Tools for Developers",
  description:
    "Generate meta tags, QR codes, favicons, sitemaps, and security headers in seconds. Free, no signup, production-ready outputs for your website.",
  keywords: [
    "website tools",
    "meta tags generator",
    "qr code generator",
    "favicon generator",
    "sitemap generator",
    "security headers",
    "seo tools",
    "free online tools",
    "web development",
    "developer tools",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "WebsiteKit - Free Online Website Tools for Developers",
    description:
      "Generate meta tags, QR codes, favicons, sitemaps, and security headers in seconds. Free, no signup.",
    url: "/",
    siteName: "WebsiteKit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebsiteKit - Free Online Website Tools for Developers",
    description:
      "Generate meta tags, QR codes, favicons, sitemaps, and security headers in seconds. Free, no signup.",
  },
};

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function buildHomeJsonLd() {
  const siteUrl = SITE_URL;

  // Organization schema
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WebsiteKit",
    url: siteUrl,
    logo: "https://websitekit.dev/logo/primary_bg.png",
    description:
      "Free online tools to generate meta tags, QR codes, favicons, sitemaps, and security headers for websites.",
    sameAs: ["https://x.com/websitekitdev"],
  };

  // WebSite schema with sitelinks searchbox
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WebsiteKit",
    url: siteUrl,
    description:
      "Free online tools to generate meta tags, QR codes, favicons, sitemaps, and security headers for websites.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/tools?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // ItemList schema for featured tools
  const liveTools = sidebarConfig.categories
    .flatMap((c) => c.items)
    .filter((item) => !item.locked);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Website Tools",
    description: "Free online tools for web developers",
    numberOfItems: liveTools.length,
    itemListElement: liveTools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.title,
      url: `${siteUrl}${tool.href}`,
      description: tool.description,
    })),
  };

  return [organization, website, itemList];
}

export default function Home() {
  const jsonLdData = buildHomeJsonLd();

  return (
    <>
      {jsonLdData.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <HomeClient />
    </>
  );
}
