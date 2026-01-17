import type { ToolSeo } from "../content-types";

export const seo: ToolSeo = {
  meta: {
    title: "Generate preload and preconnect tags – Free Resource Hints Generator",
    description:
      "Need resource hints? Generate preload, preconnect, prefetch, and dns-prefetch tags to speed up your website loading.",
    infoTitle: "How to Use Resource Hints – Preload Guide",
    infoDescription:
      "Learn what resource hints are, when to use preload vs preconnect, and common mistakes to avoid when optimizing page load.",
    keywords: [
      "preload",
      "preconnect",
      "prefetch",
      "dns-prefetch",
      "resource hints",
      "performance",
      "speed",
      "font loading",
    ],
  },
  concept: "resource hints",
  definition:
    "Resource hints are HTML link tags that tell browsers to fetch resources early or establish connections to origins before they're needed.",
  whatIs:
    "Resource hints (preload, preconnect, prefetch, dns-prefetch) are performance optimization tags that instruct browsers to start fetching resources or establishing connections before they're actually needed. Preload fetches critical resources early (like fonts or CSS), preconnect establishes early connections to third-party origins (like Google Fonts or APIs), prefetch hints at resources for the next page navigation, and dns-prefetch resolves DNS early. Used correctly, they can significantly improve perceived page load speed.",
  features: [
    "Generate preload tags for critical resources",
    "Create preconnect tags for third-party origins",
    "Add prefetch hints for next-page resources",
    "Include dns-prefetch for lightweight DNS resolution",
    "Configure crossorigin, as, type, and media attributes",
    "Generate multiple resource hints at once",
  ],
  howItWorks: [
    "Add a resource hint by clicking 'Add Resource Hint'",
    "Select the hint type (preload, preconnect, prefetch, or dns-prefetch)",
    "Enter the URL of the resource or origin",
    "For preload, specify the 'as' attribute (script, style, font, etc.)",
    "Configure optional attributes like crossorigin, type, or media",
    "Generate HTML tags ready to paste into your head section",
  ],
  useCases: [
    "Preloading critical fonts to prevent FOIT (Flash of Invisible Text)",
    "Preconnecting to Google Fonts or CDN origins",
    "Prefetching resources for likely next-page navigation",
    "DNS prefetching for third-party domains",
    "Optimizing above-the-fold CSS and JavaScript loading",
  ],
  whenToUse: [
    "You have critical resources that block rendering",
    "You're loading fonts from external sources",
    "You're using third-party APIs or CDNs",
    "You want to optimize perceived page load speed",
  ],
  commonMistakes: [
    "Preloading too many resources (wastes bandwidth)",
    "Using preload for non-critical resources",
    "Missing the 'as' attribute for preload (required)",
    "Not using crossorigin for cross-origin fonts",
    "Preconnecting to origins you don't actually use",
  ],
  faq: [
    {
      question: "What's the difference between preload and preconnect?",
      answer:
        "Preload fetches a specific resource early (like a font file). Preconnect establishes an early connection to an origin (like fonts.googleapis.com) but doesn't fetch anything yet. Use preload for critical resources, preconnect for third-party origins.",
    },
    {
      question: "Do I need crossorigin for fonts?",
      answer:
        "Yes, if loading fonts from a different origin (like Google Fonts), you need crossorigin='anonymous' for both the preload/preconnect hint and the actual font link tag.",
    },
    {
      question: "Can I use preload for everything?",
      answer:
        "No. Preload should only be used for critical, above-the-fold resources. Overusing it wastes bandwidth and can slow down your page. Use it sparingly for fonts, critical CSS, or blocking JavaScript.",
    },
    {
      question: "What's the difference between prefetch and preload?",
      answer:
        "Preload is for resources needed on the current page. Prefetch is for resources likely needed on the next page navigation. Preload has higher priority and is more aggressive.",
    },
  ],
  summary: {
    whatThisToolDoes:
      "This tool generates resource hint tags (preload, preconnect, prefetch, dns-prefetch) to optimize page load performance by telling browsers to fetch resources or establish connections early.",
    whenToUse:
      "Use it when you want to optimize page load speed, especially for fonts, third-party resources, or critical CSS/JavaScript.",
    howToUse: [
      "Add resource hints for critical resources or third-party origins",
      "Configure the hint type and URL",
      "For preload, specify the 'as' attribute",
      "Generate HTML tags and paste into your head section",
    ],
    mistakesPrevented:
      "It helps avoid missing required attributes, overusing hints, and incorrect crossorigin settings.",
  },
  relatedTools: ["html-head", "meta-tags"],
};
