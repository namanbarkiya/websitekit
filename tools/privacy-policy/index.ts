import { ScrollTextIcon } from "lucide-react";

import { registerTool } from "@/lib/utils/tool-registry";

import { PrivacyPolicyComponent } from "./component";

registerTool({
  id: "privacy-policy",
  name: "Privacy Policy",
  description: "Need a privacy policy? Generate a GDPR/CCPA draft",
  category: "Security",
  keywords: [
    "privacy",
    "policy",
    "gdpr",
    "ccpa",
    "legal",
    "compliance",
    "data",
    "document",
    "template",
  ],
  acceptedContext: ["name", "domain"],
  outputs: ["html", "files"],
  Component: PrivacyPolicyComponent,
});
