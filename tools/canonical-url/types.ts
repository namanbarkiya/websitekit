export type ProtocolPreference = "https" | "http" | "keep";
export type WwwPreference = "www" | "no-www" | "keep";
export type TrailingSlashPreference = "add" | "remove" | "keep";

export interface CanonicalUrlState {
  /** The page URL to canonicalize */
  pageUrl: string;
  /** Protocol preference */
  protocol: ProtocolPreference;
  /** WWW prefix preference */
  www: WwwPreference;
  /** Trailing slash preference */
  trailingSlash: TrailingSlashPreference;
  /** Strip query parameters */
  stripParams: boolean;
  /** Specific params to keep (comma-separated) if stripParams is true */
  keepParams: string;
}

export const DEFAULT_STATE: CanonicalUrlState = {
  pageUrl: "",
  protocol: "https",
  www: "keep",
  trailingSlash: "keep",
  stripParams: true,
  keepParams: "",
};
