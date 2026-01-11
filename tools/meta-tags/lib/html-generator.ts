import type { MetaTagsState } from "../types";

export function generateMetaTagsHTML(state: MetaTagsState): string {
  const tags: string[] = [];

  // Primary Meta Tags
  tags.push("<!-- Primary Meta Tags -->");
  if (state.title) {
    tags.push(`<title>${escapeHtml(state.title)}</title>`);
    tags.push(`<meta name="title" content="${escapeHtml(state.title)}" />`);
  }

  if (state.description) {
    tags.push(
      `<meta name="description" content="${escapeHtml(state.description)}" />`
    );
  }

  if (state.keywords) {
    tags.push(
      `<meta name="keywords" content="${escapeHtml(state.keywords)}" />`
    );
  }

  if (state.author) {
    tags.push(`<meta name="author" content="${escapeHtml(state.author)}" />`);
  }

  if (state.robots) {
    tags.push(`<meta name="robots" content="${escapeHtml(state.robots)}" />`);
  }

  if (state.canonicalUrl) {
    tags.push(
      `<link rel="canonical" href="${escapeHtml(state.canonicalUrl)}" />`
    );
  }

  // Open Graph / Facebook
  tags.push("\n<!-- Open Graph / Facebook -->");
  if (state.ogType) {
    tags.push(
      `<meta property="og:type" content="${escapeHtml(state.ogType)}" />`
    );
  }

  if (state.ogUrl) {
    tags.push(
      `<meta property="og:url" content="${escapeHtml(state.ogUrl)}" />`
    );
  }

  if (state.ogTitle) {
    tags.push(
      `<meta property="og:title" content="${escapeHtml(state.ogTitle)}" />`
    );
  }

  if (state.ogDescription) {
    tags.push(
      `<meta property="og:description" content="${escapeHtml(state.ogDescription)}" />`
    );
  }

  if (state.ogImage) {
    tags.push(
      `<meta property="og:image" content="${escapeHtml(state.ogImage)}" />`
    );
  }

  if (state.ogSiteName) {
    tags.push(
      `<meta property="og:site_name" content="${escapeHtml(state.ogSiteName)}" />`
    );
  }

  // X (Twitter)
  tags.push("\n<!-- X (Twitter) -->");
  if (state.twitterCard) {
    tags.push(
      `<meta name="twitter:card" content="${escapeHtml(state.twitterCard)}" />`
    );
  }

  if (state.twitterSite) {
    tags.push(
      `<meta name="twitter:site" content="${escapeHtml(state.twitterSite)}" />`
    );
  }

  if (state.twitterCreator) {
    tags.push(
      `<meta name="twitter:creator" content="${escapeHtml(state.twitterCreator)}" />`
    );
  }

  if (state.twitterTitle) {
    tags.push(
      `<meta name="twitter:title" content="${escapeHtml(state.twitterTitle)}" />`
    );
  }

  if (state.twitterDescription) {
    tags.push(
      `<meta name="twitter:description" content="${escapeHtml(state.twitterDescription)}" />`
    );
  }

  if (state.twitterImage) {
    tags.push(
      `<meta name="twitter:image" content="${escapeHtml(state.twitterImage)}" />`
    );
  }

  return tags.join("\n");
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
