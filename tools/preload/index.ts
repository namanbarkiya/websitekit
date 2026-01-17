import { ZapIcon } from "lucide-react";

import { registerTool } from "@/lib/utils/tool-registry";

import { PreloadComponent } from "./component";

registerTool({
  id: "preload",
  name: "Preload Hints",
  description:
    "Need preload/preconnect tags? Generate resource hints fast",
  category: "Performance",
  keywords: [
    "preload",
    "preconnect",
    "prefetch",
    "dns-prefetch",
    "font",
    "api",
    "cdn",
    "performance",
    "speed",
    "resource hint",
    "link",
  ],
  acceptedContext: ["domain"],
  outputs: ["html", "files"],
  Component: PreloadComponent,
});
