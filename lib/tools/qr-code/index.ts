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
    "qrcode",
    "qr code",
    "barcode",
    "quick response",
    "svg",
    "png",
    "image",
    "url",
    "text",
    "scan",
    "mobile",
  ],
  acceptedContext: ["domain"],
  outputs: ["files"],
  Component: QRCodeComponent,
});
