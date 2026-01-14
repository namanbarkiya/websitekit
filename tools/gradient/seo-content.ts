import type { ToolSeo } from "../content-types";

export const seo: ToolSeo = {
  meta: {
    title: "Create CSS gradients for UI – Free CSS Gradient Generator",
    description:
      "Need to create CSS gradients for UI? Generate clean gradient code you can paste into your styles without images in seconds with this free tool.",
    infoTitle: "How to Create CSS Gradients – Gradient Guide",
    infoDescription:
      "Learn what CSS gradients are, how to use them in UI design, and common mistakes that hurt readability.",
    keywords: ["css gradient", "linear gradient", "radial gradient", "css"],
  },
  concept: "CSS gradients",
  definition:
    "CSS gradients are color transitions defined in CSS that render smooth blends without image files.",
  whatIs:
    "A CSS gradient generator creates linear or radial gradient code you can paste directly into your stylesheets. Gradients add visual depth to backgrounds, buttons, and sections without requiring image files. This tool lets you pick colors, adjust stops, and preview the result before copying the CSS.",
  features: [
    "Generate linear and radial gradients",
    "Customize color stops and positions",
    "Live preview as you adjust",
    "Copy clean CSS code for any project",
    "No images required for smooth visuals",
  ],
  howItWorks: [
    "Choose gradient type and direction",
    "Pick your color stops",
    "Adjust positions for the blend you want",
    "Copy the CSS code into your styles",
  ],
  useCases: [
    "Adding background visuals without images",
    "Creating button or card hover effects",
    "Building consistent UI themes",
    "Prototyping design ideas quickly",
  ],
  whenToUse: [
    "You need lightweight background visuals without images",
    "You want consistent gradients across a design system",
    "You are prototyping new UI themes quickly",
  ],
  commonMistakes: [
    "Using low contrast that reduces text readability",
    "Overusing gradients in busy layouts",
    "Forgetting to test gradients in dark mode",
  ],
  faq: [
    {
      question: "Linear or radial—which should I use?",
      answer:
        "Linear gradients work well for backgrounds and sections. Radial gradients suit circular elements or spotlight effects. Choose based on the shape you want.",
    },
    {
      question: "Can gradients hurt accessibility?",
      answer:
        "Yes, if text over a gradient has poor contrast. Always test readability and consider using solid fallbacks for critical text.",
    },
    {
      question: "Do gradients work in all browsers?",
      answer:
        "Modern CSS gradients are widely supported. Older browsers may need prefixes, but most current browsers handle them natively.",
    },
  ],
  summary: {
    whatThisToolDoes:
      "This tool generates CSS gradient code with live preview. It helps you build lightweight visual backgrounds without images.",
    whenToUse:
      "Use it when you want a fast way to create gradients that stay consistent across your UI.",
    howToUse: [
      "Choose gradient type and direction",
      "Pick your color stops",
      "Adjust positions for the blend you want",
      "Copy the CSS code into your styles",
    ],
    mistakesPrevented:
      "It prevents unreadable gradients and inconsistent color stop usage.",
  },
  relatedTools: ["brand-colors", "svg-shapes"],
};
