import type { ToolContent } from "../content-types";

/**
 * SEO content for /tools/gradient/info
 * Keep this content human-first, specific, and up to date.
 */
export const seoContent: ToolContent = {
  whatIs:
    "A gradient generator helps you design CSS gradients (linear or radial) and outputs the exact CSS you can paste into your project. Gradients are a lightweight way to create modern backgrounds, hero sections, and UI accents without using large images.",
  features: [
    "Create linear gradients with adjustable angle",
    "Create radial gradients for spotlight-style backgrounds",
    "Add up to 5 color stops with percentage positions",
    "Live preview of the gradient",
    "Copy/download a ready-to-use CSS snippet",
    "Optional fallback background color output",
  ],
  howItWorks: [
    "Choose linear or radial gradient",
    "Pick your colors and adjust stop positions",
    "Set an angle (for linear gradients)",
    "Preview the result",
    "Copy or download the generated CSS",
  ],
  useCases: [
    "Hero section backgrounds",
    "Buttons and call-to-action highlights",
    "Cards and section dividers with subtle depth",
    "Brand-themed backgrounds without heavy images",
  ],
  faq: [
    {
      question: "What’s a good default angle for linear gradients?",
      answer:
        "135deg is a popular modern default (top-left to bottom-right). 90deg goes left-to-right, and 45deg goes bottom-left to top-right.",
    },
    {
      question: "Why include a fallback color?",
      answer:
        "A fallback background-color provides a safe base if gradients are disabled or if a browser fails to render the gradient for any reason.",
    },
    {
      question: "Do gradients hurt performance?",
      answer:
        "CSS gradients are typically lightweight compared to large background images. They can be a great way to improve perceived polish without increasing image payload.",
    },
  ],
};

