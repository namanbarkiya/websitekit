import type { ToolSeo } from "../content-types";

export const seo: ToolSeo = {
  meta: {
    title: "Generate CSP header – Free Content Security Policy Generator",
    description:
      "Need a CSP header? Build Content Security Policy rules to prevent XSS attacks. Generate CSP headers for Nginx, Apache, or meta tags.",
    infoTitle: "How to Use Content Security Policy – CSP Guide",
    infoDescription:
      "Learn what CSP is, how it prevents XSS attacks, common directives, and best practices for implementing Content Security Policy.",
    keywords: [
      "csp",
      "content security policy",
      "security",
      "xss",
      "header",
      "directive",
      "nonce",
      "hash",
    ],
  },
  concept: "Content Security Policy",
  definition:
    "Content Security Policy (CSP) is a security standard that helps prevent XSS attacks by controlling which resources (scripts, styles, images) can be loaded and executed on a web page.",
  whatIs:
    "A CSP generator creates Content Security Policy headers that specify which sources are allowed to load resources like scripts, styles, images, fonts, and connections. CSP works by whitelisting trusted sources and blocking unauthorized resources. For example, 'script-src \'self\'' allows scripts only from the same origin, preventing malicious inline scripts or scripts from untrusted domains. CSP can be delivered via HTTP headers (recommended) or meta tags, and supports report-only mode for testing before enforcement.",
  features: [
    "Configure all CSP directives (default-src, script-src, style-src, etc.)",
    "Add allowed sources per directive",
    "Generate headers for Nginx, Apache, or meta tags",
    "Test in report-only mode before enforcing",
    "Configure report-uri for violation reporting",
    "Use common values like 'self', 'unsafe-inline', or custom domains",
  ],
  howItWorks: [
    "Enable the directives you want to configure",
    "Add allowed sources for each directive (e.g., 'self', domains, data:)",
    "Configure report-only mode and report URI if needed",
    "Generate CSP header in your preferred format",
    "Add to your server configuration or HTML meta tag",
    "Test in report-only mode, then enforce",
  ],
  useCases: [
    "Preventing XSS attacks by blocking unauthorized scripts",
    "Controlling which domains can load resources",
    "Preventing data exfiltration via connect-src",
    "Blocking inline scripts/styles (use nonces/hashes instead)",
    "Complying with security standards and audits",
  ],
  whenToUse: [
    "You want to prevent XSS attacks",
    "You need to control resource loading",
    "You're implementing security best practices",
    "You're required to have CSP for compliance",
  ],
  commonMistakes: [
    "Using 'unsafe-inline' and 'unsafe-eval' unnecessarily",
    "Not testing in report-only mode first",
    "Setting overly restrictive policies that break functionality",
    "Forgetting to include CDN domains in script-src or style-src",
    "Not using nonces or hashes for inline scripts/styles",
  ],
  faq: [
    {
      question: "What's the difference between CSP header and meta tag?",
      answer:
        "HTTP headers are recommended because they apply to all responses and can't be bypassed. Meta tags are a fallback when you can't set HTTP headers, but they're less secure and only apply to the HTML document.",
    },
    {
      question: "Should I use report-only mode?",
      answer:
        "Yes, always test in report-only mode first. It reports violations without blocking, helping you identify what needs to be allowed before enforcing the policy.",
    },
    {
      question: "How do I allow inline scripts with CSP?",
      answer:
        "Avoid 'unsafe-inline' if possible. Instead, use nonces (random tokens) or hashes. Generate a nonce per request, add it to script tags, and include it in your CSP: 'script-src \'nonce-{value}\''.",
    },
    {
      question: "What does 'self' mean in CSP?",
      answer:
        "'self' means the same origin (same protocol, domain, and port). It's a common value that allows resources from your own domain.",
    },
  ],
  summary: {
    whatThisToolDoes:
      "This tool generates Content Security Policy headers to prevent XSS attacks by controlling which resources can be loaded and executed on your website.",
    whenToUse:
      "Use it when you want to implement CSP for security, prevent XSS attacks, or comply with security standards.",
    howToUse: [
      "Enable and configure CSP directives",
      "Add allowed sources for each directive",
      "Test in report-only mode",
      "Generate CSP header and add to server config",
      "Monitor reports and adjust as needed",
    ],
    mistakesPrevented:
      "It helps avoid overly permissive policies, missing directives, and breaking functionality with overly restrictive rules.",
  },
  relatedTools: ["security-headers", "html-head"],
};
