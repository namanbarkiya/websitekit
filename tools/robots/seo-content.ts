import type { ToolSeo } from "../content-types";

export const seo: ToolSeo = {
  meta: {
    title: "Generate robots.txt rules fast – Free Robots.txt Generator",
    description:
      "Need to generate a robots.txt file? Create allow and disallow rules plus a sitemap line you can copy to the root in seconds with this free tool.",
    infoTitle: "How to Create a robots.txt File – Robots.txt Guide",
    infoDescription:
      "Learn what a robots.txt file does, when to use it, common mistakes, and best practices for controlling search engine crawling.",
    keywords: [
      "robots.txt",
      "crawler",
      "bot",
      "search engine",
      "crawl",
      "disallow",
    ],
  },
  concept: "robots.txt file",
  definition:
    "A robots.txt file is a text file placed at the root of a website that tells search engine crawlers which pages or sections they can access.",
  whatIs:
    "A robots.txt generator creates a valid `robots.txt` file that tells crawlers (Google, Bing, and other bots) which URLs they're allowed to crawl. It's one of the first files search engines look for on your domain, and it helps prevent wasted crawl budget on admin or duplicate routes. Instead of manually writing directives and risking mistakes, you pick a policy, add allow/disallow paths, and download a ready-to-deploy file.",
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
  whenToUse: [
    "You need to block admin or low-value URLs from crawling",
    "You want to guide crawlers to your sitemap",
    "You manage a large or frequently updated site",
  ],
  commonMistakes: [
    "Blocking the entire site with Disallow: /",
    "Blocking CSS or JS needed for rendering",
    "Using robots.txt instead of noindex for removal",
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
      question: "What does Disallow: / do?",
      answer:
        "It tells crawlers not to crawl any paths on your site for the specified user-agent. It's commonly used for staging or private sites.",
    },
    {
      question: "Is robots.txt the same as noindex?",
      answer:
        "No. robots.txt controls crawling. noindex is a directive (usually via meta robots) that controls indexing. If you block a page in robots.txt, Google may not crawl it and therefore may not see a noindex tag on that page.",
    },
    {
      question: "Should I block /api or /_next?",
      answer:
        "Generally you don't need to block Next.js internal assets if they're not indexable pages. Focus on blocking sensitive/admin areas and low-value or duplicate content routes.",
    },
  ],
  summary: {
    whatThisToolDoes:
      "This tool generates a valid robots.txt file with allow and disallow rules. It helps you control crawl access and add a sitemap URL.",
    whenToUse:
      "Use it when you need to control crawl behavior, especially for large sites or sensitive paths.",
    howToUse: [
      "Add user-agent rules for the crawlers you care about",
      "Specify allow and disallow paths",
      "Optionally include your sitemap URL",
      "Generate and copy the robots.txt content",
    ],
    mistakesPrevented:
      "It helps avoid accidentally blocking important pages or forgetting sitemap references.",
  },
  relatedTools: ["sitemap", "meta-tags", "seo-checklist"],
};
