// Shared types for tool content (AEO/GEO optimized)

export interface ToolContent {
  /** Direct answer for "What is [tool]?" - AEO/GEO optimized */
  whatIs: string;
  /** Feature list */
  features: string[];
  /** Step-by-step usage guide (used for HowTo schema) */
  howItWorks: string[];
  /** Common use cases */
  useCases?: string[];
  /** FAQ items (rendered visibly + as schema) */
  faq?: { question: string; answer: string }[];
}

export const defaultToolContent: ToolContent = {
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
};
