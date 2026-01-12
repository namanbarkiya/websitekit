import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { sidebarConfig, type SidebarNavItem } from "@/config/sidebar";
import { getToolContent } from "@/tools";

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

function toolTitle(tool: ToolPageMeta) {
  // High-intent keyword framing without keyword stuffing.
  const base = `${tool.title} Tool`;
  if (tool.toolId === "meta-tags") return `Best Meta Tags Generator (Free)`;
  if (tool.toolId === "qr-code") return `Best QR Code Generator (Free)`;
  return base;
}

function toolDescription(tool: ToolPageMeta) {
  const fallback =
    tool.description ??
    `Generate ${tool.title.toLowerCase()} outputs in seconds with WebsiteKit.`;
  if (tool.toolId === "meta-tags") {
    return "Generate SEO meta tags, Open Graph, and Twitter Cards in one clean <head> snippet. Fast, correct, and copy‑paste ready.";
  }
  if (tool.toolId === "qr-code") {
    return "Create scannable QR codes for URLs or text and download as SVG/PNG. Crisp output, no signup.";
  }
  return fallback;
}

function toolKeywords(tool: ToolPageMeta) {
  const kw = tool.keywords ?? [];
  const extras = [
    "free",
    "online",
    "generator",
    "websitekit",
    tool.title.toLowerCase(),
  ];
  return Array.from(new Set([...kw, ...extras])).slice(0, 25);
}

function toolInfoCanonical(toolId: string) {
  return `/tools/${toolId}/info`;
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

  const canonical = new URL(toolInfoCanonical(toolId), SITE_URL);
  const title = `${toolTitle(tool)} Guide & FAQ | WebsiteKit`;
  const description = `${toolDescription(tool)} Learn what it is, how to use it, common use cases, and FAQs.`;

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
      type: "article",
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
    // Only index “info” pages for live tools with real utility.
    // Locked tools would be thin content and can reduce site quality.
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

function buildToolInfoJsonLd(tool: ToolPageMeta) {
  const url = new URL(toolInfoCanonical(tool.toolId), SITE_URL).toString();
  const name = `${toolTitle(tool)} Guide`;
  const description = `Guide and FAQ for the ${tool.title} tool on WebsiteKit.`;
  const content = getToolContent(tool.toolId);

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: new URL("/tools", SITE_URL).toString(),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.title,
        item: new URL(`/tools/${tool.toolId}`, SITE_URL).toString(),
      },
      { "@type": "ListItem", position: 4, name: "Info", item: url },
    ],
  };

  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "WebsiteKit",
      url: SITE_URL.toString(),
    },
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.title}`,
    description: `Step-by-step guide to using the ${tool.title} tool on WebsiteKit.`,
    step: content.howItWorks.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
    })),
    tool: {
      "@type": "HowToTool",
      name: "WebsiteKit",
    },
  };

  const faq = content.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: content.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  return faq
    ? [breadcrumbs, webpage, howTo, faq]
    : [breadcrumbs, webpage, howTo];
}

export default async function ToolInfoPage({ params }: PageProps) {
  const { toolId } = await params;
  const tool = findTool(toolId);
  if (!tool) notFound();

  const content = getToolContent(toolId);
  const locked = Boolean(tool.locked);
  const title = toolTitle(tool);
  const description = toolDescription(tool);

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full py-6 space-y-8">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {title}: Guide & FAQ
            </h1>
            {locked ? <Badge variant="outline">Coming soon</Badge> : null}
          </div>

          <p className="text-muted-foreground max-w-3xl">
            {description} This page explains what it is, how it works, common
            use cases, and answers the most common questions.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <Link href={`/tools/${toolId}`}>Use the tool</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tools">Browse all tools</Link>
            </Button>
          </div>
        </header>

        <JsonLd data={buildToolInfoJsonLd(tool)} />

        {locked ? (
          <Card className="p-6">
            <h2 className="text-lg font-semibold">This tool is coming soon</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-3xl">
              We&apos;re building this tool. When it ships, this page will be
              expanded into a full guide with examples and deeper FAQs.
            </p>
          </Card>
        ) : (
          <div className="space-y-8">
            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">What is it?</h2>
              <p className="text-muted-foreground leading-relaxed">
                {content.whatIs}
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">Key features</h2>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {content.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">How to use it</h2>
              <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                {content.howItWorks.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </Card>

            {content.useCases?.length ? (
              <Card className="p-6 space-y-3">
                <h2 className="text-xl font-semibold">Common use cases</h2>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  {content.useCases.map((u, i) => (
                    <li key={i}>{u}</li>
                  ))}
                </ul>
              </Card>
            ) : null}

            {content.faq?.length ? (
              <Card className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">FAQ</h2>
                <Separator />
                <div className="space-y-4">
                  {content.faq.map((item, i) => (
                    <div key={i} className="space-y-1">
                      <h3 className="font-medium">{item.question}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            <Card className="p-6">
              <h2 className="text-xl font-semibold">Ready to generate?</h2>
              <p className="text-muted-foreground mt-2">
                Use the tool to generate copy‑paste ready output in seconds.
              </p>
              <div className="mt-4">
                <Button asChild>
                  <Link href={`/tools/${toolId}`}>Use {tool.title}</Link>
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
