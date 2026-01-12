import type { ToolContent } from "../content-types";

/**
 * SEO content for /tools/qr-code/info
 * Keep this content human-first, specific, and up to date.
 */
export const seoContent: ToolContent = {
  whatIs:
    "A free QR code generator lets you instantly convert URLs or text into scannable QR codes without signup or watermarks. This online QR code generator creates clean, high-quality QR codes you can download as SVG or PNG for web and print use. Unlike many QR code generator without signup sites that lock downloads or add branding, WebsiteKit generates fully usable codes instantly with no account required. This tool generates static QR codes—if you need editable destinations or scan analytics, use a redirect link you control.",
  features: [
    "Generate QR codes for any URL or text content",
    "Download as high-quality SVG for print materials",
    "Export as PNG for digital use and applications",
    "Customize QR code size for different use cases",
    "Preview QR code before downloading",
    "No watermarks or branding on generated codes",
    "Works fully in-browser (fast and private)",
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
    "Posters or flyers that link to landing pages",
    "Internal docs links for teams and workshops",
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
    {
      question: "Can I change the destination after printing the QR code?",
      answer:
        "Not with a standard QR code that directly encodes the final URL/text. If you need an editable destination, you can encode a short link you control (for example, a redirect URL you can update later).",
    },
    {
      question: "Do QR codes expire?",
      answer:
        "The QR code image itself does not expire. If it encodes a URL, it will keep working as long as that URL remains reachable.",
    },
  ],
};
