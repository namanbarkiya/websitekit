import type { ToolOutput } from "@/lib/utils/tool-registry";

import { DEFAULT_STATE, type PrivacyPolicyState } from "../types";

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function generatePrivacyPolicyOutput(
  state: Partial<PrivacyPolicyState>
): ToolOutput {
  const s: PrivacyPolicyState = { ...DEFAULT_STATE, ...state };

  if (!s.companyName || !s.websiteUrl || !s.contactEmail) {
    return {
      type: "html",
      content: "",
      preview: `
        <div style="padding:16px;text-align:center;color:rgba(120,120,120,1);">
          Fill in company name, website URL, and contact email to generate privacy policy
        </div>
      `.trim(),
    };
  }

  const sections: string[] = [];

  sections.push(`<h1>Privacy Policy</h1>`);
  sections.push(`<p><strong>Last updated:</strong> ${escapeHtml(s.lastUpdated)}</p>`);
  sections.push(`<p>This Privacy Policy describes how ${escapeHtml(s.companyName)} ("we", "our", or "us") collects, uses, and shares your personal information when you use our website ${escapeHtml(s.websiteUrl)} (the "Service").</p>`);

  sections.push(`<h2>1. Information We Collect</h2>`);
  sections.push(`<p>We collect the following types of information:</p>`);
  sections.push(`<ul>`);
  s.dataCollected.forEach((item) => {
    sections.push(`<li>${escapeHtml(item)}</li>`);
  });
  sections.push(`</ul>`);

  sections.push(`<h2>2. How We Use Your Information</h2>`);
  sections.push(`<p>We use the information we collect for the following purposes:</p>`);
  sections.push(`<ul>`);
  s.dataUsage.forEach((item) => {
    sections.push(`<li>${escapeHtml(item)}</li>`);
  });
  sections.push(`</ul>`);

  if (s.dataSharing) {
    sections.push(`<h2>3. Sharing Your Information</h2>`);
    sections.push(`<p>${escapeHtml(s.dataSharingDetails || "We may share your information with third parties as described in this policy.")}</p>`);
  } else {
    sections.push(`<h2>3. Sharing Your Information</h2>`);
    sections.push(`<p>We do not sell, trade, or rent your personal information to third parties.</p>`);
  }

  if (s.cookiesUsed) {
    sections.push(`<h2>4. Cookies</h2>`);
    sections.push(`<p>${escapeHtml(s.cookiesDetails)}</p>`);
  }

  sections.push(`<h2>${s.cookiesUsed ? "5" : "4"}. Your Rights</h2>`);
  sections.push(`<p>You have the following rights regarding your personal data:</p>`);
  sections.push(`<ul>`);
  s.userRights.forEach((right) => {
    sections.push(`<li>${escapeHtml(right)}</li>`);
  });
  sections.push(`</ul>`);

  if (s.gdprCompliant) {
    sections.push(`<h2>${s.cookiesUsed ? "6" : "5"}. GDPR Compliance</h2>`);
    sections.push(`<p>If you are located in the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR).</p>`);
  }

  if (s.ccpaCompliant) {
    sections.push(`<h2>${s.cookiesUsed && s.gdprCompliant ? "7" : s.cookiesUsed || s.gdprCompliant ? "6" : "5"}. CCPA Compliance</h2>`);
    sections.push(`<p>If you are a California resident, you have certain rights under the California Consumer Privacy Act (CCPA).</p>`);
  }

  if (s.childrenProtection) {
    const sectionNum = [s.cookiesUsed, s.gdprCompliant, s.ccpaCompliant].filter(Boolean).length + (s.cookiesUsed ? 5 : 4);
    sections.push(`<h2>${sectionNum}. Children's Privacy</h2>`);
    sections.push(`<p>Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.</p>`);
  }

  const dataRetentionNum = [s.cookiesUsed, s.gdprCompliant, s.ccpaCompliant, s.childrenProtection].filter(Boolean).length + (s.cookiesUsed ? 5 : 4);
  sections.push(`<h2>${dataRetentionNum}. Data Retention</h2>`);
  sections.push(`<p>${escapeHtml(s.dataRetention)}</p>`);

  sections.push(`<h2>${dataRetentionNum + 1}. Security</h2>`);
  sections.push(`<p>${escapeHtml(s.securityMeasures)}</p>`);

  if (s.thirdPartyServices) {
    sections.push(`<h2>${dataRetentionNum + 2}. Third-Party Services</h2>`);
    sections.push(`<p>${escapeHtml(s.thirdPartyServices)}</p>`);
  }

  sections.push(`<h2>${dataRetentionNum + (s.thirdPartyServices ? 3 : 2)}. Changes to This Privacy Policy</h2>`);
  sections.push(`<p>${escapeHtml(s.changesPolicy)}</p>`);

  sections.push(`<h2>${dataRetentionNum + (s.thirdPartyServices ? 4 : 3)}. Contact Us</h2>`);
  sections.push(`<p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:${escapeHtml(s.contactEmail)}">${escapeHtml(s.contactEmail)}</a>.</p>`);

  const html = sections.join("\n\n");
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - ${escapeHtml(s.companyName)}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
    h1 { border-bottom: 2px solid #333; padding-bottom: 0.5rem; }
    h2 { margin-top: 2rem; color: #333; }
    ul { margin: 1rem 0; }
    li { margin: 0.5rem 0; }
  </style>
</head>
<body>
${html}
</body>
</html>`;

  const previewHtml = `
    <div>
      <div style="font-size:12px;color:rgba(120,120,120,1);margin-bottom:8px;">
        Privacy Policy Preview
      </div>
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:100%;padding:12px;background:rgba(0,0,0,0.03);border-radius:6px;max-height:400px;overflow:auto;">
        ${html.replace(/<h1>/g, '<h1 style="font-size:1.5rem;margin:0 0 1rem 0;">').replace(/<h2>/g, '<h2 style="font-size:1.2rem;margin:1rem 0 0.5rem 0;">')}
      </div>
    </div>
  `.trim();

  return {
    type: "files",
    content: fullHtml,
    files: [
      {
        filename: "privacy-policy.html",
        content: fullHtml,
        mimeType: "text/html",
      },
      {
        filename: "privacy-policy.md",
        content: html.replace(/<[^>]*>/g, "").replace(/\n\n+/g, "\n\n"),
        mimeType: "text/markdown",
      },
    ],
    preview: previewHtml,
  };
}
