/**
 * Cookie Consent Tool Types
 *
 * Type definitions for the Cookie Consent tool state and configuration.
 */

export type ConsentStyle = "banner" | "modal" | "inline";

export type Position = "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean; // Can't be disabled
  enabledByDefault: boolean;
  scriptExamples: string; // Example scripts to load when accepted
}

export interface CookieConsentState {
  style: ConsentStyle;
  position: Position;
  companyName: string;
  message: string;
  acceptButtonText: string;
  declineButtonText: string;
  settingsButtonText: string;
  showDeclineButton: boolean;
  showSettingsButton: boolean;
  cookieCategories: CookieCategory[];
  privacyPolicyUrl: string;
  cookiePolicyUrl: string;
  theme: "light" | "dark" | "auto";
  gdprCompliant: boolean;
  requireExplicitConsent: boolean;
  analyticsProvider?: "google-analytics" | "plausible" | "custom" | "none";
  analyticsId?: string;
}

export const DEFAULT_CATEGORIES: CookieCategory[] = [
  {
    id: "necessary",
    name: "Necessary",
    description: "Essential cookies required for the website to function properly. These cannot be disabled.",
    required: true,
    enabledByDefault: true,
    scriptExamples: "// These cookies are always enabled",
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Help us understand how visitors interact with our website by collecting anonymous information.",
    required: false,
    enabledByDefault: false,
    scriptExamples: `// Google Analytics example:
// gtag('config', 'GA_MEASUREMENT_ID');`,
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Used to track visitors across websites for marketing and advertising purposes.",
    required: false,
    enabledByDefault: false,
    scriptExamples: `// Marketing pixel example:
// fbq('init', 'PIXEL_ID');`,
  },
];

export const DEFAULT_STATE: CookieConsentState = {
  style: "banner",
  position: "bottom",
  companyName: "",
  message: "We use cookies to enhance your browsing experience and analyze site traffic.",
  acceptButtonText: "Accept All",
  declineButtonText: "Decline",
  settingsButtonText: "Settings",
  showDeclineButton: true,
  showSettingsButton: true,
  cookieCategories: DEFAULT_CATEGORIES,
  privacyPolicyUrl: "",
  cookiePolicyUrl: "",
  theme: "auto",
  gdprCompliant: true,
  requireExplicitConsent: true,
  analyticsProvider: "none",
  analyticsId: "",
};
