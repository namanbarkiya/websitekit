import type { ToolContent } from "../content-types";

export const content: ToolContent = {
  whatIs:
    "A meta tags generator is a tool that creates the HTML code for your webpage's <head> section, including SEO meta tags, Open Graph tags for social sharing, and Twitter Cards. Instead of writing this code manually, you enter your page details and get production-ready HTML to copy into your site.",
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
        "Aim for 150-160 characters. Google typically displays up to 155-160 characters in search results, so keep your most important information at the beginning.",
    },
  ],
};
