import { CookieIcon } from "lucide-react";

import { registerTool } from "@/lib/utils/tool-registry";

import { CookieConsentComponent } from "./component";

registerTool({
  id: "cookie-consent",
  name: "Cookie Consent",
  description: "Need a cookie banner? Generate a consent snippet",
  category: "Security",
  keywords: [
    "cookie",
    "consent",
    "banner",
    "gdpr",
    "popup",
    "notice",
    "script",
    "compliance",
  ],
  acceptedContext: ["name", "domain"],
  outputs: ["html", "files"],
  Component: CookieConsentComponent,
});
