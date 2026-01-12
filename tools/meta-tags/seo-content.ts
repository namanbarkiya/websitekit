import type { ToolContent } from "../content-types";

/**
 * SEO content for /tools/meta-tags/info
 * Keep this content human-first, specific, and up to date.
 */
export const seoContent: ToolContent = {
  whatIs:
    "A meta tags generator is a tool that produces the HTML you place inside your webpage’s <head> to control how your page appears in Google (title + description) and how it looks when shared on social platforms (Open Graph and Twitter/X cards). Instead of hand-writing dozens of tags and worrying about correctness, you enter your page details once and get a clean, production-ready snippet you can copy into any framework or static site.",
  features: [
    "Generate complete <head> section with all essential meta tags",
    "Include Open Graph tags for Facebook, LinkedIn, and other social platforms",
    "Add Twitter Card meta tags for rich previews on X (Twitter)",
    "Set canonical URLs to prevent duplicate content issues",
    "Configure robots directives to control search engine indexing",
    "Preview how your page will look in search results and social shares",
    "Avoid common SEO mistakes like missing OG image dimensions, inconsistent URLs, or duplicate canonicals",
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
    "Shipping marketing pages quickly without forgetting canonical and social tags",
    "Standardizing metadata across multiple pages or routes in an app",
  ],
  faq: [
    {
      question: "What meta tags should every page have?",
      answer:
        "At minimum: title, meta description, canonical URL, and Open Graph/Twitter tags for social sharing. Many sites also add robots directives and structured data (JSON-LD) where relevant.",
    },
    {
      question: "Do meta keywords help SEO?",
      answer:
        "No. Most major search engines ignore the meta keywords tag. Focus on title, description, canonical, and structured data instead.",
    },
    {
      question: "How long should my meta description be?",
      answer:
        "Aim for 150-160 characters. Google typically displays up to ~155-160 characters on many results, but snippets are device-dependent—front-load the most important information.",
    },
    {
      question: "What’s the difference between Open Graph and Twitter/X tags?",
      answer:
        "Open Graph tags are used by platforms like Facebook and LinkedIn (and many others). Twitter/X has its own set of tags for cards. Adding both ensures consistent previews across platforms.",
    },
    {
      question: "When should I use noindex?",
      answer:
        "Use noindex for pages you don’t want in search results (e.g., staging, duplicate pages, internal tools, thin confirmation pages). Keep important content pages indexable and use canonical URLs to consolidate duplicates.",
    },
    {
      question: "Why is a canonical URL important?",
      answer:
        "Canonical URLs tell search engines which version of a page is the “main” one when there are duplicates (for example http vs https, or URLs with tracking parameters). It helps consolidate ranking signals and prevent duplicate content issues.",
    },
  ],
};
