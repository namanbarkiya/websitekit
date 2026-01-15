/**
 * HTML Head Tool Types
 *
 * Type definitions for the HTML Head tool state and configuration.
 */

export interface HtmlHeadState {
  // Basic HTML
  charset: string;
  viewport: string;

  // Meta Tags
  includeMetaTags: boolean;
  title: string;
  description: string;
  keywords: string;
  author: string;
  robots: string;

  // Open Graph
  includeOpenGraph: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogUrl: string;
  ogSiteName: string;

  // Twitter Card
  includeTwitterCard: boolean;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  twitterCreator: string;

  // Canonical URL
  includeCanonical: boolean;
  canonicalUrl: string;

  // Favicons
  includeFavicons: boolean;
  faviconIco: string;
  favicon16: string;
  favicon32: string;
  favicon96: string;
  appleTouchIcon: string;
  androidChrome192: string;
  androidChrome512: string;
  manifest: string;

  // JSON-LD Schema
  includeJsonLd: boolean;
  jsonLdSchema: string;

  // Security Headers (meta tags)
  includeSecurityMeta: boolean;
  contentSecurityPolicy: string;
  referrerPolicy: string;
  permissionsPolicy: string;

  // PWA
  includePWA: boolean;
  themeColor: string;
  appleMobileWebAppCapable: boolean;
  appleMobileWebAppStatusBarStyle: string;
  appleMobileWebAppTitle: string;

  // Other
  includeOther: boolean;
  otherTags: string;
}

export const DEFAULT_STATE: HtmlHeadState = {
  charset: "utf-8",
  viewport: "width=device-width, initial-scale=1",

  includeMetaTags: true,
  title: "",
  description: "",
  keywords: "",
  author: "",
  robots: "index, follow",

  includeOpenGraph: true,
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  ogType: "website",
  ogUrl: "",
  ogSiteName: "",

  includeTwitterCard: true,
  twitterCard: "summary_large_image",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  twitterSite: "",
  twitterCreator: "",

  includeCanonical: true,
  canonicalUrl: "",

  includeFavicons: true,
  faviconIco: "/favicon.ico",
  favicon16: "/favicon/favicon-16x16.png",
  favicon32: "/favicon/favicon-32x32.png",
  favicon96: "/favicon/favicon-96x96.png",
  appleTouchIcon: "/favicon/apple-touch-icon.png",
  androidChrome192: "/favicon/android-chrome-192x192.png",
  androidChrome512: "/favicon/android-chrome-512x512.png",
  manifest: "/favicon/site.webmanifest",

  includeJsonLd: false,
  jsonLdSchema: "",

  includeSecurityMeta: false,
  contentSecurityPolicy: "",
  referrerPolicy: "strict-origin-when-cross-origin",
  permissionsPolicy: "",

  includePWA: false,
  themeColor: "#000000",
  appleMobileWebAppCapable: false,
  appleMobileWebAppStatusBarStyle: "default",
  appleMobileWebAppTitle: "",

  includeOther: false,
  otherTags: "",
};
