export type SitemapChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export type SitemapLastmodMode = "none" | "today";

export interface SitemapState {
  /** Base site origin, e.g. https://example.com */
  baseUrl: string;
  /** One URL or path per line */
  urls: string;

  /** Normalize output */
  sortAndDedupe: boolean;
  stripQueryAndHash: boolean;
  includeTrailingSlash: boolean;

  /** Optional fields */
  includeLastmod: boolean;
  lastmodMode: SitemapLastmodMode;
  includeChangefreq: boolean;
  changefreq: SitemapChangeFreq;
  includePriority: boolean;
  priority: number; // 0.0 to 1.0

  /** Optional extra output */
  includeHtmlSitemap: boolean;
}

export const DEFAULT_STATE: SitemapState = {
  baseUrl: "",
  urls: "",

  sortAndDedupe: true,
  stripQueryAndHash: true,
  includeTrailingSlash: false,

  includeLastmod: false,
  lastmodMode: "none",
  includeChangefreq: false,
  changefreq: "weekly",
  includePriority: false,
  priority: 0.7,

  includeHtmlSitemap: false,
};
