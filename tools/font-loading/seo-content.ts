import type { ToolSeo } from "../content-types";

export const seo: ToolSeo = {
  meta: {
    title: "Generate font loading code – Free Font Display Generator",
    description:
      "Need font loading optimization? Generate @font-face declarations with font-display and preload tags to improve web font performance.",
    infoTitle: "How to Optimize Font Loading – Font Display Guide",
    infoDescription:
      "Learn what font-display does, when to use swap vs optional, and how to prevent FOIT (Flash of Invisible Text) with proper font loading strategies.",
    keywords: [
      "font loading",
      "font-display",
      "swap",
      "optional",
      "fallback",
      "preload",
      "web font",
      "performance",
      "FOIT",
    ],
  },
  concept: "font loading optimization",
  definition:
    "Font loading optimization involves using font-display properties and preload hints to control how web fonts are rendered, preventing invisible text and improving perceived performance.",
  whatIs:
    "A font loading generator creates @font-face CSS declarations with font-display properties and optional preload tags. The font-display property controls how browsers handle text rendering while fonts load: 'swap' shows fallback text immediately and swaps when the font loads (recommended), 'optional' uses the font only if it loads quickly, 'fallback' provides a brief invisible period, and 'block' hides text until fonts load (not recommended). Combined with preload hints, this strategy prevents FOIT (Flash of Invisible Text) and improves perceived page load speed.",
  features: [
    "Generate @font-face declarations with font-display",
    "Create preload tags for critical fonts",
    "Configure font weight, style, and unicode ranges",
    "Set default font-display for all fonts",
    "Override font-display per font",
    "Export CSS and HTML snippets",
  ],
  howItWorks: [
    "Add fonts with font family name and source URL",
    "Configure font weight, style, and optional unicode range",
    "Set default font-display (swap recommended)",
    "Optionally override font-display per font",
    "Enable preload tags for critical fonts",
    "Generate CSS @font-face rules and HTML preload tags",
  ],
  useCases: [
    "Preventing FOIT (Flash of Invisible Text) with font-display: swap",
    "Optimizing Google Fonts or custom web fonts",
    "Preloading critical above-the-fold fonts",
    "Reducing layout shift from font loading",
    "Improving Core Web Vitals (CLS) scores",
  ],
  whenToUse: [
    "You're using web fonts (Google Fonts, custom fonts)",
    "You want to prevent invisible text during font load",
    "You need to optimize font loading performance",
    "You're experiencing layout shift from fonts",
  ],
  commonMistakes: [
    "Using font-display: block (causes invisible text)",
    "Not preloading critical fonts",
    "Missing crossorigin='anonymous' for preloaded fonts",
    "Loading too many font weights/styles",
    "Not using font-display at all",
  ],
  faq: [
    {
      question: "What's the difference between swap and optional?",
      answer:
        "Swap shows fallback text immediately and swaps to the web font when it loads. Optional uses the web font only if it loads within a short time window (usually 100ms), otherwise it skips it entirely. Use swap for most cases, optional for non-critical decorative fonts.",
    },
    {
      question: "Do I need to preload fonts?",
      answer:
        "Preload critical above-the-fold fonts to start loading them earlier. For fonts below the fold or non-critical fonts, preload is optional. Always use crossorigin='anonymous' when preloading fonts from CDNs.",
    },
    {
      question: "What causes FOIT?",
      answer:
        "FOIT (Flash of Invisible Text) happens when browsers use font-display: block or auto, hiding text until fonts load. Use font-display: swap to prevent this by showing fallback text immediately.",
    },
    {
      question: "Can I use font-display with Google Fonts?",
      answer:
        "Yes, but Google Fonts CSS doesn't include font-display by default. You can either use this tool to generate @font-face rules with font-display, or add font-display to your own CSS that overrides Google Fonts.",
    },
  ],
  summary: {
    whatThisToolDoes:
      "This tool generates @font-face CSS declarations with font-display properties and optional preload tags to optimize web font loading and prevent invisible text.",
    whenToUse:
      "Use it when you're loading web fonts and want to prevent FOIT, improve perceived performance, or optimize font loading strategy.",
    howToUse: [
      "Add your fonts with family name and source URL",
      "Configure font-display (swap recommended)",
      "Enable preload for critical fonts",
      "Generate CSS and HTML snippets",
      "Copy into your stylesheet and head section",
    ],
    mistakesPrevented:
      "It helps avoid invisible text, missing preload tags, incorrect crossorigin settings, and using font-display: block.",
  },
  relatedTools: ["preload", "html-head"],
};
