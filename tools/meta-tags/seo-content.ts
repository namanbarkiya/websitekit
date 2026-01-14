import type { ToolSeo } from "../content-types";

export const seo: ToolSeo = {
  meta: {
    title: "Create meta tags for SEO pages – Free Meta Tags Generator",
    description:
      "Need to create meta tags for a page? Generate title, description, canonical, and social tags you can paste into your head in seconds with this free tool.",
    infoTitle: "How to Create Meta Tags – Meta Tags SEO Guide",
    infoDescription:
      "Learn what meta tags are, why they matter for SEO, common mistakes, and best practices for consistent search and social previews.",
    keywords: [
      "meta tags",
      "seo",
      "open graph",
      "twitter card",
      "canonical",
      "html head",
    ],
  },
  concept: "meta tags",
  definition:
    "Meta tags are HTML snippets in the <head> that describe a page for search engines and social platforms.",
  whatIs:
    "A meta tags generator is a tool that produces the HTML you place inside your webpage's <head> to control how your page appears in Google (title + description) and how it looks when shared on social platforms (Open Graph and Twitter/X cards). Instead of hand-writing dozens of tags and worrying about correctness, you enter your page details once and get a clean, production-ready snippet you can copy into any framework or static site.",
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
  whenToUse: [
    "You are launching a new page and need correct titles and descriptions",
    "You want consistent Open Graph and Twitter previews",
    "You are fixing duplicate or missing metadata across pages",
  ],
  commonMistakes: [
    "Using duplicate titles or descriptions across multiple pages",
    "Forgetting canonical URLs or mixing http/https versions",
    "Missing Open Graph image dimensions or using the wrong URL",
    "Leaving robots directives inconsistent with index goals",
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
      question: "What's the difference between Open Graph and Twitter/X tags?",
      answer:
        "Open Graph tags are used by platforms like Facebook and LinkedIn (and many others). Twitter/X has its own set of tags for cards. Adding both ensures consistent previews across platforms.",
    },
    {
      question: "When should I use noindex?",
      answer:
        "Use noindex for pages you don't want in search results (e.g., staging, duplicate pages, internal tools, thin confirmation pages). Keep important content pages indexable and use canonical URLs to consolidate duplicates.",
    },
    {
      question: "Why is a canonical URL important?",
      answer:
        "Canonical URLs tell search engines which version of a page is the main one when there are duplicates (for example http vs https, or URLs with tracking parameters). It helps consolidate ranking signals and prevent duplicate content issues.",
    },
  ],
  summary: {
    whatThisToolDoes:
      "This tool generates a complete, production-ready set of meta tags for your page. It combines SEO titles, descriptions, canonicals, and social preview tags in one place.",
    whenToUse:
      "Use it when you need a clean, consistent <head> for a new page or when you are fixing inconsistent metadata across a site.",
    howToUse: [
      "Enter your page title, description, and canonical URL",
      "Add optional Open Graph and Twitter details",
      "Generate the tags and copy the HTML snippet",
      "Paste the snippet into your page or layout head",
    ],
    mistakesPrevented:
      "It helps prevent duplicate metadata, missing social tags, and conflicting canonicals that can hurt indexing and previews.",
  },
  relatedTools: ["robots", "sitemap", "canonical-url"],
};
