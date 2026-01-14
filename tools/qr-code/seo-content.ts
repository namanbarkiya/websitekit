import type { ToolSeo } from "../content-types";

export const seo: ToolSeo = {
  meta: {
    title: "Create QR codes for links fast – Free QR Code Generator",
    description:
      "Need to create a QR code for a short link? Generate SVG or PNG files you can print or share for quick scanning in seconds with this free tool.",
    infoTitle: "How to Create a QR Code – QR Code Guide",
    infoDescription:
      "Learn how QR codes work, how to size them correctly, and common scanning mistakes to avoid.",
    keywords: ["qr code", "qr", "barcode", "scan", "svg", "png"],
  },
  concept: "QR code",
  definition:
    "A QR code is a scannable square barcode that encodes a URL or text for quick access on mobile devices.",
  whatIs:
    "A QR code generator creates scannable barcodes that encode URLs, text, or other data. When someone scans the code with their phone camera, it opens the encoded link or displays the text. This tool generates high-quality QR codes in SVG (for crisp scaling) or PNG (for compatibility) that you can use in print, web, or marketing materials.",
  features: [
    "Generate QR codes for URLs or plain text",
    "Export as SVG for crisp scaling at any size",
    "Export as PNG for broad compatibility",
    "Customize size and error correction level",
    "Preview before downloading",
  ],
  howItWorks: [
    "Enter the URL or text you want to encode",
    "Choose size and output format",
    "Generate the QR code",
    "Download and test with a phone camera",
  ],
  useCases: [
    "Linking to a website from print materials",
    "Sharing contact info or Wi-Fi credentials",
    "Adding QR codes to packaging or signage",
    "Creating event check-in or ticket links",
  ],
  whenToUse: [
    "You need quick access to a URL from print material",
    "You want to share contact or download links in person",
    "You are adding QR codes to packaging or signage",
  ],
  commonMistakes: [
    "Using low contrast or busy backgrounds",
    "Sizing QR codes too small for the scan distance",
    "Encoding URLs that redirect through broken links",
  ],
  faq: [
    {
      question: "What size should my QR code be?",
      answer:
        "For print, aim for at least 2cm x 2cm for close scanning. For signage viewed from distance, scale up proportionally. Test at the expected viewing distance.",
    },
    {
      question: "SVG or PNG—which should I use?",
      answer:
        "Use SVG for web and scalable print. Use PNG when a platform doesn't support SVG or when you need a fixed-resolution image.",
    },
    {
      question: "Can QR codes store a lot of data?",
      answer:
        "QR codes can store a few thousand characters, but longer content makes the code denser and harder to scan. Keep URLs short when possible.",
    },
    {
      question: "Do QR codes expire?",
      answer:
        "The code itself doesn't expire, but the URL it points to can. Use stable, long-lived URLs to avoid broken scans.",
    },
  ],
  summary: {
    whatThisToolDoes:
      "This tool generates QR codes for URLs or text. It provides SVG and PNG downloads for print or web use.",
    whenToUse:
      "Use it when you need scannable codes for marketing, events, or physical media.",
    howToUse: [
      "Enter the URL or text you want to encode",
      "Choose size and output format",
      "Generate the QR code",
      "Download and test with a phone camera",
    ],
    mistakesPrevented:
      "It helps avoid blurry codes, poor contrast, and unreadable sizes.",
  },
  relatedTools: ["meta-tags", "social-preview"],
};
