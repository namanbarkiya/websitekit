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
            "Need SEO meta tags? Generate title, Open Graph, and Twitter cards",
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
            "Need a favicon? Generate favicon.ico, Apple, and Android icons",
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
          locked: false,
          mostUsed: true,
        },
        {
          title: "HTML Head",
          href: "/tools/html-head",
          icon: FileTextIcon,
          category: "Setup & Identity",
          description:
            "Need a full <head> snippet? Combine meta tags, icons, and PWA tags",
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
          description: "Need robots.txt? Generate Allow/Disallow rules fast",
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
          locked: false,
        },
        {
          title: "Sitemap",
          href: "/tools/sitemap",
          icon: MapIcon,
          category: "SEO & Discoverability",
          description: "Need sitemap.xml? Generate a clean sitemap from URLs",
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
          locked: false,
        },
        {
          title: "Canonical URL",
          href: "/tools/canonical-url",
          icon: LinkIcon,
          category: "SEO & Discoverability",
          description: 'Need a canonical tag? Generate <link rel="canonical">',
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
          locked: false,
        },
        {
          title: "JSON-LD Schema",
          href: "/tools/json-ld",
          icon: ScrollTextIcon,
          category: "SEO & Discoverability",
          description: "Need JSON-LD schema? Generate structured data for SEO",
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
          locked: false,
        },
        {
          title: "SEO Checklist",
          href: "/tools/seo-checklist",
          icon: CheckSquareIcon,
          category: "SEO & Discoverability",
          description:
            "Need an SEO checklist? Audit titles, indexing, and crawlability",
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
            "Need social images? Generate Open Graph and Twitter previews",
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
          description: "Need logo exports? Generate light/dark SVG and PNG",
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
          description: "Need a brand palette? Generate accessible color scales",
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
            "Need preload/preconnect tags? Generate resource hints fast",
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
          description: "Need font loading tips? Generate font-display snippets",
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
            "Need image optimization? Get WebP/AVIF and lazy-load guidance",
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
          description: "Need to minify code? Compress HTML, CSS, or JS",
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
            "Need security headers? Generate HSTS and X-Frame-Options",
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
          locked: false,
        },
        {
          title: "CSP Generator",
          href: "/tools/csp",
          icon: ShieldCheckIcon,
          category: "Security",
          description: "Need a CSP header? Build Content Security Policy rules",
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
          description: "Need a Permissions-Policy? Control browser features",
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
          description: "Need a privacy policy? Generate a GDPR/CCPA draft",
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
          description: "Need a cookie banner? Generate a consent snippet",
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
          description: "Need a QR code? Generate SVG/PNG for URLs or text",
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
            "Need placeholder images? Generate custom sizes and colors",
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
          description: "Need a CSS gradient? Create linear or radial gradients",
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
          locked: false,
          mostUsed: true,
        },
        {
          title: "SVG Shapes",
          href: "/tools/svg-shapes",
          icon: SparklesIcon,
          category: "Utilities",
          description: "Need SVG blobs? Generate organic shapes and dividers",
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
