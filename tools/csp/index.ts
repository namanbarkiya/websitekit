import { ShieldCheckIcon } from "lucide-react";

import { registerTool } from "@/lib/utils/tool-registry";

import { CSPComponent } from "./component";

registerTool({
  id: "csp",
  name: "CSP Generator",
  description: "Need a CSP header? Build Content Security Policy rules",
  category: "Security",
  keywords: [
    "csp",
    "content security policy",
    "security",
    "header",
    "inline",
    "script",
    "style",
    "directive",
    "nonce",
    "hash",
  ],
  acceptedContext: ["domain"],
  outputs: ["text", "files"],
  Component: CSPComponent,
});
