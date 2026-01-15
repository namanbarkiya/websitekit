import type { ToolSeo } from "../content-types";

export const seo: ToolSeo = {
  meta: {
    title: "Generate JSON-LD schema for SEO – Free JSON-LD Generator",
    description:
      "Need to add JSON-LD schema to a page? Generate valid structured data scripts you can paste into the head or body in seconds with this free tool.",
    infoTitle: "How to Add JSON-LD – Structured Data Guide",
    infoDescription:
      "Learn what JSON-LD is, how it improves SEO clarity, and common mistakes to avoid when adding schema.",
    keywords: [
      "json-ld",
      "schema",
      "structured data",
      "rich snippets",
      "seo",
      "organization schema",
    ],
  },
  concept: "JSON-LD structured data",
  definition:
    "JSON-LD structured data is a standardized script format that describes entities and page content for search engines.",
  whatIs:
    "A JSON-LD schema generator creates structured data that helps search engines and AI systems understand what your site and pages represent—like Organization, WebSite, Article, Product, or FAQ. JSON-LD doesn't guarantee rich results, but it improves clarity, entity understanding, and eligibility for enhanced presentation in search results.",
  features: [
    "Generate Organization and WebSite schema quickly",
    "Create Article schema with author and publisher info",
    "Build FAQ schema from question-answer pairs",
    "Generate Breadcrumb schema for navigation",
    "Valid JSON-LD output ready to paste",
    "Avoid common errors like invalid types or missing required fields",
  ],
  howItWorks: [
    "Pick the schema type you need (Organization, WebSite, Article, FAQ, etc.)",
    "Fill in the required fields (name, url, logo, etc.)",
    "Generate JSON-LD output",
    "Paste into your page head or framework metadata",
    "Validate using Google's Rich Results Test",
  ],
  useCases: [
    "Helping Google understand your brand entity (Organization schema)",
    "Adding breadcrumbs for clearer site hierarchy signals",
    "Marking up articles/blog posts with publish dates and author",
    "Marking up FAQs when the Q&A is visible on-page",
    "Improving eligibility for rich results in search",
  ],
  whenToUse: [
    "You want to mark up organizations, articles, or FAQs",
    "You need richer entity understanding in search",
    "You are validating structured data before launch",
  ],
  commonMistakes: [
    "Using invalid schema types or missing required fields",
    "Marking up content that is not visible on the page",
    "Adding multiple conflicting schemas for the same entity",
    "Not validating schema before deploying",
  ],
  faq: [
    {
      question: "Does schema guarantee rich snippets?",
      answer:
        "No. Schema improves understanding and eligibility, but search engines decide when (and if) to show rich results based on quality, relevance, and trust.",
    },
    {
      question: "Is JSON-LD better than microdata?",
      answer:
        "JSON-LD is generally easier to maintain because it's separated from HTML markup. Many teams prefer it for reliability and cleaner templates.",
    },
    {
      question: "Can I add FAQ schema for SEO?",
      answer:
        "Only mark up FAQs that are visible to users on the page and genuinely answer common questions. Google has reduced FAQ rich result visibility for many sites.",
    },
    {
      question: "Where should I put JSON-LD in my HTML?",
      answer:
        "You can place the script tag in the head or body. Google can parse it from either location. Most teams put it in the head for consistency.",
    },
  ],
  summary: {
    whatThisToolDoes:
      "This tool generates valid JSON-LD markup for common schema types. It helps search engines understand your site's entities and page structure.",
    whenToUse:
      "Use it when you are adding structured data for the first time or validating existing schema.",
    howToUse: [
      "Select a schema type (Organization, Article, FAQ, etc.)",
      "Fill in required fields like name and URL",
      "Generate JSON-LD markup",
      "Paste into the head or page body as a script tag",
    ],
    mistakesPrevented:
      "It helps avoid invalid schema, missing fields, and mismatched visible content.",
  },
  relatedTools: ["meta-tags", "canonical-url", "robots"],
};
