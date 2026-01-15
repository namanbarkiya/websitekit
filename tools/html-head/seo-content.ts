import type { ToolSeo } from "../content-types";

export const seo: ToolSeo = {
  meta: {
    title: "Generate HTML head snippet – Free HTML Head Generator",
    description:
      "Need a complete HTML head snippet? Combine meta tags, favicons, Open Graph, and PWA tags into one ready-to-use head section.",
    infoTitle: "How to Build an HTML Head Section – Complete Guide",
    infoDescription:
      "Learn what goes in the HTML head, how to combine meta tags and icons, and common mistakes to avoid when building head sections.",
    keywords: [
      "html head",
      "head tag",
      "meta tags",
      "favicon",
      "open graph",
      "pwa",
      "seo",
      "snippet",
    ],
  },
  concept: "HTML head section",
  definition:
    "The HTML head section contains metadata, links to resources, and configuration that browsers and search engines use to understand and display your page.",
  whatIs:
    "An HTML head generator combines all the essential elements that belong in the <head> section of an HTML document—meta tags for SEO, Open Graph tags for social sharing, favicon links, canonical URLs, JSON-LD schema, security headers, and PWA configuration. It helps you generate a complete, production-ready head section that you can copy and paste into your HTML or framework metadata.",
  features: [
    "Combine meta tags, Open Graph, and Twitter cards",
    "Include favicon links for all sizes and platforms",
    "Add canonical URLs and JSON-LD schema",
    "Configure PWA meta tags for mobile apps",
    "Add security headers as meta tags",
    "Include custom HTML tags",
    "Generate complete head section or snippet",
  ],
  howItWorks: [
    "Enable the sections you want to include (meta tags, Open Graph, favicons, etc.)",
    "Fill in the fields for each enabled section",
    "Generate the complete HTML head output",
    "Copy the full <head> tag or just the inner content",
    "Paste into your HTML file or framework metadata",
  ],
  useCases: [
    "Building a new website and need a complete head section",
    "Combining outputs from multiple tools (meta tags, favicons, etc.)",
    "Creating a template head section for reuse",
    "Validating that all head elements are properly configured",
    "Exporting head configuration for production deployment",
  ],
  whenToUse: [
    "You are setting up a new website or page",
    "You want to combine multiple head elements in one place",
    "You need a complete, validated head section to copy",
  ],
  commonMistakes: [
    "Missing essential meta tags like viewport or charset",
    "Including conflicting or duplicate tags",
    "Using relative URLs for Open Graph images or canonical URLs",
    "Forgetting to include favicon links for all platforms",
    "Not validating JSON-LD schema before including it",
  ],
  faq: [
    {
      question: "Should I use meta tags or HTTP headers for security?",
      answer:
        "HTTP headers are preferred for security (CSP, HSTS, etc.) because they're more secure and can't be bypassed. Meta tags are a fallback for cases where you can't set HTTP headers, but they're less secure.",
    },
    {
      question: "Can I use this with Next.js or other frameworks?",
      answer:
        "Yes, but you'll need to adapt the output. Next.js uses a Metadata API instead of raw HTML. Use this tool to understand what should be included, then configure it using your framework's metadata system.",
    },
    {
      question: "Do I need all these sections?",
      answer:
        "No. Enable only the sections you need. At minimum, include charset, viewport, title, and description. Add Open Graph, Twitter cards, and favicons as needed for your use case.",
    },
    {
      question: "What's the difference between the full head and snippet?",
      answer:
        "The full head includes the <head> wrapper tags, while the snippet is just the inner content. Use the snippet if you're inserting into an existing <head> tag, or the full head if you're replacing the entire section.",
    },
  ],
  summary: {
    whatThisToolDoes:
      "This tool generates a complete HTML head section by combining meta tags, Open Graph, Twitter cards, favicons, canonical URLs, JSON-LD schema, security headers, and PWA configuration.",
    whenToUse:
      "Use it when you are setting up a new website, combining outputs from multiple tools, or need a validated head section to copy.",
    howToUse: [
      "Enable the sections you want (meta tags, Open Graph, favicons, etc.)",
      "Fill in the required fields for each section",
      "Generate the HTML head output",
      "Copy the full head or snippet and paste into your HTML",
    ],
    mistakesPrevented:
      "It helps avoid missing essential tags, conflicting configurations, and invalid URLs or schema.",
  },
  relatedTools: ["meta-tags", "favicon", "canonical-url", "json-ld"],
};
