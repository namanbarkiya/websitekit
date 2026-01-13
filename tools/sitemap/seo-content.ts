import type { ToolContent } from "../content-types";

/**
 * SEO content for /tools/sitemap/info
 * Keep this content human-first, specific, and up to date.
 */
export const seoContent: ToolContent = {
  whatIs:
    "A sitemap generator creates an XML sitemap (sitemap.xml) that lists the pages you want search engines to crawl and index. Sitemaps help discovery—especially for new sites, large sites, or sites with pages that aren’t easily reachable through links.",
  features: [
    "Generate a valid sitemap.xml quickly",
    "Include only indexable, canonical URLs",
    "Optional last modified dates (lastmod)",
    "Optional changefreq and priority fields (when you need them)",
    "Copyable XML output and downloadable file",
    "Optional sitemap.html output for humans",
    "Works for any site structure (static pages, blogs, docs, apps)",
  ],
  howItWorks: [
    "Enter your site’s base URL (https://example.com)",
    "Add the URLs you want indexed (one per line)",
    "Optionally configure lastmod / changefreq / priority",
    "Generate the sitemap.xml (and optionally sitemap.html)",
    "Host it at /sitemap.xml and reference it in robots.txt",
  ],
  useCases: [
    "Helping Google discover new pages faster",
    "Submitting a sitemap in Google Search Console",
    "Auditing which URLs you actually want indexed",
    "Creating a sitemap for a marketing site or documentation site",
  ],
  faq: [
    {
      question: "Does Google use changefreq and priority in sitemaps?",
      answer:
        "Google has stated it ignores <changefreq> and <priority>. The field that matters most is an accurate <lastmod> when you make meaningful content updates.",
    },
    {
      question: "Should I include noindex pages in my sitemap?",
      answer:
        "No. Include only URLs you want indexed. If a URL is noindex or blocked, keeping it out of the sitemap reduces confusion and crawl waste.",
    },
    {
      question: "What should lastmod represent?",
      answer:
        "Use lastmod only when the page’s primary content changes in a way that matters to users (not minor cosmetic changes). Inaccurate lastmod dates can cause search engines to ignore it.",
    },
    {
      question: "How many URLs can a sitemap contain?",
      answer:
        "A single sitemap is limited to 50,000 URLs or 50MB uncompressed. For larger sites, use multiple sitemaps and a sitemap index file.",
    },
  ],
};

