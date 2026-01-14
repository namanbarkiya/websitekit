/**
 * Gradient Tool
 *
 * Generates CSS gradients with live preview.
 */

import { registerTool } from "@/lib/utils/tool-registry";

import { GradientComponent } from "./component";

registerTool({
  id: "gradient",
  name: "Gradient",
  description: "Create linear and radial CSS gradients with preview",
  category: "Utilities",
  keywords: [
    "gradient",
    "linear",
    "radial",
    "css",
    "background",
    "color",
    "preview",
    "generator",
  ],
  acceptedContext: ["primaryColor"],
  outputs: ["files"],
  Component: GradientComponent,
});
