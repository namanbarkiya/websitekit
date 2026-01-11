/**
 * Meta Tags Tool Types
 *
 * Type definitions for the Meta Tags tool state and configuration.
 */

export interface MetaTagsState {
  // Basic SEO
  title: string;
  description: string;
  keywords: string;
  author: string;
  canonicalUrl: string;
  robots: string;

  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogUrl: string;
  ogSiteName: string;

  // Twitter Card
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  twitterCreator: string;
}

export const DEFAULT_STATE: MetaTagsState = {
  title: "",
  description: "",
  keywords: "",
  author: "",
  canonicalUrl: "",
  robots: "index, follow",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  ogType: "website",
  ogUrl: "",
  ogSiteName: "",
  twitterCard: "summary_large_image",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  twitterSite: "",
  twitterCreator: "",
};
