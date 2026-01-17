/**
 * Privacy Policy Tool Types
 *
 * Type definitions for the Privacy Policy tool state and configuration.
 */

export interface PrivacyPolicyState {
  companyName: string;
  websiteUrl: string;
  contactEmail: string;
  effectiveDate: string;
  lastUpdated: string;
  dataCollected: string[];
  dataUsage: string[];
  dataSharing: boolean;
  dataSharingDetails: string;
  cookiesUsed: boolean;
  cookiesDetails: string;
  userRights: string[];
  gdprCompliant: boolean;
  ccpaCompliant: boolean;
  childrenProtection: boolean;
  dataRetention: string;
  securityMeasures: string;
  thirdPartyServices: string;
  changesPolicy: string;
}

export const DEFAULT_STATE: PrivacyPolicyState = {
  companyName: "",
  websiteUrl: "",
  contactEmail: "",
  effectiveDate: new Date().toISOString().split("T")[0],
  lastUpdated: new Date().toISOString().split("T")[0],
  dataCollected: ["Name", "Email address", "IP address"],
  dataUsage: [
    "To provide and maintain our service",
    "To notify you about changes to our service",
    "To provide customer support",
  ],
  dataSharing: false,
  dataSharingDetails: "",
  cookiesUsed: true,
  cookiesDetails: "We use cookies to enhance your experience and analyze site usage.",
  userRights: [
    "Right to access your personal data",
    "Right to rectification",
    "Right to erasure",
    "Right to restrict processing",
  ],
  gdprCompliant: true,
  ccpaCompliant: false,
  childrenProtection: true,
  dataRetention: "We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy.",
  securityMeasures: "We implement appropriate technical and organizational measures to protect your personal data.",
  thirdPartyServices: "We may use third-party services that collect, monitor, and analyze data.",
  changesPolicy: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.",
};
