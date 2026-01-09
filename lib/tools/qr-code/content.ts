import type { ToolContent } from "../content-types";

export const content: ToolContent = {
  whatIs:
    "A QR code generator is a tool that converts URLs, text, or other data into a scannable two-dimensional barcode. You enter the content you want to encode, and the tool creates a QR code image that can be scanned with any smartphone camera to instantly access that content.",
  features: [
    "Generate QR codes for any URL or text content",
    "Download as high-quality SVG for print materials",
    "Export as PNG for digital use and applications",
    "Customize QR code size for different use cases",
    "Preview QR code before downloading",
    "No watermarks or branding on generated codes",
  ],
  howItWorks: [
    "Enter the URL or text you want to encode",
    "Adjust the size if needed (default works for most cases)",
    "Click Generate to create your QR code",
    "Preview the result and test with your phone camera",
    "Download as SVG for print or PNG for digital use",
  ],
  useCases: [
    "Business cards and marketing materials",
    "Restaurant menus and product packaging",
    "Event tickets and conference badges",
    "App download links and contact sharing",
  ],
  faq: [
    {
      question: "What format should I download: SVG or PNG?",
      answer:
        "Use SVG for crisp scaling in print and web. Use PNG when you need a fixed-size raster image for apps or platforms that don't accept SVG.",
    },
    {
      question: "What makes a QR code scan reliably?",
      answer:
        "High contrast, sufficient size, quiet zone padding, and avoiding overly dense content. Always test with multiple camera apps.",
    },
    {
      question: "What is the minimum size for a printed QR code?",
      answer:
        "For reliable scanning, print QR codes at minimum 2x2 cm (0.8x0.8 inches). Larger sizes are recommended for scanning from a distance.",
    },
  ],
};
