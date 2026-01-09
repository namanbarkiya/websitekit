import { Suspense } from "react";
import type { Metadata } from "next";

import { sidebarConfig } from "@/config/sidebar";

import { ToolsClient } from "./tools-client";

const SITE_URL = "https://websitekit.dev";

export const metadata: Metadata = {
  title: "Free Website Tools - Meta Tags, QR Codes, SEO & More | WebsiteKit",
  description:
    "Browse 25+ free online tools for web developers: meta tag generator, QR code maker, favicon creator, sitemap builder, security headers, and more. No signup required.",
  keywords: [
    "website tools",
    "free online tools",
    "meta tag generator",
    "qr code generator",
    "favicon generator",
    "sitemap generator",
    "security headers generator",
    "seo tools",
    "web development tools",
    "developer utilities",
  ],
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    title: "Free Website Tools - Meta Tags, QR Codes, SEO & More",
    description:
      "Browse 25+ free online tools for web developers. No signup required.",
    url: "/tools",
    siteName: "WebsiteKit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@websitekitdev",
    creator: "@websitekitdev",
    title: "Free Website Tools - Meta Tags, QR Codes, SEO & More",
    description:
      "Browse 25+ free online tools for web developers. No signup required.",
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

function buildToolsJsonLd() {
  const siteUrl = SITE_URL;

  // BreadcrumbList
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${siteUrl}/tools`,
      },
    ],
  };

  // CollectionPage for the tools directory
  const allTools = sidebarConfig.categories.flatMap((c) => c.items);
  const liveTools = allTools.filter((item) => !item.locked);

  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Website Tools",
    description:
      "Browse free online tools for web developers: meta tag generator, QR code maker, favicon creator, and more.",
    url: `${siteUrl}/tools`,
    mainEntity: {
      "@type": "ItemList",
      name: "Website Tools",
      numberOfItems: allTools.length,
      itemListElement: allTools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareApplication",
          name: tool.title,
          description: tool.description,
          url: `${siteUrl}${tool.href}`,
          applicationCategory: "WebApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        },
      })),
    },
  };

  // Aggregate rating (optional - for social proof)
  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "WebsiteKit Tools",
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    description: `Collection of ${liveTools.length}+ free website tools for developers`,
    url: `${siteUrl}/tools`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return [breadcrumbs, collectionPage, softwareApp];
}

export default function ToolsPage() {
  const jsonLdData = buildToolsJsonLd();

  return (
    <>
      {jsonLdData.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <Suspense fallback={null}>
        <ToolsClient />
      </Suspense>
    </>
  );
}
