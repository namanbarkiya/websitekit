import type { ToolSeo } from "../content-types";

export const seo: ToolSeo = {
  meta: {
    title: "Create canonical URLs for SEO – Free Canonical URL Generator",
    description:
      "Need to create canonical URLs for pages? Generate the exact <link rel=\"canonical\"> tag to prevent duplicate URL signals in seconds with this free tool.",
    infoTitle: "How to Create Canonical URLs – Canonical Tag Guide",
    infoDescription:
      "Learn what canonical URLs are, why they matter, common mistakes, and how to implement them correctly.",
    keywords: [
      "canonical url",
      "rel canonical",
      "duplicate content",
      "seo",
      "url normalization",
    ],
  },
  concept: "canonical URL",
  definition:
    "A canonical URL is the preferred version of a page that you tell search engines to index when multiple URLs show the same content.",
  whatIs:
    "A canonical URL generator creates the <link rel=\"canonical\"> tag that tells search engines which URL is the preferred (primary) version of a page. Canonicals help consolidate ranking signals when you have duplicates—like tracking parameters, alternate URLs, or trailing slash variations. Instead of manually writing the tag and normalizing URLs, you enter the page URL and get a clean, correctly formatted tag.",
  features: [
    "Generate correct canonical tags for any page URL",
    "Handle www vs non-www and http vs https preferences",
    "Normalize URLs with tracking parameters to clean versions",
    "Configure trailing slash preferences for consistency",
    "Avoid common mistakes like relative canonicals",
    "Preview the normalized URL before copying",
  ],
  howItWorks: [
    "Enter the page URL you want to canonicalize",
    "Choose your URL format preferences (https, www, trailing slash)",
    "Decide whether to strip query parameters",
    "Generate the canonical <link> tag",
    "Copy and add it to the page's <head>",
  ],
  useCases: [
    "Preventing duplicate content from tracking parameters",
    "Standardizing trailing slashes site-wide",
    "Consolidating http/https and www/non-www variants",
    "Cleaning up duplicate category or filter pages",
    "Setting up self-referencing canonicals for all pages",
  ],
  whenToUse: [
    "You have duplicate URLs with parameters or variants",
    "You are migrating to https or changing domain format",
    "You want consistent indexing signals across pages",
  ],
  commonMistakes: [
    "Using relative canonicals instead of absolute URLs",
    "Setting canonicals to non-200 pages",
    "Pointing multiple pages to an unrelated canonical",
    "Having multiple canonical tags on one page",
  ],
  faq: [
    {
      question: "Should every page have a self-referencing canonical?",
      answer:
        "Yes, in most cases. A self-referencing canonical clarifies the preferred URL and reduces duplicate content issues caused by parameters or alternate paths.",
    },
    {
      question: "Can I use relative canonical URLs?",
      answer:
        "It's safer to use absolute canonicals (full https://domain/path). Absolute URLs avoid ambiguity and reduce implementation mistakes.",
    },
    {
      question: "What about trailing slashes?",
      answer:
        "Choose one format (with or without trailing slash), enforce it with redirects, and ensure canonicals match the chosen format consistently.",
    },
    {
      question: "Do canonical tags remove pages from Google?",
      answer:
        "Not exactly. Canonicals are a strong hint about which URL to index and rank. If you need to exclude a page entirely, use noindex instead.",
    },
    {
      question: "Should I strip tracking parameters from canonicals?",
      answer:
        "Yes. Tracking parameters like utm_source create duplicate URLs. Strip them from canonicals to consolidate ranking signals to one clean URL.",
    },
  ],
  summary: {
    whatThisToolDoes:
      "This tool builds correct canonical <link> tags for any page. It normalizes URLs and helps you avoid duplicate content problems by clearly signaling the preferred URL.",
    whenToUse:
      "Use it when you have URL variations, tracking parameters, or migrations that create duplicates.",
    howToUse: [
      "Enter the page URL and your preferred format",
      "Choose whether to strip parameters",
      "Generate the canonical <link> tag",
      "Add it to the page head or metadata config",
    ],
    mistakesPrevented:
      "It prevents canonical chains, conflicting tags, and inconsistent URL formats.",
  },
  relatedTools: ["meta-tags", "robots", "sitemap"],
};
