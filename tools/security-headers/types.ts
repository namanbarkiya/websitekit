export type FrameOptions = "deny" | "sameorigin";

export type ReferrerPolicy =
  | "no-referrer"
  | "no-referrer-when-downgrade"
  | "origin"
  | "origin-when-cross-origin"
  | "same-origin"
  | "strict-origin"
  | "strict-origin-when-cross-origin"
  | "unsafe-url";

export type CrossOriginOpenerPolicy =
  | "unsafe-none"
  | "same-origin"
  | "same-origin-allow-popups";

export type CrossOriginResourcePolicy =
  | "same-site"
  | "same-origin"
  | "cross-origin";

export interface SecurityHeadersState {
  /** Strict-Transport-Security */
  enableHsts: boolean;
  hstsMaxAgeSeconds: number;
  hstsIncludeSubdomains: boolean;
  hstsPreload: boolean;

  /** X-Content-Type-Options */
  enableNosniff: boolean;

  /** X-Frame-Options */
  enableFrameOptions: boolean;
  frameOptions: FrameOptions;

  /** Referrer-Policy */
  enableReferrerPolicy: boolean;
  referrerPolicy: ReferrerPolicy;

  /** Cross-origin headers (optional but useful) */
  enableCoop: boolean;
  coop: CrossOriginOpenerPolicy;
  enableCorp: boolean;
  corp: CrossOriginResourcePolicy;
}

export const DEFAULT_STATE: SecurityHeadersState = {
  // Safe defaults for most production sites:
  enableHsts: true,
  hstsMaxAgeSeconds: 15552000, // 180 days
  hstsIncludeSubdomains: false, // enable only if you're sure all subdomains are HTTPS
  hstsPreload: false, // enable only if you plan to submit to HSTS preload list

  enableNosniff: true,

  enableFrameOptions: true,
  frameOptions: "sameorigin",

  enableReferrerPolicy: true,
  referrerPolicy: "strict-origin-when-cross-origin",

  // COOP/CORP are powerful but can break embeds/resources. Keep off by default.
  enableCoop: false,
  coop: "same-origin",
  enableCorp: false,
  corp: "same-site",
};
