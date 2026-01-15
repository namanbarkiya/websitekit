import type { ToolOutput } from "@/lib/utils/tool-registry";

import {
  DEFAULT_STATE,
  type ArticleData,
  type BreadcrumbData,
  type FAQData,
  type JsonLdState,
  type OrganizationData,
  type WebSiteData,
} from "../types";

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function generateOrganizationSchema(data: OrganizationData): object | null {
  if (!data.name.trim()) return null;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name.trim(),
  };

  if (data.url.trim()) schema.url = data.url.trim();
  if (data.logo.trim()) schema.logo = data.logo.trim();
  if (data.description.trim()) schema.description = data.description.trim();

  const sameAs = data.sameAs
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (sameAs.length > 0) schema.sameAs = sameAs;

  return schema;
}

function generateWebSiteSchema(data: WebSiteData): object | null {
  if (!data.name.trim() || !data.url.trim()) return null;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: data.name.trim(),
    url: data.url.trim(),
  };

  if (data.description.trim()) schema.description = data.description.trim();

  if (data.searchUrl.trim()) {
    schema.potentialAction = {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: data.searchUrl.trim(),
      },
      "query-input": "required name=search_term_string",
    };
  }

  return schema;
}

function generateArticleSchema(data: ArticleData): object | null {
  if (!data.headline.trim()) return null;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.headline.trim(),
  };

  if (data.description.trim()) schema.description = data.description.trim();
  if (data.url.trim()) schema.url = data.url.trim();
  if (data.imageUrl.trim()) schema.image = data.imageUrl.trim();
  if (data.datePublished.trim()) schema.datePublished = data.datePublished.trim();
  if (data.dateModified.trim()) schema.dateModified = data.dateModified.trim();

  if (data.authorName.trim()) {
    const author: Record<string, string> = {
      "@type": "Person",
      name: data.authorName.trim(),
    };
    if (data.authorUrl.trim()) author.url = data.authorUrl.trim();
    schema.author = author;
  }

  if (data.publisherName.trim()) {
    const publisher: Record<string, unknown> = {
      "@type": "Organization",
      name: data.publisherName.trim(),
    };
    if (data.publisherLogo.trim()) {
      publisher.logo = {
        "@type": "ImageObject",
        url: data.publisherLogo.trim(),
      };
    }
    schema.publisher = publisher;
  }

  return schema;
}

function generateFAQSchema(data: FAQData): object | null {
  const validItems = data.items.filter(
    (item) => item.question.trim() && item.answer.trim()
  );

  if (validItems.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: validItems.map((item) => ({
      "@type": "Question",
      name: item.question.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.trim(),
      },
    })),
  };
}

function generateBreadcrumbSchema(data: BreadcrumbData): object | null {
  const validItems = data.items.filter(
    (item) => item.name.trim() && item.url.trim()
  );

  if (validItems.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: validItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name.trim(),
      item: item.url.trim(),
    })),
  };
}

export function generateJsonLd(state: JsonLdState): {
  json: string;
  schema: object | null;
} {
  let schema: object | null = null;

  switch (state.schemaType) {
    case "Organization":
      schema = generateOrganizationSchema(state.organization);
      break;
    case "WebSite":
      schema = generateWebSiteSchema(state.website);
      break;
    case "Article":
      schema = generateArticleSchema(state.article);
      break;
    case "FAQPage":
      schema = generateFAQSchema(state.faq);
      break;
    case "BreadcrumbList":
      schema = generateBreadcrumbSchema(state.breadcrumb);
      break;
  }

  if (!schema) {
    return { json: "", schema: null };
  }

  const json = JSON.stringify(schema, null, 2);
  return { json, schema };
}

export function generateJsonLdOutput(
  state: Partial<JsonLdState>
): ToolOutput {
  const s: JsonLdState = {
    ...DEFAULT_STATE,
    ...state,
    organization: { ...DEFAULT_STATE.organization, ...state.organization },
    website: { ...DEFAULT_STATE.website, ...state.website },
    article: { ...DEFAULT_STATE.article, ...state.article },
    faq: { ...DEFAULT_STATE.faq, ...state.faq },
    breadcrumb: { ...DEFAULT_STATE.breadcrumb, ...state.breadcrumb },
  };

  const { json, schema } = generateJsonLd(s);

  if (!schema) {
    return {
      type: "json",
      content: "",
      preview: `
        <div style="padding:16px;text-align:center;color:rgba(120,120,120,1);">
          Fill in the required fields to generate JSON-LD
        </div>
      `.trim(),
    };
  }

  const scriptTag = `<script type="application/ld+json">\n${json}\n</script>`;

  const previewHtml = `
    <div>
      <div style="font-size:12px;color:rgba(120,120,120,1);margin-bottom:8px;">
        ${s.schemaType} Schema
      </div>
      <pre style="margin:0;white-space:pre-wrap;word-break:break-word;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:11px;line-height:1.5;max-height:400px;overflow:auto;">
${escapeHtml(json)}
      </pre>
    </div>
  `.trim();

  return {
    type: "files",
    content: scriptTag,
    files: [
      {
        filename: "schema.json",
        content: json,
        mimeType: "application/json",
      },
      {
        filename: "schema-script.html",
        content: scriptTag,
        mimeType: "text/html",
      },
    ],
    preview: previewHtml,
  };
}
