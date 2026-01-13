import type { ToolContent } from "../content-types";

/**
 * SEO content for /tools/security-headers/info
 * Keep this content human-first, specific, and up to date.
 */
export const seoContent: ToolContent = {
  whatIs:
    "A security headers generator creates a set of recommended HTTP response headers you can apply at your CDN or server to harden your website. Security headers help prevent common web attacks (like clickjacking), reduce risky browser behavior (like MIME sniffing), and improve user privacy (via Referrer-Policy). Instead of memorizing header syntax and safe defaults, you select your options and get copy‑paste output plus framework-friendly snippets.",
  features: [
    "Generate a baseline set of safe, production-ready security headers",
    "Strict-Transport-Security (HSTS) with configurable max-age / subdomains / preload",
    "X-Content-Type-Options: nosniff (safe default for most sites)",
    "X-Frame-Options (clickjacking protection)",
    "Referrer-Policy with privacy-friendly defaults",
    "Optional cross-origin hardening headers (COOP/CORP) for advanced setups",
    "Export a plain headers.txt you can apply anywhere",
    "Generate a Next.js `headers()` snippet and a `vercel.json` example",
  ],
  howItWorks: [
    "Start with the baseline defaults (good for most HTTPS production sites)",
    "Enable or disable each header based on your needs (iframes, embeds, OAuth popups, etc.)",
    "Tune strictness (for example, HSTS max-age or X-Frame-Options mode)",
    "Generate output files (headers.txt + deployment snippets)",
    "Apply the headers at your hosting layer (recommended) or in your framework config",
    "Test critical flows after enabling: login/OAuth, embedded widgets, iframes, third‑party scripts",
  ],
  useCases: [
    "Hardening a new site before launch",
    "Meeting baseline security requirements for clients",
    "Preventing clickjacking and content sniffing issues",
    "Enabling HSTS safely after confirming HTTPS everywhere",
    "Improving referrer privacy without breaking analytics completely",
  ],
  faq: [
    {
      question: "Where should I set security headers?",
      answer:
        "Set them as close to the edge as possible (CDN/hosting config) so they apply consistently. App-level middleware can work, but edge configuration is usually simpler and more reliable.",
    },
    {
      question: "Which security headers are the best “baseline” for most sites?",
      answer:
        "A common baseline is: Strict-Transport-Security (only if you are HTTPS-only), X-Content-Type-Options: nosniff, X-Frame-Options: SAMEORIGIN, and Referrer-Policy: strict-origin-when-cross-origin. These typically provide meaningful protection with low risk of breaking pages.",
    },
    {
      question: "Can security headers break my site?",
      answer:
        "Yes. HSTS can break access if you still need HTTP anywhere. X-Frame-Options can break embedding/iframes. COOP/CORP can break popups, OAuth flows, hotlinking, or cross-site resource usage. Start conservative, enable incrementally, and test your key user journeys.",
    },
    {
      question: "When should I enable HSTS preload?",
      answer:
        "Only when you’re fully HTTPS-only and ready to meet preload requirements (commonly: max-age ≥ 31536000, includeSubDomains, valid redirects from HTTP→HTTPS). Preload is difficult to roll back quickly because it’s shipped in browsers.",
    },
    {
      question: "Should I enable includeSubDomains in HSTS?",
      answer:
        "Only if every subdomain you control supports HTTPS now and will continue to. If one subdomain is still HTTP (or becomes misconfigured), users who previously visited your site can get “stuck” because browsers will force HTTPS there too.",
    },
    {
      question: "X-Frame-Options vs CSP frame-ancestors — which should I use?",
      answer:
        "X-Frame-Options is simple (DENY or SAMEORIGIN). If you need to allow framing by specific partner domains, use Content-Security-Policy `frame-ancestors` (more flexible). Many sites keep X-Frame-Options as a baseline and move to CSP when they need allow-lists.",
    },
    {
      question: "What does Referrer-Policy affect?",
      answer:
        "It controls how much referrer information (the previous URL) is sent when users click links or load resources. A safer default like strict-origin-when-cross-origin keeps useful same-site referrers while limiting cross-site leakage of full URLs (including paths and query parameters).",
    },
  ],
};

