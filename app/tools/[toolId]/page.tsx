import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { sidebarConfig, type SidebarNavItem } from "@/config/sidebar";
import { getRelatedTools, getToolSeo } from "@/tools";

import { ToolClient } from "./tool-client";
import {
  toolDescription,
  toolKeywords,
  toolMetaDescription,
  toolMetaTitle,
  toolTitle,
} from "./tool-seo";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ toolId: string }>;
};

type ToolPageMeta = SidebarNavItem & {
  toolId: string;
};

const SITE_URL = new URL("https://websitekit.dev");

function findTool(toolId: string): ToolPageMeta | null {
  for (const category of sidebarConfig.categories) {
    const item = category.items.find(
      (it) => it.href.replace("/tools/", "") === toolId
    );
    if (!item) continue;
    return { ...item, toolId };
  }
  return null;
}

function toolCanonical(toolId: string) {
  return `/tools/${toolId}`;
}

function findRelatedToolsFromSidebar(
  toolId: string,
  count = 2
): SidebarNavItem[] {
  // First try to get related tools from SEO data
  const seoRelated = getRelatedTools(toolId);
  if (seoRelated.length > 0) {
    const items: SidebarNavItem[] = [];
    for (const relatedId of seoRelated.slice(0, count)) {
      const tool = findTool(relatedId);
      if (tool) items.push(tool);
    }
    if (items.length > 0) return items;
  }

  // Fallback to category-based related tools
  const category = sidebarConfig.categories.find((cat) =>
    cat.items.some((item) => item.href === `/tools/${toolId}`)
  );
  if (!category) return [];
  const unlocked = category.items.filter(
    (item) => item.href !== `/tools/${toolId}` && !item.locked
  );
  const fallback = category.items.filter(
    (item) => item.href !== `/tools/${toolId}`
  );
  return (unlocked.length ? unlocked : fallback).slice(0, count);
}

function findSeoChecklist() {
  for (const category of sidebarConfig.categories) {
    const item = category.items.find(
      (it) => it.href === "/tools/seo-checklist"
    );
    if (item) return item;
  }
  return null;
}

export async function generateStaticParams() {
  return sidebarConfig.categories
    .flatMap((c) => c.items)
    .map((it) => it.href.replace("/tools/", ""))
    .filter(Boolean)
    .map((toolId) => ({ toolId }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { toolId } = await params;
  const tool = findTool(toolId);
  if (!tool) return {};

  const canonical = new URL(toolCanonical(toolId), SITE_URL);
  const title = toolMetaTitle(tool);
  const description = toolMetaDescription(tool);
  const isLocked = Boolean(tool.locked);

  return {
    title,
    description,
    alternates: { canonical },
    keywords: toolKeywords(tool),
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "WebsiteKit",
      type: "website",
      images: [{ url: new URL(`/tools/${toolId}/opengraph-image`, SITE_URL) }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@websitekitdev",
      creator: "@websitekitdev",
      title,
      description,
      images: [
        new URL(`/tools/${toolId}/opengraph-image`, SITE_URL).toString(),
      ],
    },
    robots: isLocked
      ? {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : {
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
  };
}

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function buildToolJsonLd(tool: ToolPageMeta) {
  const url = new URL(toolCanonical(tool.toolId), SITE_URL).toString();
  const name = toolTitle(tool);
  const description = toolDescription(tool);
  const seo = getToolSeo(tool.toolId);

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL.toString(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: new URL("/tools", SITE_URL).toString(),
      },
      { "@type": "ListItem", position: 3, name: tool.title, item: url },
    ],
  };

  const app = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    description,
    url,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: "WebsiteKit",
      url: SITE_URL.toString(),
    },
  };

  // HowTo schema for AI answer extraction (AEO/GEO)
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.title}`,
    description: `Step-by-step guide to using the ${tool.title} tool on WebsiteKit.`,
    step: seo.howItWorks.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
    })),
    tool: {
      "@type": "HowToTool",
      name: "WebsiteKit",
    },
  };

  // FAQ schema from content (if available)
  const faq =
    seo.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: seo.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return faq ? [breadcrumbs, app, howTo, faq] : [breadcrumbs, app, howTo];
}

function ToolSeoText({
  toolTitle,
  seo,
}: {
  toolTitle: string;
  seo: ReturnType<typeof getToolSeo>;
}) {
  // Keep content in the HTML for SEO/AEO without adding UI noise.
  return (
    <div className="sr-only" aria-hidden="true">
      <h2>What is {toolTitle}?</h2>
      <p>{seo.whatIs}</p>

      <h2>Features</h2>
      <ul>
        {seo.features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>

      <h2>How to use</h2>
      <ol>
        {seo.howItWorks.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>

      {seo.useCases.length > 0 && (
        <>
          <h2>Common use cases</h2>
          <ul>
            {seo.useCases.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </>
      )}

      {seo.faq.length > 0 && (
        <>
          <h2>Frequently Asked Questions</h2>
          {seo.faq.map((item, i) => (
            <div key={i}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default async function ToolPage({ params }: PageProps) {
  const { toolId } = await params;
  const tool = findTool(toolId);
  if (!tool) notFound();

  const locked = Boolean(tool.locked);
  const title = toolTitle(tool);
  const description = toolDescription(tool);
  const seo = getToolSeo(toolId);
  const relatedTools = findRelatedToolsFromSidebar(toolId, 2);
  const seoChecklist = findSeoChecklist();

  return (
    <div className="flex flex-col h-full min-h-0">
      <header className="space-y-3 shrink-0 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          {locked ? <Badge variant="outline">Coming soon</Badge> : null}
        </div>
        <div className="flex items-start gap-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex-1">
            {title}
          </h1>
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link href={`/tools/${toolId}/info`}>Learn more</Link>
          </Button>
        </div>
        <p className="text-muted-foreground max-w-3xl">{description}</p>
      </header>

      <JsonLd data={buildToolJsonLd(tool)} />

      {locked ? (
        <Card className="p-6">
          <h2 className="text-lg font-semibold">This tool is coming soon</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-3xl">
            We&apos;re building a best-in-class {tool.title.toLowerCase()}{" "}
            generator. In the meantime, this page is here so you can bookmark it
            and so search engines can index the upcoming tool.
          </p>
          <div className="mt-4">
            <Link href="/tools" className="text-sm underline">
              Browse all tools
            </Link>
          </div>
        </Card>
      ) : (
        <>
          <div className="flex-1 min-h-0 flex flex-col overflow-visible md:overflow-hidden">
            <ToolClient toolId={toolId} />
          </div>
          {/* Keep the SEO/AEO text in DOM without UI noise */}
          <ToolSeoText toolTitle={tool.title} seo={seo} />
        </>
      )}
    </div>
  );
}
