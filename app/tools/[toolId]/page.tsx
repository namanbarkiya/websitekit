import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { sidebarConfig, type SidebarNavItem } from "@/config/sidebar";

import { ToolClient } from "./tool-client";

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

// Tool-specific content for better SEO (unique content per tool)
interface ToolContent {
  features: string[];
  howItWorks: string[];
  useCases?: string[];
}

function getToolContent(toolId: string): ToolContent {
  const content: Record<string, ToolContent> = {
    "meta-tags": {
      features: [
        "Generate complete <head> section with all essential meta tags",
        "Include Open Graph tags for Facebook, LinkedIn, and other social platforms",
        "Add Twitter Card meta tags for rich previews on X (Twitter)",
        "Set canonical URLs to prevent duplicate content issues",
        "Configure robots directives to control search engine indexing",
        "Preview how your page will look in search results and social shares",
      ],
      howItWorks: [
        "Enter your page title, description, and URL",
        "Add optional Open Graph image URL for social previews",
        "Configure advanced settings like robots directives",
        "Click Generate to create your meta tags",
        "Copy the HTML snippet and paste into your <head> section",
      ],
      useCases: [
        "Launching a new website or landing page",
        "Improving SEO for existing pages",
        "Setting up social media sharing previews",
        "Ensuring consistent metadata across your site",
      ],
    },
    "qr-code": {
      features: [
        "Generate QR codes for any URL or text content",
        "Download as high-quality SVG for print materials",
        "Export as PNG for digital use and applications",
        "Customize QR code size for different use cases",
        "Preview QR code before downloading",
        "No watermarks or branding on generated codes",
      ],
      howItWorks: [
        "Enter the URL or text you want to encode",
        "Adjust the size if needed (default works for most cases)",
        "Click Generate to create your QR code",
        "Preview the result and test with your phone camera",
        "Download as SVG for print or PNG for digital use",
      ],
      useCases: [
        "Business cards and marketing materials",
        "Restaurant menus and product packaging",
        "Event tickets and conference badges",
        "App download links and contact sharing",
      ],
    },
  };

  return (
    content[toolId] || {
      features: [
        "Generate production-ready output instantly",
        "Copy and paste directly into your codebase",
        "No signup or account required",
        "Works with any website or framework",
      ],
      howItWorks: [
        "Enter the required information",
        "Click Generate to create your output",
        "Preview and verify the result",
        "Copy the output and use in your project",
      ],
    }
  );
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
      title,
      description,
      images: [new URL(`/tools/${toolId}/opengraph-image`, SITE_URL).toString()],
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

  const faq =
    tool.toolId === "meta-tags"
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What meta tags should every page have?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "At minimum: title, meta description, canonical URL, and Open Graph/Twitter tags for social sharing. Many sites also add robots directives and structured data (JSON-LD) where relevant.",
              },
            },
            {
              "@type": "Question",
              name: "Do meta keywords help SEO?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. Most major search engines ignore the meta keywords tag. Focus on title, description, canonical, and structured data instead.",
              },
            },
            {
              "@type": "Question",
              name: "How long should my meta description be?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Aim for 150-160 characters. Google typically displays up to 155-160 characters in search results, so keep your most important information at the beginning.",
              },
            },
          ],
        }
      : tool.toolId === "qr-code"
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What format should I download: SVG or PNG?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Use SVG for crisp scaling in print and web. Use PNG when you need a fixed-size raster image for apps or platforms that don't accept SVG.",
                },
              },
              {
                "@type": "Question",
                name: "What makes a QR code scan reliably?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "High contrast, sufficient size, quiet zone padding, and avoiding overly dense content. Always test with multiple camera apps.",
                },
              },
              {
                "@type": "Question",
                name: "What is the minimum size for a printed QR code?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "For reliable scanning, print QR codes at minimum 2x2 cm (0.8x0.8 inches). Larger sizes are recommended for scanning from a distance.",
                },
              },
            ],
          }
        : null;

  return faq ? [breadcrumbs, app, faq] : [breadcrumbs, app];
}

function ToolContentSection({
  toolId,
  category,
}: {
  toolId: string;
  category?: string;
}) {
  const content = getToolContent(toolId);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="p-5 lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Features</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc pl-5">
            {content.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal pl-5">
            {content.howItWorks.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        {content.useCases && (
          <div>
            <h2 className="text-lg font-semibold">Common use cases</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc pl-5">
              {content.useCases.map((useCase, i) => (
                <li key={i}>{useCase}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <Card className="p-5">
        <h2 className="text-lg font-semibold">Related tools</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {sidebarConfig.categories
            .find((c) => c.title === category)
            ?.items.filter((it) => it.href !== `/tools/${toolId}`)
            .slice(0, 5)
            .map((it) => (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className="text-muted-foreground hover:text-foreground hover:underline"
                >
                  {it.title}
                  {it.locked && (
                    <span className="ml-2 text-xs opacity-60">(Soon)</span>
                  )}
                </Link>
              </li>
            ))}
        </ul>

        <div className="mt-6 pt-4 border-t">
          <h3 className="text-sm font-semibold">Why use WebsiteKit?</h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>✓ 100% free, no signup</li>
            <li>✓ No data sent to servers</li>
            <li>✓ Production-ready output</li>
            <li>✓ Works with any framework</li>
          </ul>
        </div>
      </Card>
    </section>
  );
}

export default async function ToolPage({ params }: PageProps) {
  const { toolId } = await params;
  const tool = findTool(toolId);
  if (!tool) notFound();

  const locked = Boolean(tool.locked);
  const title = toolTitle(tool);
  const description = toolDescription(tool);

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
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {title}
        </h1>
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
          <ToolContentSection toolId={toolId} category={tool.category} />
        </>
      )}
    </div>
  );
}
