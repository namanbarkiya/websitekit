/**
 * Favicon Tool
 *
 * Generates common favicon PNGs + favicon.ico + manifest.
 */

import { registerTool } from "@/lib/utils/tool-registry";

import { FaviconComponent } from "./component";

registerTool({
  id: "favicon",
  name: "Favicon Generator",
  description:
    "Create browser icons, Apple touch icons, Android icons, and HTML tags",
  category: "Setup & Identity",
  keywords: [
    "favicon",
    "icon",
    "ico",
    "browser icon",
    "tab icon",
    "apple touch",
    "android icon",
    "app icon",
    "shortcut icon",
    "bookmark",
    "image",
    "png",
  ],
  acceptedContext: ["logo", "primaryColor", "name"],
  outputs: ["files"],
  Component: FaviconComponent,
});
