/**
 * Unified SEO schema for all tools.
 * Each tool defines ONE ToolSeo object in its own seo-content.ts file.
 * This is the single source of truth for titles, descriptions, and learn-more content.
 */

export interface ToolSeo {
  /** Meta tags for tool page and info page */
  meta: {
    /** Tool page title: "{Verb} {Task} – Free {Tool Name}" (55-60 chars) */
    title: string;
    /** Tool page description: "Need to {task}? {output} in seconds with this free tool." (140-160 chars) */
    description: string;
    /** Info page title: "How to {action} – {Concept} Guide" */
    infoTitle: string;
    /** Info page description: "Learn what {concept} is, why it matters..." */
    infoDescription: string;
    /** Optional keywords for meta tags */
    keywords?: string[];
  };

  /** Core concept (e.g., "robots.txt file", "meta tags") */
  concept: string;
  /** One-liner definition for AEO/GEO (direct factual answer) */
  definition: string;

  /** Info page: detailed explanation of what the tool/concept is */
  whatIs: string;
  /** Info page: list of key features */
  features: string[];
  /** Info page: step-by-step how to use (also used for HowTo schema) */
  howItWorks: string[];
  /** Info page: common use cases */
  useCases: string[];
  /** Info page: "You should use {concept} when:" conditions */
  whenToUse: string[];
  /** Info page: common mistakes this tool helps prevent */
  commonMistakes: string[];
  /** Info page: FAQ items (40-70 word answers, real search phrasing) */
  faq: { question: string; answer: string }[];

  /** Tool page: 4-section summary block under the UI */
  summary: {
    /** What this tool does (2-4 sentences) */
    whatThisToolDoes: string;
    /** When you should use it (2-4 sentences) */
    whenToUse: string;
    /** How to use it (3-4 steps) */
    howToUse: string[];
    /** Common mistakes this tool prevents (2-4 sentences) */
    mistakesPrevented: string;
  };

  /** Related tool IDs for internal linking */
  relatedTools?: string[];
}

/** Default fallback for tools without SEO content */
export const defaultToolSeo: ToolSeo = {
  meta: {
    title: "Free Online Tool – WebsiteKit",
    description:
      "Need to generate output fast? Create clean, production-ready results in seconds with this free tool.",
    infoTitle: "How to Use This Tool – Guide",
    infoDescription:
      "Learn what this tool does, how to use it, common use cases, and answers to frequently asked questions.",
  },
  concept: "online tool",
  definition:
    "A free online tool that generates production-ready output for your website.",
  whatIs:
    "A free online tool that generates production-ready output for your website. Enter your details, click generate, and copy the result directly into your project.",
  features: [
    "Generate production-ready output instantly",
    "Copy and paste directly into your codebase",
    "No signup or account required",
    "Works with any website or framework",
  ],
  howItWorks: [
    "Enter the required information",
    "Click Generate to create your output",
    "Preview and verify the result",
    "Copy the output and use in your project",
  ],
  useCases: [
    "Launching a new website or feature",
    "Fixing issues on existing pages",
    "Standardizing output across projects",
  ],
  whenToUse: [
    "You need quick, correct output without manual work",
    "You want to avoid common mistakes",
    "You are setting up a new project",
  ],
  commonMistakes: [
    "Forgetting required fields",
    "Using incorrect formats",
    "Missing important configuration",
  ],
  faq: [],
  summary: {
    whatThisToolDoes:
      "This tool generates production-ready output you can copy and paste into your project.",
    whenToUse:
      "Use it when you need quick, correct output without manual configuration.",
    howToUse: [
      "Enter the required information",
      "Click Generate",
      "Copy the output",
      "Paste into your project",
    ],
    mistakesPrevented:
      "It helps prevent common configuration errors and missing fields.",
  },
  relatedTools: [],
};
