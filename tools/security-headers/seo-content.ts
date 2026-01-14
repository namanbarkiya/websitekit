import type { ToolSeo } from "../content-types";

export const seo: ToolSeo = {
  meta: {
    title: "Generate security headers – Free Security Headers Generator",
    description:
      "Need to set security headers for a site? Generate HSTS, CSP, and other header values you can add to your server in seconds with this free tool.",
    infoTitle: "How to Set Security Headers – Security Headers Guide",
    infoDescription:
      "Learn what security headers do, why they matter, and common misconfigurations that weaken protection.",
    keywords: [
      "security headers",
      "hsts",
      "csp",
      "x-frame-options",
      "http headers",
    ],
  },
  concept: "HTTP security headers",
  definition:
    "HTTP security headers are response headers that control browser security behavior and reduce attack surface.",
  whatIs:
    "A security headers generator creates the HTTP response headers that protect your site from common web attacks. Headers like HSTS, Content-Security-Policy, X-Frame-Options, and others tell browsers how to handle your content securely. Instead of researching each header and risking misconfiguration, you select the protections you need and get copy-paste values for your server or CDN.",
  features: [
    "Generate HSTS headers for HTTPS enforcement",
    "Create Content-Security-Policy headers",
    "Add X-Frame-Options to prevent clickjacking",
    "Include X-Content-Type-Options and Referrer-Policy",
    "Output ready for server config or CDN rules",
  ],
  howItWorks: [
    "Select the headers you want to include",
    "Customize values based on your app needs",
    "Generate header values",
    "Apply them in your server or CDN config",
  ],
  useCases: [
    "Hardening a production site before launch",
    "Meeting security compliance requirements",
    "Protecting against XSS and clickjacking",
    "Configuring CDN or server response headers",
  ],
  whenToUse: [
    "You want baseline protection against common web attacks",
    "You are hardening a production site before launch",
    "You need to align with security best practices",
  ],
  commonMistakes: [
    "Using overly permissive defaults",
    "Setting headers inconsistently across routes",
    "Forgetting to test CSP or permissions policies",
  ],
  faq: [
    {
      question: "What headers should every site have?",
      answer:
        "At minimum: HSTS (if using HTTPS), X-Frame-Options, X-Content-Type-Options, and Referrer-Policy. Add CSP if you can manage it safely.",
    },
    {
      question: "Will HSTS break my site?",
      answer:
        "HSTS forces HTTPS. If your site isn't fully HTTPS-ready, it can cause issues. Test thoroughly before enabling with long max-age or includeSubDomains.",
    },
    {
      question: "What is X-Frame-Options for?",
      answer:
        "It prevents your site from being embedded in iframes on other domains, protecting against clickjacking attacks.",
    },
    {
      question: "Should I use CSP?",
      answer:
        "CSP is powerful but can break things if misconfigured. Start with report-only mode to collect violations, then enforce once stable.",
    },
  ],
  summary: {
    whatThisToolDoes:
      "This tool generates recommended security headers like HSTS, CSP, and X-Frame-Options. It helps you ship a safer baseline quickly.",
    whenToUse:
      "Use it when you are configuring server or CDN headers for production.",
    howToUse: [
      "Select the headers you want to include",
      "Customize values based on your app needs",
      "Generate header values",
      "Apply them in your server or CDN config",
    ],
    mistakesPrevented:
      "It prevents missing headers and unsafe defaults that leave your site exposed.",
  },
  relatedTools: ["csp", "permissions", "meta-tags"],
};
