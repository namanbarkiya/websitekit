/**
 * CSP Generator Tool Types
 *
 * Type definitions for the CSP Generator tool state and configuration.
 */

export type CSPDirective =
  | "default-src"
  | "script-src"
  | "style-src"
  | "img-src"
  | "font-src"
  | "connect-src"
  | "media-src"
  | "object-src"
  | "frame-src"
  | "base-uri"
  | "form-action"
  | "frame-ancestors"
  | "upgrade-insecure-requests"
  | "block-all-mixed-content";

export type CSPValue =
  | "'self'"
  | "'unsafe-inline'"
  | "'unsafe-eval'"
  | "'unsafe-hashes'"
  | "'strict-dynamic'"
  | "'none'"
  | "data:"
  | "blob:"
  | "https:"
  | "http:"
  | string; // Custom domain/URL

export interface CSPDirectiveConfig {
  directive: CSPDirective;
  values: CSPValue[];
  enabled: boolean;
}

export interface CSPState {
  directives: CSPDirectiveConfig[];
  reportUri?: string;
  reportOnly: boolean;
}

export const DEFAULT_DIRECTIVES: CSPDirectiveConfig[] = [
  {
    directive: "default-src",
    values: ["'self'"],
    enabled: true,
  },
  {
    directive: "script-src",
    values: ["'self'"],
    enabled: true,
  },
  {
    directive: "style-src",
    values: ["'self'", "'unsafe-inline'"],
    enabled: true,
  },
  {
    directive: "img-src",
    values: ["'self'", "data:", "https:"],
    enabled: true,
  },
  {
    directive: "font-src",
    values: ["'self'", "data:", "https:"],
    enabled: true,
  },
  {
    directive: "connect-src",
    values: ["'self'"],
    enabled: true,
  },
  {
    directive: "media-src",
    values: ["'self'"],
    enabled: false,
  },
  {
    directive: "object-src",
    values: ["'none'"],
    enabled: true,
  },
  {
    directive: "frame-src",
    values: ["'self'"],
    enabled: false,
  },
  {
    directive: "base-uri",
    values: ["'self'"],
    enabled: false,
  },
  {
    directive: "form-action",
    values: ["'self'"],
    enabled: false,
  },
  {
    directive: "frame-ancestors",
    values: ["'none'"],
    enabled: false,
  },
  {
    directive: "upgrade-insecure-requests",
    values: [],
    enabled: false,
  },
  {
    directive: "block-all-mixed-content",
    values: [],
    enabled: false,
  },
];

export const DEFAULT_STATE: CSPState = {
  directives: DEFAULT_DIRECTIVES,
  reportUri: "",
  reportOnly: false,
};
