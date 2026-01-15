import { FileTextIcon } from "lucide-react";

import { registerTool } from "@/lib/utils/tool-registry";

import { HtmlHeadComponent } from "./component";
import type { HtmlHeadState } from "./types";

registerTool({
  id: "html-head",
  name: "HTML Head",
  description: "Need a full <head> snippet? Combine meta tags, icons, and PWA tags",
  category: "Setup & Identity",
  keywords: [
    "html",
    "head",
    "snippet",
    "export",
    "combine",
    "merge",
    "production",
    "code",
    "output",
    "complete",
  ],
  acceptedContext: ["name", "domain", "description", "logo"],
  outputs: ["html", "files"],
  Component: HtmlHeadComponent,
});
