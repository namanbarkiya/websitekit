import type { ToolSeo } from "../content-types";

export const seo: ToolSeo = {
  meta: {
    title: "Create favicon files for sites – Free Favicon Generator",
    description:
      "Need to generate favicon files for a site? Create ICO and PNG icons plus the HTML link tags for browsers, iOS, and Android in seconds with this free tool.",
    infoTitle: "How to Create Favicons – Favicon Guide",
    infoDescription:
      "Learn what favicons are, which sizes you need, common implementation mistakes, and how to add them to your site correctly.",
    keywords: [
      "favicon",
      "icon",
      "ico",
      "apple touch icon",
      "android icon",
      "browser icon",
    ],
  },
  concept: "favicon files",
  definition:
    "Favicons are small icon files linked in the <head> that represent your site in browser tabs, bookmarks, and app icons.",
  whatIs:
    "A favicon generator creates the icon files your site needs for browser tabs, bookmarks, iOS home screens, and Android app shortcuts. Instead of manually resizing images and writing link tags, you upload a source image and get all the standard sizes plus the HTML to paste into your head. This ensures your brand looks sharp across every platform.",
  features: [
    "Generate favicon.ico for legacy browser support",
    "Create PNG icons in standard sizes (16x16, 32x32, etc.)",
    "Generate Apple touch icons for iOS",
    "Create Android icons for home screen shortcuts",
    "Output HTML link tags ready to paste",
  ],
  howItWorks: [
    "Upload a high-resolution logo or icon",
    "Select the icon sizes you need",
    "Generate and download the icon pack",
    "Paste the provided <link> tags into your head",
  ],
  useCases: [
    "Launching a new site with proper browser icons",
    "Rebranding and updating icons everywhere",
    "Adding iOS and Android app icon support",
    "Fixing missing or blurry favicons",
  ],
  whenToUse: [
    "You are launching a new site and need proper browser icons",
    "You changed branding and need updated icons everywhere",
    "You want correct Apple and Android icon support",
  ],
  commonMistakes: [
    "Only shipping a single favicon size",
    "Missing Apple touch icons or Android icons",
    "Using low-resolution source files that look blurry",
  ],
  faq: [
    {
      question: "What sizes do I need for favicons?",
      answer:
        "At minimum: 16x16 and 32x32 for browsers, 180x180 for Apple touch icon, and 192x192/512x512 for Android. This tool generates the common set.",
    },
    {
      question: "Do I still need .ico files?",
      answer:
        "For broad compatibility, yes. Some older browsers and systems still look for favicon.ico. Including it ensures no platform is left out.",
    },
    {
      question: "What format should my source image be?",
      answer:
        "Start with a high-resolution PNG or SVG (at least 512x512). This ensures clean scaling to all target sizes.",
    },
    {
      question: "Where do I put the favicon files?",
      answer:
        "Place them in your public folder (or site root) and add the link tags to your HTML head. The exact path depends on your framework.",
    },
  ],
  summary: {
    whatThisToolDoes:
      "This tool generates the full favicon set, including PNG, ICO, and platform icons. It also provides the correct HTML <link> tags to paste into your head.",
    whenToUse:
      "Use it when you are setting up a new site or rebranding and want all icons to look sharp across devices.",
    howToUse: [
      "Upload a high-resolution logo or icon",
      "Select the icon sizes you need",
      "Generate and download the icon pack",
      "Paste the provided <link> tags into your head",
    ],
    mistakesPrevented:
      "It prevents missing platform icons, inconsistent sizing, and incorrect head markup that breaks favicon display.",
  },
  relatedTools: ["meta-tags", "html-head", "logo-export"],
};
