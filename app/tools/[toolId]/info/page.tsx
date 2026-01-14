import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { sidebarConfig, type SidebarNavItem } from "@/config/sidebar";
import { getRelatedTools, getToolSeo } from "@/tools";

import {
  toolDescription,
  toolInfoMetaDescription,
  toolInfoMetaTitle,
  toolKeywords,
  toolTitle,
} from "../tool-seo";

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

function toolInfoCanonical(toolId: string) {
  return `/tools/${toolId}/info`;
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

function findCoreSeoTools() {
  const ids = new Set(["/tools/robots", "/tools/sitemap", "/tools/meta-tags"]);
  const items: SidebarNavItem[] = [];
  for (const category of sidebarConfig.categories) {
    for (const item of category.items) {
      if (ids.has(item.href)) items.push(item);
    }
  }
  return items;
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function normalizeFaqAnswer(answer: string, concept: string) {
  const words = countWords(answer);
  if (words < 40) {
    return `${answer} In most cases, the safest approach is to validate your ${concept} setup and check results before shipping.`;
  }
  if (words > 70) {
    return `${answer.split(/\s+/).slice(0, 70).join(" ")}.`;
  }
  return answer;
}

function ensureFaqs(
  baseFaqs: { question: string; answer: string }[],
  concept: string
) {
  const faq: { question: string; answer: string }[] = [];
  if (baseFaqs.length > 0) {
    faq.push(
      ...baseFaqs.map((item) => ({
        question: item.question,
        answer: normalizeFaqAnswer(item.answer, concept),
      }))
    );
  }

  const fallback = [
    {
      question: `Do I need ${concept}?`,
      answer: `You need ${concept} when it impacts how your site is crawled, rendered, or shared. If ${concept} affects discovery, performance, or compliance, setting it correctly reduces future fixes and makes auditing easier.`,
    },
    {
      question: `Does ${concept} affect SEO?`,
      answer: `${concept} can influence SEO indirectly by improving clarity, crawlability, and user experience. Clear signals help search engines interpret your pages correctly and reduce ambiguity that can lead to weaker rankings.`,
    },
    {
      question: `What happens if ${concept} is missing?`,
      answer: `If ${concept} is missing, defaults apply and you may lose control over how search engines or browsers treat your pages. That can lead to inconsistent behavior, weaker previews, or missed optimization opportunities.`,
    },
    {
      question: `Can ${concept} cause issues if configured incorrectly?`,
      answer: `Yes. Incorrect ${concept} can block crawling, break previews, or introduce inconsistent behavior across pages. A consistent configuration and validation step helps prevent regressions.`,
    },
  ];

  for (const item of fallback) {
    if (faq.length >= 6) break;
    if (faq.some((existing) => existing.question === item.question)) continue;
    faq.push({
      question: item.question,
      answer: normalizeFaqAnswer(item.answer, concept),
    });
  }

  return faq.slice(0, 6);
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
  const title = toolInfoMetaTitle(tool);
  const description = toolInfoMetaDescription(tool);

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
  const seo = getToolSeo(tool.toolId);

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

  const faq =
    seo.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: seo.faq.map((item) => ({
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

  const seo = getToolSeo(toolId);
  const locked = Boolean(tool.locked);
  const concept = seo.concept;
  const relatedTools = findRelatedToolsFromSidebar(toolId, 2);
  const coreSeoTools = findCoreSeoTools().filter(
    (item) => item.href !== `/tools/${toolId}`
  );
  const faqs = ensureFaqs(seo.faq, concept);

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full py-6 space-y-8">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              What is {concept} and how does it work?
            </h1>
            {locked ? <Badge variant="outline">Coming soon</Badge> : null}
          </div>

          <p className="text-muted-foreground max-w-3xl">
            {toolInfoMetaDescription(tool)}
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
              <p className="text-muted-foreground leading-relaxed">
                {seo.definition}
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">What is {concept}?</h2>
              <p className="text-muted-foreground leading-relaxed">
                {seo.whatIs}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                In practice, {concept} depends on consistent formatting,
                predictable URLs, and accurate values so search engines and
                browsers interpret your intent correctly.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">
                Why {concept} matters for SEO
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {concept} matters because it reduces ambiguity about how your
                pages should be discovered, rendered, or shared. Clear signals
                help search engines crawl efficiently, improve consistency
                across URLs, and reduce mistakes that can hurt visibility.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Even for non-SEO tools, the output affects user experience,
                performance, or accessibility. Those signals influence rankings
                through engagement and crawlability over time.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">How {concept} works</h2>
              <p className="text-muted-foreground leading-relaxed">
                {concept} works by following a small set of rules that browsers
                and search engines expect. When those rules are consistent, you
                get predictable behavior across pages and platforms.
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                {seo.howItWorks.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">
                You should use {concept} when
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {seo.whenToUse.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">Examples and use cases</h2>
              <p className="text-muted-foreground leading-relaxed">
                Common scenarios for {concept} include the following. These
                examples help you decide when to apply it and what to check
                during implementation.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {seo.useCases.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">Common mistakes</h2>
              <p className="text-muted-foreground leading-relaxed">
                Most issues come from inconsistent configuration or skipping
                validation. Avoid the mistakes below to keep results predictable
                across pages.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {seo.commonMistakes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">FAQs</h2>
              <Separator />
              <div className="space-y-4">
                {faqs.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <h3 className="font-medium">{item.question}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold">Related resources</h2>
              <p className="text-muted-foreground mt-2">
                These links help you connect related SEO setup tasks and keep
                your implementation consistent.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground mt-3">
                <li>
                  <Link href={`/tools/${toolId}`}>Use {tool.title}</Link>
                </li>
                {relatedTools.map((item) => (
                  <li key={item.href}>
                    <Link href={`${item.href}/info`}>{item.title} guide</Link>
                  </li>
                ))}
                {coreSeoTools.map((item) => (
                  <li key={item.href}>
                    <Link href={`${item.href}/info`}>{item.title} guide</Link>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
