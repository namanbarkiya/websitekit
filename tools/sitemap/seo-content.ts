import type { ToolSeo } from "../content-types";

export const seo: ToolSeo = {
  meta: {
    title: "Create sitemap.xml files fast – Free Sitemap.xml Generator",
    description:
      "Need to create a sitemap.xml file? Generate valid XML with URLs, lastmod dates, and priorities ready to submit in seconds with this free tool.",
    infoTitle: "How to Create a Sitemap.xml – Sitemap Guide",
    infoDescription:
      "Learn what an XML sitemap is, why it matters for SEO, common mistakes, and how to submit it correctly.",
    keywords: [
      "sitemap",
      "sitemap.xml",
      "xml",
      "seo",
      "search engine",
      "crawl",
    ],
  },
  concept: "XML sitemap",
  definition:
    "An XML sitemap is a file that lists your site's important URLs and metadata so search engines can crawl them efficiently.",
  whatIs:
    "A sitemap.xml generator builds a clean XML sitemap from your URLs so search engines can discover and index your pages. It supports lastmod dates, priorities, and change frequencies—all in a valid XML format you can submit to Google Search Console or Bing Webmaster Tools. Instead of writing XML by hand, you paste your URLs and get a ready-to-deploy file.",
  features: [
    "Generate valid XML sitemap from a list of URLs",
    "Add lastmod, priority, and changefreq values",
    "Support for multiple URL entries",
    "Download ready-to-deploy sitemap.xml",
    "Validate XML structure before export",
  ],
  howItWorks: [
    "Paste or upload your page URLs",
    "Add optional lastmod, priority, and changefreq values",
    "Generate the XML sitemap",
    "Host it and submit to search consoles",
  ],
  useCases: [
    "Launching a new site and helping search engines discover pages",
    "Updating sitemap after adding new sections",
    "Migrating URLs and ensuring new paths are indexed",
    "Improving crawl efficiency for large sites",
  ],
  whenToUse: [
    "You want search engines to find new or updated pages faster",
    "Your site has many pages or complex navigation",
    "You are launching a new site or migrating URLs",
  ],
  commonMistakes: [
    "Including non-canonical or blocked URLs",
    "Forgetting to update lastmod values",
    "Submitting sitemaps with invalid XML or 404 URLs",
  ],
  faq: [
    {
      question: "Do I need a sitemap for a small site?",
      answer:
        "It's not required, but it helps search engines discover pages faster. Even small sites benefit from clear sitemap submissions.",
    },
    {
      question: "How often should I update my sitemap?",
      answer:
        "Update it when you add, remove, or significantly change pages. Automated sitemaps (via frameworks or CMS) often update on each build.",
    },
    {
      question: "What URLs should I include?",
      answer:
        "Include canonical, indexable pages. Exclude pages with noindex, blocked by robots.txt, or non-canonical variants.",
    },
    {
      question: "Does priority actually affect ranking?",
      answer:
        "Google largely ignores priority values. It's more useful for internal reference. Focus on correct URLs and lastmod instead.",
    },
  ],
  summary: {
    whatThisToolDoes:
      "This tool builds a clean XML sitemap from your URLs. It helps search engines discover and prioritize your important pages.",
    whenToUse:
      "Use it when you launch a site, add new sections, or need a fast way to update sitemap entries.",
    howToUse: [
      "Paste or upload your page URLs",
      "Add optional lastmod, priority, and changefreq values",
      "Generate the XML sitemap",
      "Host it and submit it to search consoles",
    ],
    mistakesPrevented:
      "It avoids invalid XML, missing URLs, and accidental inclusion of blocked pages.",
  },
  relatedTools: ["robots", "meta-tags", "canonical-url"],
};
