import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { sidebarConfig, type SidebarNavItem } from "@/config/sidebar";
import { getToolContent } from "@/lib/tools";

import { ToolClient } from "./tool-client";
import { ToolInfoDialog } from "./tool-info-dialog";

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

function toolCanonical(toolId: string) {
  return `/tools/${toolId}`;
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
  const title = `${toolTitle(tool)} | WebsiteKit`;
  const description = toolDescription(tool);

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
  const content = getToolContent(tool.toolId);

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

  // FAQ schema from content (if available)
  const faq = content.faq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: content.faq.map((item) => ({
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

function ToolContentSection({
  toolId,
  toolTitle,
  category,
}: {
  toolId: string;
  toolTitle: string;
  category?: string;
}) {
  const content = getToolContent(toolId);

  return (
    <details className="rounded-lg border bg-card p-5">
      <summary className="cursor-pointer select-none font-semibold">
        About this tool
        <span className="ml-2 text-xs text-muted-foreground font-normal">
          (what it is, how to use it, FAQ)
        </span>
      </summary>

      <div className="mt-4 space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-semibold">What is {toolTitle}?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {content.whatIs}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">Features</h2>
          <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
            {content.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">How to use it</h2>
          <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1">
            {content.howItWorks.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>

        {content.useCases?.length ? (
          <section className="space-y-2">
            <h2 className="text-base font-semibold">Common use cases</h2>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              {content.useCases.map((useCase, i) => (
                <li key={i}>{useCase}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {content.faq?.length ? (
          <section className="space-y-3">
            <h2 className="text-base font-semibold">FAQ</h2>
            <div className="space-y-4">
              {content.faq.map((item, i) => (
                <article
                  key={i}
                  className="border-b last:border-0 pb-4 last:pb-0"
                >
                  <h3 className="font-medium text-sm">{item.question}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-2">
          <h2 className="text-base font-semibold">Related tools</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            {sidebarConfig.categories
              .find((c) => c.title === category)
              ?.items.filter((it) => it.href !== `/tools/${toolId}`)
              .slice(0, 5)
              .map((it) => (
                <li key={it.href}>
                  <Link href={it.href} className="hover:underline">
                    {it.title}
                    {it.locked ? (
                      <span className="ml-2 text-xs opacity-70">(Soon)</span>
                    ) : null}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </details>
  );
}

export default async function ToolPage({ params }: PageProps) {
  const { toolId } = await params;
  const tool = findTool(toolId);
  if (!tool) notFound();

  const locked = Boolean(tool.locked);
  const title = toolTitle(tool);
  const description = toolDescription(tool);
  const content = getToolContent(toolId);

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs text-muted-foreground">
            <Link href="/tools" className="hover:underline">
              Tools
            </Link>{" "}
            / <span className="text-foreground">{tool.title}</span>
          </p>
          {locked ? <Badge variant="outline">Coming soon</Badge> : null}
        </div>
        <div className="flex items-start gap-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex-1">
            {title}
          </h1>
          <ToolInfoDialog
            toolTitle={title}
            toolName={tool.title}
            content={content}
          />
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
          <ToolClient toolId={toolId} />

          {/* Crawlable content section (helps ranking without affecting tool UX) */}
          <ToolContentSection
            toolId={toolId}
            toolTitle={tool.title}
            category={tool.category}
          />
        </>
      )}
    </div>
  );
}
