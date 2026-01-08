import type { LucideIcon } from "lucide-react";
import {
  BotIcon,
  BuildingIcon,
  CheckSquareIcon,
  CodeIcon,
  CookieIcon,
  FileTextIcon,
  GaugeIcon,
  HammerIcon,
  HeartIcon,
  ImageIcon,
  KeyIcon,
  LinkIcon,
  MapIcon,
  PaletteIcon,
  QrCodeIcon,
  ScrollTextIcon,
  ShareIcon,
  ShieldCheckIcon,
  ShieldIcon,
  SparklesIcon,
  SquareIcon,
  TrendingUpIcon,
  TypeIcon,
  ZapIcon,
} from "lucide-react";

export interface SidebarNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  keywords?: string[];
  category?: string;
  locked?: boolean;
  badge?: "new" | "beta" | "soon";
  /** Show this item in the "Most Used" group in the sidebar */
  mostUsed?: boolean;
}

export interface SidebarNavCategory {
  title: string;
  icon: LucideIcon;
  items: SidebarNavItem[];
}

export interface SidebarConfig {
  main: SidebarNavItem[];
  categories: SidebarNavCategory[];
}

export const sidebarConfig: SidebarConfig = {
  main: [
    {
      title: "All Tools",
      href: "/tools",
      icon: HammerIcon,
      description: "Return to the homepage",
      keywords: ["home", "start", "dashboard", "main", "landing"],
    },
  ],

  categories: [
    // ═══════════════════════════════════════════════════════════════════
    // SETUP & IDENTITY
    // ═══════════════════════════════════════════════════════════════════
    {
      title: "Setup & Identity",
      icon: BuildingIcon,
      items: [
        {
          title: "Meta Tags",
          href: "/tools/meta-tags",
          icon: CodeIcon,
          category: "Setup & Identity",
          description:
            "Generate SEO, Open Graph, Twitter, and AI-friendly meta tags",
          keywords: [
            "meta",
            "tags",
            "seo",
            "open graph",
            "og",
            "twitter card",
            "social",
            "head",
            "html",
            "title",
            "description",
            "search engine",
            "ai",
            "metadata",
          ],
          mostUsed: true,
        },
        {
          title: "Favicon",
          href: "/tools/favicon",
          icon: ImageIcon,
          category: "Setup & Identity",
          description:
            "Create browser favicon, Apple touch, Android, and Windows icons",
          keywords: [
            "favicon",
            "icon",
            "ico",
            "browser icon",
            "tab icon",
            "apple touch",
            "android icon",
            "app icon",
            "shortcut icon",
            "bookmark",
            "image",
            "png",
          ],
          locked: true,
          badge: "soon",
        },
        {
          title: "HTML Head",
          href: "/tools/html-head",
          icon: FileTextIcon,
          category: "Setup & Identity",
          description:
            "Merge meta, favicon, PWA outputs into a single <head> block",
          keywords: [
            "html",
            "head",
            "snippet",
            "export",
            "combine",
            "merge",
            "production",
            "code",
            "output",
            "complete",
          ],
          locked: true,
          badge: "soon",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // SEO & DISCOVERABILITY
    // ═══════════════════════════════════════════════════════════════════
    {
      title: "SEO & Discoverability",
      icon: TrendingUpIcon,
      items: [
        {
          title: "robots.txt",
          href: "/tools/robots",
          icon: BotIcon,
          category: "SEO & Discoverability",
          description: "Generate crawler rules for search engines and AI bots",
          keywords: [
            "robots",
            "robots.txt",
            "crawler",
            "bot",
            "spider",
            "google",
            "bing",
            "search engine",
            "crawl",
            "index",
            "disallow",
            "allow",
            "sitemap",
            "user agent",
          ],
          locked: true,
          badge: "soon",
        },
        {
          title: "Sitemap",
          href: "/tools/sitemap",
          icon: MapIcon,
          category: "SEO & Discoverability",
          description: "Create XML sitemaps with priority and change frequency",
          keywords: [
            "sitemap",
            "xml",
            "sitemap.xml",
            "urls",
            "pages",
            "index",
            "search engine",
            "seo",
            "priority",
            "frequency",
            "lastmod",
            "crawl",
          ],
          locked: true,
          badge: "soon",
        },
        {
          title: "Canonical URL",
          href: "/tools/canonical-url",
          icon: LinkIcon,
          category: "SEO & Discoverability",
          description:
            "Generate canonical tags to prevent duplicate content issues",
          keywords: [
            "canonical",
            "url",
            "duplicate",
            "content",
            "seo",
            "link",
            "rel",
            "domain",
            "multi-domain",
          ],
          locked: true,
          badge: "soon",
        },
        {
          title: "JSON-LD Schema",
          href: "/tools/json-ld",
          icon: ScrollTextIcon,
          category: "SEO & Discoverability",
          description:
            "Create structured data for Organization, Website, Article, FAQ",
          keywords: [
            "json-ld",
            "schema",
            "structured data",
            "organization",
            "website",
            "article",
            "blog",
            "faq",
            "rich snippets",
            "google",
            "seo",
          ],
          locked: true,
          badge: "soon",
        },
        {
          title: "SEO Checklist",
          href: "/tools/seo-checklist",
          icon: CheckSquareIcon,
          category: "SEO & Discoverability",
          description:
            "Audit meta completeness, crawlability, and AI visibility",
          keywords: [
            "seo",
            "checklist",
            "audit",
            "check",
            "verify",
            "validate",
            "ai",
            "search",
            "optimization",
            "best practices",
            "recommendations",
            "score",
          ],
          locked: true,
          badge: "soon",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // SOCIAL & BRANDING
    // ═══════════════════════════════════════════════════════════════════
    {
      title: "Social & Branding",
      icon: HeartIcon,
      items: [
        {
          title: "Social Preview",
          href: "/tools/social-preview",
          icon: ShareIcon,
          category: "Social & Branding",
          description:
            "Generate Open Graph and Twitter preview images with brand colors",
          keywords: [
            "social",
            "preview",
            "og image",
            "open graph",
            "twitter",
            "facebook",
            "linkedin",
            "share",
            "card",
            "image",
            "thumbnail",
            "1200x630",
          ],
          locked: true,
          badge: "soon",
        },
        {
          title: "Logo Export",
          href: "/tools/logo-export",
          icon: SparklesIcon,
          category: "Social & Branding",
          description: "Create light/dark logo variants with SVG/PNG exports",
          keywords: [
            "logo",
            "export",
            "light",
            "dark",
            "variant",
            "svg",
            "png",
            "format",
            "size",
            "background",
            "brand",
          ],
          locked: true,
          badge: "soon",
        },
        {
          title: "Brand Colors",
          href: "/tools/brand-colors",
          icon: PaletteIcon,
          category: "Social & Branding",
          description:
            "Generate accessible color palette from primary brand color",
          keywords: [
            "brand",
            "color",
            "palette",
            "contrast",
            "accessibility",
            "a11y",
            "wcag",
            "light",
            "dark",
            "css variables",
            "shades",
            "tints",
          ],
          locked: true,
          badge: "soon",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // PERFORMANCE & OPTIMIZATION
    // ═══════════════════════════════════════════════════════════════════
    {
      title: "Performance",
      icon: ZapIcon,
      items: [
        {
          title: "Preload Hints",
          href: "/tools/preload",
          icon: ZapIcon,
          category: "Performance",
          description:
            "Generate preload, preconnect, and prefetch resource hints",
          keywords: [
            "preload",
            "preconnect",
            "prefetch",
            "dns-prefetch",
            "font",
            "api",
            "cdn",
            "performance",
            "speed",
            "resource hint",
            "link",
          ],
          locked: true,
          badge: "soon",
        },
        {
          title: "Font Loading",
          href: "/tools/font-loading",
          icon: TypeIcon,
          category: "Performance",
          description: "Configure font-display strategies and preload patterns",
          keywords: [
            "font",
            "loading",
            "font-display",
            "swap",
            "fallback",
            "optional",
            "preload",
            "web font",
            "google fonts",
            "performance",
          ],
          locked: true,
          badge: "soon",
        },
        {
          title: "Image Guide",
          href: "/tools/image-guide",
          icon: ImageIcon,
          category: "Performance",
          description:
            "Best practices for WebP, AVIF, lazy loading, and sizing",
          keywords: [
            "image",
            "optimization",
            "webp",
            "avif",
            "lazy loading",
            "compression",
            "size",
            "format",
            "srcset",
            "responsive",
          ],
          locked: true,
          badge: "soon",
        },
        {
          title: "Minifier",
          href: "/tools/minifier",
          icon: GaugeIcon,
          category: "Performance",
          description: "Minify HTML, CSS, and JavaScript code snippets",
          keywords: [
            "minify",
            "minifier",
            "compress",
            "html",
            "css",
            "javascript",
            "js",
            "code",
            "size",
            "optimize",
            "uglify",
          ],
          locked: true,
          badge: "soon",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // SECURITY & COMPLIANCE
    // ═══════════════════════════════════════════════════════════════════
    {
      title: "Security",
      icon: ShieldIcon,
      items: [
        {
          title: "Security Headers",
          href: "/tools/security-headers",
          icon: ShieldIcon,
          category: "Security",
          description:
            "Generate HSTS, X-Frame-Options, Referrer-Policy headers",
          keywords: [
            "security",
            "headers",
            "http",
            "hsts",
            "x-frame-options",
            "x-content-type",
            "referrer policy",
            "safe",
            "protection",
          ],
          locked: true,
          badge: "soon",
        },
        {
          title: "CSP Generator",
          href: "/tools/csp",
          icon: ShieldCheckIcon,
          category: "Security",
          description: "Build Content Security Policy with safe defaults",
          keywords: [
            "csp",
            "content security policy",
            "security",
            "header",
            "inline",
            "script",
            "style",
            "directive",
            "nonce",
            "hash",
          ],
          locked: true,
          badge: "soon",
        },
        {
          title: "Permissions",
          href: "/tools/permissions",
          icon: KeyIcon,
          category: "Security",
          description: "Control camera, mic, location, and browser features",
          keywords: [
            "permissions",
            "policy",
            "camera",
            "microphone",
            "location",
            "geolocation",
            "feature",
            "browser",
            "restrict",
          ],
          locked: true,
          badge: "soon",
        },
        {
          title: "Privacy Policy",
          href: "/tools/privacy-policy",
          icon: ScrollTextIcon,
          category: "Security",
          description: "Generate basic GDPR/CCPA-ready privacy policy",
          keywords: [
            "privacy",
            "policy",
            "gdpr",
            "ccpa",
            "legal",
            "compliance",
            "data",
            "document",
            "template",
          ],
          locked: true,
          badge: "soon",
        },
        {
          title: "Cookie Consent",
          href: "/tools/cookie-consent",
          icon: CookieIcon,
          category: "Security",
          description: "Create lightweight GDPR-friendly cookie consent banner",
          keywords: [
            "cookie",
            "consent",
            "banner",
            "gdpr",
            "popup",
            "notice",
            "script",
            "compliance",
          ],
          locked: true,
          badge: "soon",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // UI & DEV UTILITIES
    // ═══════════════════════════════════════════════════════════════════
    {
      title: "Utilities",
      icon: HammerIcon,
      items: [
        {
          title: "QR Code",
          href: "/tools/qr-code",
          icon: QrCodeIcon,
          category: "Utilities",
          description:
            "Generate QR codes for URLs and text with SVG/PNG export",
          keywords: [
            "qr",
            "code",
            "qr code",
            "url",
            "text",
            "scan",
            "mobile",
            "svg",
            "png",
            "download",
          ],
          locked: false,
          mostUsed: true,
        },
        {
          title: "Placeholder",
          href: "/tools/placeholder",
          icon: SquareIcon,
          category: "Utilities",
          description:
            "Generate placeholder images with custom dimensions and colors",
          keywords: [
            "placeholder",
            "image",
            "dummy",
            "mock",
            "size",
            "dimension",
            "color",
            "svg",
            "png",
            "url",
          ],
          locked: true,
          badge: "soon",
        },
        {
          title: "Gradient",
          href: "/tools/gradient",
          icon: PaletteIcon,
          category: "Utilities",
          description: "Create linear and radial CSS gradients with preview",
          keywords: [
            "gradient",
            "linear",
            "radial",
            "css",
            "background",
            "color",
            "preview",
            "generator",
          ],
          locked: true,
          badge: "soon",
        },
        {
          title: "SVG Shapes",
          href: "/tools/svg-shapes",
          icon: SparklesIcon,
          category: "Utilities",
          description: "Generate organic SVG blobs and shapes",
          keywords: [
            "svg",
            "shape",
            "blob",
            "organic",
            "wave",
            "background",
            "decoration",
            "vector",
          ],
          locked: true,
          badge: "soon",
        },
      ],
    },
  ],
};

// Flat list for search functionality (includes category info)
export const allNavItems: SidebarNavItem[] = [
  ...sidebarConfig.main,
  ...sidebarConfig.categories.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, category: cat.title }))
  ),
];
