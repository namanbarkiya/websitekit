import type { ToolContent } from "./content-types";
// Built tools should own a dedicated `seo-content.ts` file.
// Import them here one-by-one as the tool ships.
import { seoContent as metaTagsSeoContent } from "./meta-tags/seo-content";
import { seoContent as qrCodeSeoContent } from "./qr-code/seo-content";
import { seoContent as robotsSeoContent } from "./robots/seo-content";

/**
 * SEO/AEO tool content map
 *
 * Goals:
 * - Unique, helpful copy per tool (avoid thin/duplicate pages)
 * - Clear “what it is / how to use / use cases / FAQs”
 * - Answers reflect current best practices (e.g., robots vs noindex, canonical consistency)
 */
export const toolContentMap: Record<string, ToolContent> = {
  // Built tools (authoritative SEO content lives in each tool folder)
  "meta-tags": metaTagsSeoContent,
  "qr-code": qrCodeSeoContent,
  robots: robotsSeoContent,

  // Locked tools (content still provided; /info is currently noindex until tool ships)
  favicon: {
    whatIs:
      "A favicon generator creates the small icons browsers and platforms use to represent your site—like the tab icon in Chrome, bookmarks, iOS home screen icons, and Android/Windows tiles. Instead of exporting dozens of sizes manually (and forgetting one), you provide a source image and get a complete favicon package plus the exact HTML <link> tags you need.",
    features: [
      "Generate a complete favicon set for modern browsers",
      "Create Apple Touch icons for iOS home screen installs",
      "Create Android/Chrome icons (PWA-ready sizes)",
      "Create Windows tile images and metadata",
      "Export favicon.ico plus PNG variants",
      "Get copy‑paste HTML <link> and <meta> tags",
      "Recommended sizes and filenames that match real platform expectations",
      "No uploads required (runs in your browser)",
    ],
    howItWorks: [
      "Upload a square source image (ideally 512×512 PNG or SVG)",
      "Choose background padding and optional transparency settings",
      "Generate the full icon set (ICO + PNG sizes)",
      "Copy the provided <link> tags into your site’s <head>",
      "Download the files and place them in your public/static folder",
    ],
    useCases: [
      "Launching a new site and needing the full icon package fast",
      "Fixing missing/incorrect favicons in Google Search and browser tabs",
      "Preparing assets for a PWA or “Add to Home Screen”",
      "Standardizing favicon setup across multiple apps or marketing sites",
      "Generating dark/light compatible icon variants",
    ],
    faq: [
      {
        question: "What size should my source image be?",
        answer:
          "Use a square 512×512 (or larger) image. Higher-resolution sources produce sharper downscaled icons. If you start from SVG, export a crisp PNG at 512×512 or 1024×1024.",
      },
      {
        question: "Do I still need favicon.ico?",
        answer:
          "It’s optional, but recommended for maximum compatibility—some older browsers and tooling still look for /favicon.ico by default.",
      },
      {
        question:
          "Why does Google require at least 48×48 for favicons in results?",
        answer:
          "Google expects a square icon of at least 48×48 for eligibility in some search surfaces. Shipping a larger icon (like 192×192) ensures you meet requirements and looks better on high-DPI screens.",
      },
      {
        question: "Where do I put favicon files in Next.js?",
        answer:
          "Place them in /public (or in Next’s app directory using file-based icons). Then reference them using absolute paths like /favicon/favicon-32x32.png so they resolve correctly.",
      },
    ],
  },

  "html-head": {
    whatIs:
      "An HTML head exporter combines the outputs from multiple setup tools—meta tags, favicon links, social cards, and other head metadata—into one clean, production-ready <head> snippet. It’s a way to avoid missing tags, duplicating canonicals, or scattering head config across files.",
    features: [
      "Merge meta tags, Open Graph, and Twitter card tags",
      "Include favicon <link> tags and platform icons",
      "Add canonical URL and robots directives consistently",
      "Generate a single copy‑paste head block",
      "Keep output organized and easy to audit",
      "Works with any framework (Next.js, Remix, Astro, static HTML)",
    ],
    howItWorks: [
      "Select which generators you want to include (meta, icons, etc.)",
      "Fill in the minimal required fields once",
      "Generate the combined <head> snippet",
      "Paste it into your layout template or document head",
      "Re-run any time you update branding or URLs",
    ],
    useCases: [
      "Shipping a landing page quickly without missing SEO tags",
      "Standardizing head markup across a multi-page site",
      "Cleaning up a messy <head> with duplicates and conflicts",
      "Migrating between frameworks while keeping head tags consistent",
    ],
    faq: [
      {
        question: "Can duplicate tags hurt SEO?",
        answer:
          "Yes—especially multiple canonicals, conflicting robots directives, or inconsistent Open Graph URLs. A combined head snippet makes these conflicts easier to prevent and audit.",
      },
      {
        question: "Should I put this in every page?",
        answer:
          "Put shared tags in a global layout, then override page-specific tags (title/description/OG) per page. Avoid repeating identical tags across many pages if your framework already handles them centrally.",
      },
    ],
  },

  sitemap: {
    whatIs:
      "A sitemap generator creates an XML sitemap (sitemap.xml) that lists the pages you want search engines to crawl and index. Sitemaps help discovery—especially for new sites, large sites, or sites with pages that aren’t easily reachable through links.",
    features: [
      "Generate a valid sitemap.xml quickly",
      "Include only indexable, canonical URLs",
      "Optional last modified dates per URL",
      "Support multiple sitemaps and sitemap index (for large sites)",
      "Copyable XML output and downloadable file",
      "Works for any site structure (static pages, blogs, docs, apps)",
    ],
    howItWorks: [
      "Enter your site’s base domain (https://example.com)",
      "Add the URLs you want indexed (one per line)",
      "Optionally set accurate last modified dates for key pages",
      "Generate the sitemap.xml",
      "Host it at /sitemap.xml and reference it in robots.txt",
    ],
    useCases: [
      "Helping Google discover new pages faster",
      "Submitting a sitemap in Google Search Console",
      "Auditing which URLs you actually want indexed",
      "Creating a sitemap for a marketing site or documentation site",
    ],
    faq: [
      {
        question: "Does Google use changefreq and priority in sitemaps?",
        answer:
          "Google has stated it ignores <changefreq> and <priority>. The field that matters most is an accurate <lastmod> when you make meaningful content updates.",
      },
      {
        question: "Should I include noindex pages in my sitemap?",
        answer:
          "No. Include only URLs you want indexed. If a URL is noindex or blocked, keeping it out of the sitemap reduces confusion and crawl waste.",
      },
      {
        question: "What should lastmod represent?",
        answer:
          "Use lastmod only when the page’s primary content changes in a way that matters to users (not minor cosmetic changes). Inaccurate lastmod dates can cause search engines to ignore it.",
      },
      {
        question: "How many URLs can a sitemap contain?",
        answer:
          "A single sitemap is limited to 50,000 URLs or 50MB uncompressed. For larger sites, use multiple sitemaps and a sitemap index file.",
      },
    ],
  },

  "canonical-url": {
    whatIs:
      'A canonical URL generator creates the <link rel="canonical"> tag that tells search engines which URL is the preferred (primary) version of a page. Canonicals help consolidate ranking signals when you have duplicates—like tracking parameters, alternate URLs, or trailing slash variations.',
    features: [
      "Generate correct canonical tags for any page URL",
      "Handle www vs non-www and http vs https preferences",
      "Canonicalize URLs with tracking parameters to clean versions",
      "Avoid common mistakes like canonical chains or relative canonicals",
      "Make URL consistency decisions explicit and repeatable",
    ],
    howItWorks: [
      "Enter the page URL and your preferred site format (https, www, trailing slash)",
      "Choose whether to strip parameters (e.g., utm_source)",
      "Generate the canonical <link> tag",
      "Add it to the page’s <head> (or framework metadata config)",
      "Verify you only output one canonical per page",
    ],
    useCases: [
      "Preventing duplicate content from tracking parameters",
      "Standardizing trailing slashes site-wide",
      "Consolidating http/www variants during a migration",
      "Cleaning up duplicate category/filter pages in e-commerce",
    ],
    faq: [
      {
        question: "Should every page have a self-referencing canonical?",
        answer:
          "Yes, in most cases. A self-referencing canonical clarifies the preferred URL and reduces duplicate content issues caused by parameters or alternate paths.",
      },
      {
        question: "Can I use relative canonical URLs?",
        answer:
          "It’s safer to use absolute canonicals (full https://domain/path). Absolute URLs avoid ambiguity and reduce implementation mistakes.",
      },
      {
        question: "What about trailing slashes?",
        answer:
          "Choose one format (with or without trailing slash), enforce it with redirects, and ensure canonicals match the chosen format consistently.",
      },
      {
        question: "Do canonical tags remove pages from Google?",
        answer:
          "Not exactly. Canonicals are a strong hint about which URL to index and rank. If you need to exclude a page entirely, use noindex (and allow crawling so Google can see it).",
      },
    ],
  },

  "json-ld": {
    whatIs:
      "A JSON-LD schema generator creates structured data that helps search engines and AI systems understand what your site and pages represent—like Organization, WebSite, Article, Product, or FAQ. JSON-LD doesn’t guarantee rich results, but it improves clarity, entity understanding, and eligibility for enhanced presentation.",
    features: [
      "Generate Organization and WebSite schema quickly",
      "Create page-specific schemas (Article, FAQ, Breadcrumb, Product, etc.)",
      'Valid JSON-LD output ready to paste into <script type="application/ld+json">',
      "Avoid common errors like invalid types or missing required fields",
      "Keep schemas consistent across pages and environments",
    ],
    howItWorks: [
      "Pick the schema type you need (Organization, WebSite, Article, FAQ, etc.)",
      "Fill in the required fields (name, url, logo, etc.)",
      "Generate JSON-LD output",
      "Paste into your page head or framework metadata",
      "Validate using Google’s Rich Results Test / Schema validators",
    ],
    useCases: [
      "Helping Google understand your brand entity (Organization schema)",
      "Adding breadcrumbs for clearer site hierarchy signals",
      "Marking up articles/blog posts with publish dates and author",
      "Marking up FAQs (when the Q&A is visible on-page)",
    ],
    faq: [
      {
        question: "Does schema guarantee rich snippets?",
        answer:
          "No. Schema improves understanding and eligibility, but search engines decide when (and if) to show rich results based on quality, relevance, and trust.",
      },
      {
        question: "Is JSON-LD better than microdata?",
        answer:
          "JSON-LD is generally easier to maintain because it’s separated from HTML markup. Many teams prefer it for reliability and cleaner templates.",
      },
      {
        question: "Can I add FAQ schema for SEO?",
        answer:
          "Only mark up FAQs that are visible to users on the page and genuinely answer common questions. Google has reduced FAQ rich result visibility for many sites, but well-structured FAQs still help users and AI answers.",
      },
    ],
  },

  "seo-checklist": {
    whatIs:
      "An SEO checklist tool helps you audit the fundamentals that impact ranking and crawlability—titles, descriptions, indexability, canonical URLs, sitemaps, robots rules, structured data, and page experience basics. It’s designed to turn SEO into an actionable pre-launch checklist instead of guesswork.",
    features: [
      "Check title and description completeness and uniqueness",
      "Spot indexability issues (noindex, robots blocking, canonical conflicts)",
      "Verify sitemap and robots.txt setup",
      "Confirm Open Graph/Twitter previews for social sharing",
      "Identify common technical SEO pitfalls before launch",
      "Generate a prioritized “fix first” list",
    ],
    howItWorks: [
      "Enter your site URL (or paste your intended metadata)",
      "Run the checklist across key pages (home, pricing, blog, etc.)",
      "Fix high-impact issues first (indexability/canonicals/sitemaps)",
      "Re-run to confirm everything is consistent",
      "Ship with confidence",
    ],
    useCases: [
      "Pre-launch SEO audit for a new site",
      "Quick QA before a marketing campaign",
      "Technical SEO sanity check during a migration",
      "Keeping metadata consistent across many pages",
    ],
    faq: [
      {
        question: "What are the highest-impact SEO issues?",
        answer:
          "Indexing blockers (noindex/robots), wrong canonicals, missing/duplicated titles, and broken internal linking. Fix crawl and indexing first—then optimize content and performance.",
      },
      {
        question: "Is SEO just metadata?",
        answer:
          "No. Metadata helps click-through and clarity, but rankings also depend on page quality, intent match, internal linking, and real usefulness. This checklist focuses on the technical foundation so content can compete.",
      },
    ],
  },

  "social-preview": {
    whatIs:
      "A social preview image generator creates Open Graph images (typically 1200×630) and Twitter/X card images so your links look great when shared. Strong social previews improve click-through, trust, and brand consistency—especially for landing pages and blog posts.",
    features: [
      "Generate standard Open Graph images (1200×630)",
      "Generate Twitter/X large card images",
      "Apply brand colors, logo, and typography",
      "Export optimized PNGs for fast loading",
      "Create reusable templates for multiple pages",
      "Avoid blurry/incorrect crops on social platforms",
    ],
    howItWorks: [
      "Choose a template and enter headline/subtitle text",
      "Upload or select a logo and brand color",
      "Generate preview images",
      "Download and host the images at stable URLs",
      "Add og:image and twitter:image meta tags to your page",
    ],
    useCases: [
      "Making landing pages look trustworthy on share",
      "Improving click-through on social campaigns",
      "Creating consistent previews across a blog",
      "Generating announcement cards for product launches",
    ],
    faq: [
      {
        question: "What size should an Open Graph image be?",
        answer:
          "1200×630 is the most widely compatible default. Keep text away from edges and ensure important content sits in the safe area to avoid crops.",
      },
      {
        question: "Should I use the same image for Twitter/X and Open Graph?",
        answer:
          "You can, but dedicated Twitter images sometimes perform better. If you keep one, ensure it reads well at smaller sizes and high compression.",
      },
    ],
  },

  "logo-export": {
    whatIs:
      "A logo export helper generates practical logo variants (light/dark, icon-only, padded versions) and exports them in formats teams actually use—SVG for crisp scaling and PNG for compatibility. It’s designed to reduce brand inconsistency and asset chaos across web, mobile, and docs.",
    features: [
      "Create light and dark logo variants",
      "Generate icon-only and wordmark variants",
      "Export SVG for web and PNG for broad compatibility",
      "Add safe padding for favicons and social previews",
      "Preview on light/dark backgrounds",
      "Suggested sizes for common usage (header, footer, OG, app icons)",
    ],
    howItWorks: [
      "Upload your base logo (SVG or high-res PNG)",
      "Pick variants you need (light/dark/icon-only)",
      "Preview on different backgrounds",
      "Export files in recommended sizes",
      "Drop into your project’s asset pipeline",
    ],
    useCases: [
      "Preparing assets for a new website launch",
      "Standardizing brand exports for a team",
      "Creating a clean icon mark for favicons and app icons",
      "Ensuring the logo is readable in dark mode",
    ],
    faq: [
      {
        question: "SVG or PNG—what should I use?",
        answer:
          "Use SVG for crisp scaling on the web. Use PNG when a platform doesn’t accept SVG, or when you need a rasterized image at a fixed size.",
      },
      {
        question: "Why do I need padded variants?",
        answer:
          "Platforms crop icons differently. A padded variant prevents the logo from feeling cramped or getting clipped when used as an icon, favicon, or social image.",
      },
    ],
  },

  "brand-colors": {
    whatIs:
      "A brand color palette helper expands a single primary brand color into a usable palette—tints, shades, and semantic roles—so your UI stays consistent and accessible. It can also generate CSS variables for easy drop-in use in Tailwind, CSS, or design systems.",
    features: [
      "Generate a full palette from one brand color",
      "Create light/dark-friendly ramps (50–900 style scales)",
      "Suggest accessible foreground/background pairings",
      "Export CSS variables for fast integration",
      "Help standardize color usage across components",
    ],
    howItWorks: [
      "Enter your primary brand color (hex)",
      "Generate a scale of tints and shades",
      "Pick semantic roles (primary, muted, accent, danger, etc.)",
      "Validate contrast for key UI states",
      "Export CSS variables or tokens",
    ],
    useCases: [
      "Building a design system from a single brand color",
      "Creating accessible buttons and text colors",
      "Setting up dark mode color ramps",
      "Exporting consistent tokens for multiple apps",
    ],
    faq: [
      {
        question: "What contrast should I aim for?",
        answer:
          "For body text, WCAG AA commonly targets 4.5:1 contrast. For larger text, 3:1 may be acceptable. Always test critical UI states like disabled and error messages.",
      },
    ],
  },

  preload: {
    whatIs:
      "A preload and preconnect generator creates resource hint <link> tags that improve performance by warming up connections (preconnect) and prioritizing critical resources (preload). Used correctly, resource hints reduce time-to-first-render and improve Core Web Vitals—used incorrectly, they can waste bandwidth.",
    features: [
      "Generate preload tags for critical fonts and hero images",
      "Generate preconnect tags for third-party domains (fonts, analytics, APIs)",
      "Generate dns-prefetch tags for low-risk connection warming",
      "Correct rel/as/crossorigin attributes (common source of mistakes)",
      "Guidance to avoid overusing hints",
    ],
    howItWorks: [
      "List critical resources (fonts, CSS, hero images) and their URLs",
      "List important third-party origins (e.g., fonts.gstatic.com)",
      "Generate the correct <link> tags",
      "Paste into your <head> or framework metadata",
      "Measure impact with Lighthouse and WebPageTest",
    ],
    useCases: [
      "Speeding up font loading without layout shift",
      "Reducing latency to third-party APIs and CDNs",
      "Improving LCP by preloading the hero image",
      "Optimizing marketing pages for Core Web Vitals",
    ],
    faq: [
      {
        question: "Should I preload everything?",
        answer:
          "No. Preload only the resources required for the initial viewport (like the primary font file or hero image). Too many preloads compete for bandwidth and can slow the page.",
      },
      {
        question: "What’s the difference between preconnect and dns-prefetch?",
        answer:
          "dns-prefetch resolves DNS only. preconnect goes further and opens TCP/TLS connections so the first request is faster. Use preconnect sparingly for truly critical origins.",
      },
    ],
  },

  "font-loading": {
    whatIs:
      "A font loading strategy tool helps you choose a loading approach that balances aesthetics, speed, and layout stability. It generates CSS and <link> tags for strategies like font-display: swap, preloading critical fonts, and using good fallback stacks to reduce CLS and FOIT.",
    features: [
      "Recommend font-display strategies (swap/optional/block)",
      "Generate preload tags for critical font files",
      "Suggest fallback stacks that reduce layout shift",
      "Help prevent FOIT (Flash of Invisible Text)",
      "Guidance for variable fonts vs multiple files",
    ],
    howItWorks: [
      "Choose your font source (self-hosted, Google Fonts, etc.)",
      "Select a strategy (swap/optional) and whether to preload",
      "Generate CSS and <link> tags",
      "Add to your project (global CSS or layout)",
      "Test CLS and LCP in Lighthouse",
    ],
    useCases: [
      "Reducing layout shift caused by late font swaps",
      "Improving perceived performance on landing pages",
      "Self-hosting fonts for better control and caching",
      "Tuning typography for mobile performance",
    ],
    faq: [
      {
        question: "What’s a safe default for font-display?",
        answer:
          "font-display: swap is a common default: it shows fallback text immediately and swaps to the custom font when ready, reducing invisible text at the cost of a possible swap.",
      },
      {
        question: "Should I preload fonts?",
        answer:
          "Only preload truly critical fonts used above the fold. Preloading too many fonts can slow the page and waste bandwidth.",
      },
    ],
  },

  "image-guide": {
    whatIs:
      "An image optimization guide helps you choose the right formats, sizes, and loading patterns so images look great without slowing down your pages. It covers modern formats like WebP and AVIF, responsive srcset usage, and lazy-loading best practices for Core Web Vitals.",
    features: [
      "Format guidance (AVIF/WebP/JPEG/PNG/SVG) by use case",
      "Responsive sizing and srcset recommendations",
      "Lazy-loading and priority loading best practices",
      "Compression tips that preserve quality",
      "Guidance for LCP images and above-the-fold assets",
    ],
    howItWorks: [
      "Identify which images are above the fold (LCP candidates)",
      "Choose the optimal format per image type (photo vs illustration vs icon)",
      "Generate recommended sizes for responsive breakpoints",
      "Apply lazy-loading to below-the-fold images",
      "Measure with Lighthouse and real-user metrics",
    ],
    useCases: [
      "Improving Core Web Vitals on marketing pages",
      "Reducing bandwidth costs for image-heavy sites",
      "Shipping sharper images on retina displays",
      "Fixing slow LCP caused by oversized hero images",
    ],
    faq: [
      {
        question: "AVIF or WebP—what should I use?",
        answer:
          "AVIF often compresses smaller at similar quality but can be slower to encode. WebP has broad support and is a great default. Many setups serve AVIF with WebP/JPEG fallbacks.",
      },
      {
        question: "When should I lazy-load images?",
        answer:
          "Lazy-load images that are below the fold. Do not lazy-load the primary hero/LCP image—load it eagerly or prioritize it to improve LCP.",
      },
    ],
  },

  minifier: {
    whatIs:
      "A code minifier reduces HTML, CSS, or JavaScript size by removing unnecessary whitespace, comments, and sometimes shortening identifiers. Smaller assets download faster, which can improve performance metrics—especially on mobile and slower connections.",
    features: [
      "Minify HTML, CSS, and JavaScript snippets",
      "Reduce file size while preserving behavior",
      "Preview minified output before copying",
      "Copy or download the minified result",
      "Useful for quick experiments and embedded snippets",
    ],
    howItWorks: [
      "Paste your code snippet (HTML/CSS/JS)",
      "Select minification type and options",
      "Generate the minified output",
      "Copy the result into your project or embed",
      "Test to ensure behavior matches the original",
    ],
    useCases: [
      "Reducing payload size for inline scripts or widgets",
      "Minifying small code snippets for performance audits",
      "Cleaning up copy-pasted code before embedding",
      "Quickly generating compressed HTML for emails or embeds",
    ],
    faq: [
      {
        question: "Is minification enough to make my site fast?",
        answer:
          "It helps, but speed usually comes from a bundle of optimizations: caching, code splitting, image optimization, and reducing third-party scripts. Minification is one piece of the puzzle.",
      },
      {
        question: "Can minification break code?",
        answer:
          "It can if a minifier is misconfigured or the code relies on formatting quirks. Always test after minifying, especially for JavaScript that depends on automatic semicolon insertion edge cases.",
      },
    ],
  },

  "security-headers": {
    whatIs:
      "A security headers generator produces recommended HTTP response headers that protect your site against common attacks like clickjacking, MIME sniffing, and some forms of data leakage. Instead of hunting down syntax and defaults, you select your needs and get a set of headers you can paste into your CDN, server, or framework config.",
    features: [
      "Generate production-safe defaults for common security headers",
      "Include HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and more",
      "Create framework-friendly snippets (platform-agnostic output)",
      "Avoid dangerous misconfigurations (like overly strict policies that break the site)",
      "Quickly audit and compare recommended vs current headers",
    ],
    howItWorks: [
      "Choose your deployment target (CDN, server, framework config)",
      "Select the headers you want and their strictness",
      "Generate the header set",
      "Apply in your hosting layer (preferred) or server middleware",
      "Test critical flows (auth, embeds, assets) after enabling",
    ],
    useCases: [
      "Hardening a new site before launch",
      "Meeting baseline security requirements for enterprise clients",
      "Preventing clickjacking and content sniffing issues",
      "Adding HSTS safely after verifying HTTPS everywhere",
    ],
    faq: [
      {
        question: "Where should I set security headers?",
        answer:
          "Set them as close to the edge as possible (CDN/hosting config) so they apply consistently. App-level middleware can work, but edge configuration is usually simpler and more reliable.",
      },
      {
        question: "Can security headers break my site?",
        answer:
          "Yes—especially CSP. Start with conservative defaults, roll out changes gradually, and test key pages and third-party scripts (analytics, embeds) before enforcing strict policies.",
      },
      {
        question: "When should I enable HSTS?",
        answer:
          "Only after you’re confident all traffic is served over HTTPS and you won’t need HTTP access (including subdomains, if you include them). Misconfigured HSTS can lock users out until it expires.",
      },
    ],
  },

  csp: {
    whatIs:
      "A Content Security Policy (CSP) generator helps you create a CSP header that reduces XSS risk by controlling which scripts, styles, images, and connections your site is allowed to load. Modern best practice uses nonces or hashes (and sometimes strict-dynamic) instead of unsafe-inline.",
    features: [
      "Generate CSP policies with safe defaults",
      "Support nonce- or hash-based script policies",
      "Include common directives (default-src, script-src, style-src, img-src, connect-src, frame-ancestors)",
      "Optional Report-Only mode to test safely before enforcing",
      "Avoid common foot-guns like overly broad wildcards or unsafe-inline",
    ],
    howItWorks: [
      "List the origins your site must load resources from (self, CDN, analytics, APIs)",
      "Choose whether you can use nonces/hashes for scripts",
      "Generate the CSP header (Report-Only first, recommended)",
      "Collect violations and adjust allow-lists",
      "Switch to enforced CSP once stable",
    ],
    useCases: [
      "Reducing XSS risk on marketing and app pages",
      "Hardening an app that uses third-party scripts",
      "Meeting security compliance requirements",
      "Debugging which third-party resources your site actually loads",
    ],
    faq: [
      {
        question: "What’s a safe way to roll out CSP?",
        answer:
          "Start with Content-Security-Policy-Report-Only to collect violations without breaking the page. Once you’ve fixed/allowed what you need, enforce the policy.",
      },
      {
        question: "Should I use unsafe-inline?",
        answer:
          "Avoid it if possible. Prefer nonces or hashes for inline scripts. unsafe-inline weakens CSP and reduces protection against XSS.",
      },
      {
        question: "What does strict-dynamic do?",
        answer:
          "With nonce/hash-based policies, strict-dynamic allows trusted scripts to load additional scripts dynamically without maintaining a huge allow-list. It can simplify modern setups but should be used carefully and tested.",
      },
      {
        question: "Do I need CSP if I’m using a modern framework?",
        answer:
          "Frameworks help, but CSP adds an extra layer of defense. It’s most valuable when you have third-party scripts, user-generated content, or complex pages.",
      },
    ],
  },

  permissions: {
    whatIs:
      "A Permissions Policy generator creates the Permissions-Policy header that controls which browser features your site can use (camera, microphone, geolocation, fullscreen, etc.). It reduces privacy risk and limits the impact of compromised third-party scripts by restricting powerful APIs.",
    features: [
      "Generate a Permissions-Policy header quickly",
      "Lock down sensitive APIs (camera, mic, geolocation) by default",
      "Allow specific features only where needed",
      "Support embedded contexts and third-party frames",
      "Easy copy‑paste output for CDNs and server configs",
    ],
    howItWorks: [
      "Choose which features should be enabled or disabled",
      "Optionally scope permissions to self or specific origins",
      "Generate the header",
      "Apply at the hosting layer",
      "Verify behavior on pages that require those features",
    ],
    useCases: [
      "Preventing accidental camera/mic prompts on pages",
      "Hardening sites with third-party widgets or iframes",
      "Meeting privacy/security baseline requirements",
      "Restricting features to specific subdomains or routes",
    ],
    faq: [
      {
        question: "Is Permissions-Policy the same as CSP?",
        answer:
          "No. CSP controls where resources can load from. Permissions-Policy controls which browser features are allowed. They complement each other.",
      },
      {
        question: "Will this stop browsers from showing permission prompts?",
        answer:
          "If you disable a feature via Permissions-Policy, the feature won’t be available and prompts won’t appear for that feature—helpful for avoiding surprises from third-party scripts.",
      },
    ],
  },

  "privacy-policy": {
    whatIs:
      "A privacy policy generator produces a baseline privacy policy template you can customize for your website or app. It’s not legal advice, but it helps you get a solid starting point that covers common data collection scenarios (analytics, contact forms, cookies) in clear language.",
    features: [
      "Generate a privacy policy template quickly",
      "Include common sections (data collected, purpose, sharing, retention, user rights)",
      "Optional sections for analytics, email capture, and third-party providers",
      "Readable structure suitable for most websites",
      "Export as text/HTML for easy publishing",
    ],
    howItWorks: [
      "Select what your site does (forms, analytics, cookies, payments, etc.)",
      "Fill in your company/site details",
      "Generate a draft policy",
      "Review and tailor to your exact tooling and jurisdiction",
      "Publish and link it in your footer",
    ],
    useCases: [
      "Launching a new site and needing a baseline policy",
      "Adding analytics or email capture and updating compliance docs",
      "Creating a policy page for an MVP",
      "Standardizing policy language across multiple small sites",
    ],
    faq: [
      {
        question: "Is this legal advice?",
        answer:
          "No. It’s a template to speed up drafting. You should review with counsel (or at least carefully verify it matches your actual data practices and local requirements).",
      },
      {
        question: "Do I need a privacy policy if I only have a contact form?",
        answer:
          "Often yes. If you collect personal data (name, email, message), you should disclose what you collect, why, how long you keep it, and how users can contact you about it.",
      },
    ],
  },

  "cookie-consent": {
    whatIs:
      "A cookie consent helper generates a lightweight consent banner pattern and implementation guidance so you can collect consent (when required) before setting non-essential cookies like analytics or marketing tags. The goal is to be compliant without slowing down your site or bloating your UI.",
    features: [
      "Generate copy and UX structure for a consent banner",
      "Support essential vs analytics vs marketing categories",
      "Provide a simple implementation approach (no backend required)",
      "Enable “accept”, “reject”, and “manage preferences” flows",
      "Help avoid loading non-essential scripts before consent",
    ],
    howItWorks: [
      "Choose categories of cookies your site uses",
      "Customize banner text and links (privacy policy, cookie policy)",
      "Generate a minimal script/pattern for storing consent",
      "Gate analytics/marketing scripts behind consent",
      "Test on a fresh session (no prior consent) and on repeat visits",
    ],
    useCases: [
      "Adding analytics and needing consent gating",
      "Launching in jurisdictions that require opt-in for tracking",
      "Reducing compliance risk for marketing campaigns",
      "Building a banner that doesn’t hurt UX or performance",
    ],
    faq: [
      {
        question: "Do I always need a cookie banner?",
        answer:
          "It depends on your jurisdiction and what you load. If you set non-essential tracking cookies (analytics/ads), many regions require consent. Essential cookies for core functionality may not require opt-in.",
      },
      {
        question: "Why should I block analytics before consent?",
        answer:
          "If consent is required, loading analytics before the user accepts defeats the purpose. A good implementation delays non-essential scripts until consent is stored.",
      },
    ],
  },

  placeholder: {
    whatIs:
      "A placeholder image generator creates quick placeholder images you can use during development, wireframes, or content staging. It outputs predictable sizes and colors so your layouts don’t shift while real images are still being produced.",
    features: [
      "Generate placeholders at any width/height",
      "Custom background and text colors",
      "Export as SVG/PNG (depending on needs)",
      "Copy a URL or download a file for local use",
      "Great for prototyping responsive layouts",
    ],
    howItWorks: [
      "Enter width and height",
      "Choose background/text colors and optional label text",
      "Generate the placeholder image",
      "Copy the URL or download the asset",
      "Swap placeholders with real images later",
    ],
    useCases: [
      "Designing layouts before images are ready",
      "Testing responsive grids and aspect ratios",
      "Creating skeleton content for demos",
      "Stubbing out CMS-driven pages during development",
    ],
    faq: [
      {
        question: "SVG or PNG placeholders?",
        answer:
          "SVG is great for crisp, tiny placeholders and scales perfectly. PNG is useful when a platform requires raster images or you need exact pixel rendering.",
      },
      {
        question: "Will placeholders affect SEO?",
        answer:
          "Placeholders are mainly for development. For production, ensure real images have descriptive alt text and that your LCP image is properly optimized and prioritized.",
      },
    ],
  },

  gradient: {
    whatIs:
      "A gradient generator helps you design linear or radial gradients and outputs the exact CSS you can paste into your project. It’s a fast way to create polished backgrounds, hero sections, and UI accents without guessing color stops.",
    features: [
      "Create linear and radial gradients",
      "Adjust angle/direction and multiple color stops",
      "Live preview of the gradient",
      "Copy CSS background declarations",
      "Export reusable gradient tokens for design systems",
    ],
    howItWorks: [
      "Pick gradient type (linear or radial)",
      "Choose 2+ colors and position stops",
      "Adjust angle (for linear) or shape/position (for radial)",
      "Copy the generated CSS",
      "Use it in your stylesheet or Tailwind config",
    ],
    useCases: [
      "Designing hero backgrounds quickly",
      "Creating subtle UI depth without images",
      "Standardizing gradients in a design system",
      "Generating background tokens for dark mode",
    ],
    faq: [
      {
        question: "Do gradients impact performance?",
        answer:
          "CSS gradients are generally lightweight compared to large images. They can be a great alternative to heavy background images, especially for simple visual effects.",
      },
      {
        question: "How do I avoid banding?",
        answer:
          "Use subtle color transitions, add more intermediate stops, and consider a tiny noise overlay for large, flat gradients where banding is noticeable on some displays.",
      },
    ],
  },

  "svg-shapes": {
    whatIs:
      "An SVG shapes (blob) generator creates organic vector shapes you can use as backgrounds, section dividers, or decorative elements. Because the output is SVG, it scales cleanly on any screen and stays sharp in both light and dark themes.",
    features: [
      "Generate organic blob/shapes with adjustable complexity",
      "Export clean SVG markup for direct embedding",
      "Customize fill color and sizing",
      "Use as backgrounds, masks, or section separators",
      "Works well with motion/animation libraries",
    ],
    howItWorks: [
      "Choose a shape style and complexity level",
      "Adjust size and smoothing",
      "Pick a fill color (or keep it currentColor for theming)",
      "Generate the SVG and copy/download it",
      "Embed in your page or use as a background image",
    ],
    useCases: [
      "Adding modern background decoration to landing pages",
      "Creating section dividers for long pages",
      "Generating themed shapes for dark mode",
      "Making hero sections feel unique without heavy images",
    ],
    faq: [
      {
        question: "Should I inline SVG or use it as a file?",
        answer:
          "Inline SVG is easiest when you need theming (currentColor) or animation. Using a file is great for reuse across pages. Both are valid—choose based on how you’ll use it.",
      },
      {
        question: "Will SVG bloat my HTML?",
        answer:
          "It can if you inline huge paths everywhere. For repeated usage, store it as an asset and reference it, or keep paths reasonably simple.",
      },
    ],
  },
};
