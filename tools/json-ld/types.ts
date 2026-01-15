export type SchemaType =
  | "Organization"
  | "WebSite"
  | "Article"
  | "FAQPage"
  | "BreadcrumbList";

export interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string; // Newline-separated social URLs
}

export interface WebSiteData {
  name: string;
  url: string;
  description: string;
  searchUrl: string; // Optional search action URL
}

export interface ArticleData {
  headline: string;
  description: string;
  url: string;
  imageUrl: string;
  authorName: string;
  authorUrl: string;
  publisherName: string;
  publisherLogo: string;
  datePublished: string;
  dateModified: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQData {
  items: FAQItem[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface BreadcrumbData {
  items: BreadcrumbItem[];
}

export interface JsonLdState {
  schemaType: SchemaType;
  organization: OrganizationData;
  website: WebSiteData;
  article: ArticleData;
  faq: FAQData;
  breadcrumb: BreadcrumbData;
}

export const DEFAULT_STATE: JsonLdState = {
  schemaType: "Organization",
  organization: {
    name: "",
    url: "",
    logo: "",
    description: "",
    sameAs: "",
  },
  website: {
    name: "",
    url: "",
    description: "",
    searchUrl: "",
  },
  article: {
    headline: "",
    description: "",
    url: "",
    imageUrl: "",
    authorName: "",
    authorUrl: "",
    publisherName: "",
    publisherLogo: "",
    datePublished: "",
    dateModified: "",
  },
  faq: {
    items: [{ question: "", answer: "" }],
  },
  breadcrumb: {
    items: [
      { name: "Home", url: "" },
      { name: "", url: "" },
    ],
  },
};
