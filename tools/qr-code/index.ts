/**
 * QR Code Tool
 *
 * Generates QR codes for URLs and text with customizable size, colors, and export formats (SVG/PNG).
 */

import { registerTool } from "@/lib/utils/tool-registry";

import { QRCodeComponent } from "./component";

// Tool definition
registerTool({
  id: "qr-code",
  name: "QR Code",
  description: "Generate QR codes for URLs and text with SVG/PNG export",
  category: "Utilities",
  keywords: [
    "qr",
    "qr code",
    "qrcode",
    "barcode",
    "quick response code",
    "scan",
    "scanner",
    "mobile",
    "url",
    "text",
    "svg",
    "png",
    "image",
    "generator",
    "download",
  ],
  acceptedContext: ["domain"],
  outputs: ["files"],
  Component: QRCodeComponent,
});
