export type RobotsPolicy = "allow-all" | "block-all" | "custom";

export type RobotsExperienceLevel = "beginner" | "advanced";

export interface RobotsState {
  /** Guided UI vs advanced rules */
  experienceLevel: RobotsExperienceLevel;
  /** High-level policy template */
  policy: RobotsPolicy;
  /** Multiline allow paths (one per line), used when policy === "custom" */
  allow: string;
  /** Multiline disallow paths (one per line), used when policy === "custom" */
  disallow: string;
  /** Include Sitemap directive */
  includeSitemap: boolean;
  /** Absolute URL to sitemap.xml */
  sitemapUrl: string;
}

export const DEFAULT_STATE: RobotsState = {
  experienceLevel: "beginner",
  policy: "allow-all",
  allow: "",
  disallow: "",
  includeSitemap: true,
  sitemapUrl: "",
};

