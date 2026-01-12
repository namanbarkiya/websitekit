import type { ToolContent } from "../content-types";

/**
 * SEO content for /tools/robots/info
 * Keep this content human-first, specific, and up to date.
 */
export const seoContent: ToolContent = {
  whatIs:
    "A robots.txt generator creates a valid `robots.txt` file that tells crawlers (Google, Bing, and other bots) which URLs they’re allowed to crawl. It’s one of the first files search engines look for on your domain, and it helps prevent wasted crawl budget on admin or duplicate routes. Instead of manually writing directives and risking mistakes, you pick a policy, add allow/disallow paths, and download a ready-to-deploy file.",
  features: [
    "Generate an allow-all, block-all, or custom robots.txt",
    "Add Allow and Disallow rules (one per line)",
    "Include a Sitemap directive for faster discovery",
    "Download a ready-to-deploy robots.txt file",
    "Use production-safe defaults and avoid common misconfigurations",
  ],
  howItWorks: [
    "Choose a policy (allow all, block all, or custom)",
    "Add any Allow/Disallow paths if using custom rules",
    "Optionally include your sitemap URL",
    "Click Generate and download robots.txt",
  ],
  useCases: [
    "Blocking admin or private routes from crawlers",
    "Preventing indexing of staging environments",
    "Pointing crawlers to your sitemap.xml",
    "Reducing crawl noise from search/filter parameter URLs",
    "Blocking internal preview routes or tool UIs from indexing",
  ],
  faq: [
    {
      question: "Does robots.txt hide pages from the internet?",
      answer:
        "No. robots.txt is a set of crawl instructions for compliant bots. It does not enforce access control—use authentication for private content.",
    },
    {
      question: "Should I include a Sitemap line in robots.txt?",
      answer:
        "Usually yes. Adding a Sitemap directive helps crawlers discover your sitemap faster, especially on new sites.",
    },
    {
      question: "What does “Disallow: /” do?",
      answer:
        "It tells crawlers not to crawl any paths on your site for the specified user-agent. It’s commonly used for staging or private sites.",
    },
    {
      question: "Is robots.txt the same as noindex?",
      answer:
        "No. robots.txt controls crawling. noindex is a directive (usually via meta robots) that controls indexing. If you block a page in robots.txt, Google may not crawl it and therefore may not see a noindex tag on that page.",
    },
    {
      question: "Should I block /api or /_next?",
      answer:
        "Generally you don’t need to block Next.js internal assets if they’re not indexable pages. Focus on blocking sensitive/admin areas and low-value or duplicate content routes. When in doubt, keep crawl access open and use noindex on pages you don’t want indexed.",
    },
  ],
};

