import type { ToolSeo } from "../content-types";

export const seo: ToolSeo = {
  meta: {
    title: "Generate cookie consent banner – Free GDPR Cookie Consent Generator",
    description:
      "Need a cookie consent banner? Generate a GDPR-compliant cookie consent script with accept/decline buttons. Free cookie banner generator.",
    infoTitle: "How to Add Cookie Consent – GDPR Compliance Guide",
    infoDescription:
      "Learn what cookie consent is, why you need it, GDPR requirements, and how to implement a compliant cookie consent banner on your website.",
    keywords: [
      "cookie consent",
      "cookie banner",
      "gdpr",
      "cookie popup",
      "consent",
      "compliance",
      "banner",
    ],
  },
  concept: "cookie consent",
  definition:
    "Cookie consent is a mechanism that asks users for permission before storing or accessing cookies on their device, required by GDPR and other privacy regulations.",
  whatIs:
    "A cookie consent generator creates a banner or modal that asks users for permission before setting cookies. Under GDPR (General Data Protection Regulation) and similar laws, websites must obtain explicit consent before using non-essential cookies like analytics or advertising. The consent banner should clearly explain what cookies are used for, provide options to accept or decline, and only load tracking scripts after explicit consent. This tool generates a customizable cookie consent implementation with HTML, CSS, and JavaScript.",
  features: [
    "Generate GDPR-compliant cookie consent banner",
    "Customize message, buttons, and appearance",
    "Support for accept, decline, and settings buttons",
    "Link to privacy policy and cookie policy",
    "Store consent preference in cookies",
    "Require explicit consent before loading scripts",
  ],
  howItWorks: [
    "Configure your company name and consent message",
    "Customize appearance (style, position, theme)",
    "Set button text and visibility",
    "Add links to privacy and cookie policies",
    "Configure cookie categories",
    "Generate HTML, CSS, and JavaScript code",
    "Copy and paste into your website",
  ],
  useCases: [
    "Complying with GDPR for EU users",
    "Meeting CCPA requirements for California users",
    "Obtaining consent before using analytics cookies",
    "Providing transparency about cookie usage",
    "Avoiding legal penalties for non-compliance",
  ],
  whenToUse: [
    "You use cookies (especially analytics or advertising)",
    "You operate in the EU or serve EU users",
    "You want to comply with privacy regulations",
    "You collect user data through cookies",
  ],
  commonMistakes: [
    "Not providing a decline option (required by GDPR)",
    "Loading tracking scripts before consent",
    "Making consent banner hard to dismiss",
    "Not linking to privacy policy",
    "Not storing consent preference",
  ],
  faq: [
    {
      question: "Do I need cookie consent?",
      answer:
        "Yes, if you use cookies (especially analytics, advertising, or tracking cookies) and operate in jurisdictions that require it (EU, California). Even if you only use essential cookies, it's good practice to inform users.",
    },
    {
      question: "What's the difference between essential and non-essential cookies?",
      answer:
        "Essential cookies are necessary for the website to function (like session cookies). Non-essential cookies include analytics, advertising, and social media cookies. You need explicit consent for non-essential cookies under GDPR.",
    },
    {
      question: "Can I use implied consent?",
      answer:
        "No, GDPR requires explicit consent. Users must actively accept cookies. Pre-checked boxes or 'continued use implies consent' are not compliant.",
    },
    {
      question: "How long should I store consent?",
      answer:
        "Store consent for a reasonable period (typically 12 months). After expiration, show the consent banner again. The consent preference should be stored in a cookie.",
    },
  ],
  summary: {
    whatThisToolDoes:
      "This tool generates a cookie consent banner that asks users for permission before setting cookies, with options for GDPR compliance and customizable appearance.",
    whenToUse:
      "Use it when you need to comply with GDPR, CCPA, or other privacy regulations, or when you want to obtain consent before using cookies.",
    howToUse: [
      "Configure your company information and consent message",
      "Customize appearance and button options",
      "Add links to privacy and cookie policies",
      "Generate the consent banner code",
      "Copy and paste into your website",
      "Test that tracking scripts only load after consent",
    ],
    mistakesPrevented:
      "It helps avoid non-compliance, missing decline options, loading scripts before consent, and unclear consent mechanisms.",
  },
  relatedTools: ["privacy-policy"],
};
