import type { ToolContent } from "../../content-types";

export const content: ToolContent = {
  whatIs:
    "A robots.txt generator is a tool that creates a valid robots.txt file to tell search engine crawlers which paths they can or can’t access. Instead of writing directives manually, you choose an allow/block policy, add rules, and download a ready-to-ship robots.txt.",
  features: [
    "Generate an allow-all, block-all, or custom robots.txt",
    "Add Allow and Disallow rules (one per line)",
    "Include a Sitemap directive for faster discovery",
    "Download a ready-to-deploy robots.txt file",
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
  ],
};

