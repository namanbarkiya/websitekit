import { TypeIcon } from "lucide-react";

import { registerTool } from "@/lib/utils/tool-registry";

import { FontLoadingComponent } from "./component";

registerTool({
  id: "font-loading",
  name: "Font Loading",
  description: "Need font loading tips? Generate font-display snippets",
  category: "Performance",
  keywords: [
    "font",
    "loading",
    "font-display",
    "swap",
    "fallback",
    "optional",
    "preload",
    "web font",
    "google fonts",
    "performance",
  ],
  acceptedContext: ["domain"],
  outputs: ["html", "files"],
  Component: FontLoadingComponent,
});
