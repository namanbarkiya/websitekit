import type { ToolOutput } from "@/lib/utils/tool-registry";

import {
  DEFAULT_STATE,
  DEFAULT_CATEGORIES,
  type CookieConsentState,
  type CookieCategory,
} from "../types";

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeJs(input: string): string {
  return input
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'")
    .replaceAll('"', '\\"')
    .replaceAll("\n", "\\n")
    .replaceAll("\r", "\\r")
    .replaceAll("</script>", "<\\/script>");
}

export function generateCookieConsentOutput(
  state: Partial<CookieConsentState>
): ToolOutput {
  const s: CookieConsentState = {
    ...DEFAULT_STATE,
    ...state,
    cookieCategories:
      (state as Partial<CookieConsentState>)?.cookieCategories?.length
        ? (state as Partial<CookieConsentState>).cookieCategories!
        : DEFAULT_STATE.cookieCategories,
  };

  if (!s.companyName) {
    return {
      type: "html",
      content: "",
      preview: `
        <div style="padding:16px;text-align:center;color:rgba(120,120,120,1);">
          Enter company name to generate cookie consent
        </div>
      `.trim(),
    };
  }

  const categoriesJson = JSON.stringify(
    s.cookieCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      required: cat.required,
    }))
  );

  const css = `
.cookie-consent {
  position: fixed;
  ${s.position.includes("top") ? "top: 0;" : "bottom: 0;"}
  ${s.position.includes("left") ? "left: 0;" : s.position.includes("right") ? "right: 0;" : "left: 0; right: 0;"}
  background: ${s.theme === "dark" ? "#1a1a1a" : s.theme === "light" ? "#ffffff" : "#ffffff"};
  color: ${s.theme === "dark" ? "#ffffff" : s.theme === "light" ? "#000000" : "#000000"};
  padding: 1.5rem;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 10000;
  max-width: ${s.position.includes("left") || s.position.includes("right") ? "400px" : "100%"};
  border-top: ${s.position.includes("top") ? "none" : "1px solid rgba(0,0,0,0.1)"};
  border-bottom: ${s.position.includes("bottom") ? "none" : "1px solid rgba(0,0,0,0.1)"};
  display: none;
}
.cookie-consent.show { display: block; }
.cookie-consent-content { margin-bottom: 1rem; }
.cookie-consent-content p { margin: 0 0 0.5rem 0; }
.cookie-consent-buttons { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.cookie-consent-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: opacity 0.2s;
}
.cookie-consent-button:hover { opacity: 0.9; }
.cookie-consent-accept {
  background: #007bff;
  color: white;
}
.cookie-consent-decline {
  background: transparent;
  border: 1px solid currentColor;
}
.cookie-consent-settings {
  background: transparent;
  border: 1px solid currentColor;
}
.cookie-consent-links { margin-top: 0.5rem; font-size: 0.875rem; }
.cookie-consent-links a { color: #007bff; text-decoration: underline; }

/* Settings Modal */
.cookie-settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 10001;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.cookie-settings-modal.show { display: flex; }
.cookie-settings-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
.cookie-settings-content h3 { margin-top: 0; }
.cookie-category {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
.cookie-category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.cookie-category-name {
  font-weight: 600;
}
.cookie-category-toggle {
  width: 44px;
  height: 24px;
  position: relative;
  background: #ccc;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.cookie-category-toggle.active {
  background: #007bff;
}
.cookie-category-toggle span {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: left 0.2s;
}
.cookie-category-toggle.active span {
  left: 22px;
}
.cookie-category-description {
  font-size: 0.875rem;
  color: #666;
}
.cookie-settings-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
}
.cookie-settings-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}
.cookie-settings-save {
  background: #007bff;
  color: white;
}
.cookie-settings-cancel {
  background: transparent;
  border: 1px solid #ccc;
}
  `.trim();

  const html = `
<div id="cookie-consent" class="cookie-consent">
  <div class="cookie-consent-content">
    <p>${escapeHtml(s.message)}</p>
    <div class="cookie-consent-links">
      ${s.privacyPolicyUrl ? `<a href="${escapeHtml(s.privacyPolicyUrl)}" target="_blank">Privacy Policy</a>` : ""}
      ${s.cookiePolicyUrl ? `${s.privacyPolicyUrl ? " | " : ""}<a href="${escapeHtml(s.cookiePolicyUrl)}" target="_blank">Cookie Policy</a>` : ""}
    </div>
  </div>
  <div class="cookie-consent-buttons">
    <button class="cookie-consent-button cookie-consent-accept" onclick="cookieConsent.acceptAll()">${escapeHtml(s.acceptButtonText)}</button>
    ${s.showDeclineButton ? `<button class="cookie-consent-button cookie-consent-decline" onclick="cookieConsent.declineAll()">${escapeHtml(s.declineButtonText)}</button>` : ""}
    ${s.showSettingsButton ? `<button class="cookie-consent-button cookie-consent-settings" onclick="cookieConsent.showSettings()">${escapeHtml(s.settingsButtonText)}</button>` : ""}
  </div>
</div>

${s.showSettingsButton ? `
<div id="cookie-settings-modal" class="cookie-settings-modal" onclick="event.target === this && cookieConsent.hideSettings()">
  <div class="cookie-settings-content" onclick="event.stopPropagation()">
    <h3>Cookie Preferences</h3>
    <p>Manage your cookie preferences. You can enable or disable different types of cookies below.</p>
    <div id="cookie-categories-list"></div>
    <div class="cookie-settings-buttons">
      <button class="cookie-settings-button cookie-settings-save" onclick="cookieConsent.savePreferences()">Save Preferences</button>
      <button class="cookie-settings-button cookie-settings-cancel" onclick="cookieConsent.hideSettings()">Cancel</button>
    </div>
  </div>
</div>
` : ""}
  `.trim();

  const analyticsInit = s.analyticsProvider === "google-analytics" && s.analyticsId
    ? `
  // Google Analytics initialization
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${escapeJs(s.analyticsId)}', {
    'anonymize_ip': true
  });
  `
    : s.analyticsProvider === "plausible" && s.analyticsId
      ? `
  // Plausible Analytics initialization
  (function() {
    var script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = '${escapeJs(s.analyticsId)}';
    script.src = 'https://plausible.io/js/script.js';
    document.getElementsByTagName('head')[0].appendChild(script);
  })();
  `
      : "// Add your analytics initialization code here";

  const js = `
(function() {
  'use strict';

  const COOKIE_CONSENT_NAME = 'cookie_consent';
  const COOKIE_EXPIRY_DAYS = 365;
  const categories = ${categoriesJson};

  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const sameSite = location.protocol === 'https:' ? ';SameSite=None;Secure' : '';
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + expires.toUTCString() + ';path=/' + sameSite;
  }

  function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  }

  function getConsentPreferences() {
    const saved = getCookie(COOKIE_CONSENT_NAME);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return saved === 'accepted' ? { accepted: true } : null;
    }
  }

  function saveConsentPreferences(preferences) {
    setCookie(COOKIE_CONSENT_NAME, JSON.stringify(preferences), COOKIE_EXPIRY_DAYS);
  }

  function initAnalytics() {
    const prefs = getConsentPreferences();
    if (!prefs || !prefs.categories) return;
    
    ${s.requireExplicitConsent ? `
    // Only load analytics if explicitly accepted
    const hasAnalyticsConsent = prefs.categories.analytics === true || prefs.accepted === true;
    if (!hasAnalyticsConsent) return;
    ` : ""}
    
${analyticsInit}
    
    // Load other scripts based on category preferences
    if (prefs.categories.marketing === true || prefs.accepted === true) {
      // Initialize marketing scripts here
      // Example: Facebook Pixel, Google Ads, etc.
    }
  }

  function renderCookieSettings() {
    const prefs = getConsentPreferences();
    const categoriesEl = document.getElementById('cookie-categories-list');
    if (!categoriesEl) return;

    categoriesEl.innerHTML = categories.map(cat => {
      const isEnabled = cat.required || (prefs?.categories?.[cat.id] === true) || (prefs?.accepted === true);
      return \`
        <div class="cookie-category">
          <div class="cookie-category-header">
            <div>
              <div class="cookie-category-name">\${cat.name}\${cat.required ? ' (Required)' : ''}</div>
              <div class="cookie-category-description">\${cat.description}</div>
            </div>
            \${!cat.required ? \`<div class="cookie-category-toggle \${isEnabled ? 'active' : ''}" data-category="\${cat.id}" onclick="cookieConsent.toggleCategory('\${cat.id}')">
              <span></span>
            </div>\` : '<span style="color:#666;">Required</span>'}
          </div>
        </div>
      \`;
    }).join('');
  }

  window.cookieConsent = {
    show: function() {
      const el = document.getElementById('cookie-consent');
      if (el) el.classList.add('show');
    },
    
    hide: function() {
      const el = document.getElementById('cookie-consent');
      if (el) el.classList.remove('show');
    },

    acceptAll: function() {
      const preferences = {
        accepted: true,
        timestamp: new Date().toISOString(),
        categories: categories.reduce((acc, cat) => {
          acc[cat.id] = true;
          return acc;
        }, {})
      };
      saveConsentPreferences(preferences);
      this.hide();
      initAnalytics();
    },

    declineAll: function() {
      const preferences = {
        accepted: false,
        timestamp: new Date().toISOString(),
        categories: categories.reduce((acc, cat) => {
          acc[cat.id] = cat.required;
          return acc;
        }, {})
      };
      saveConsentPreferences(preferences);
      this.hide();
    },

    showSettings: function() {
      const modal = document.getElementById('cookie-settings-modal');
      if (modal) {
        modal.classList.add('show');
        renderCookieSettings();
      }
    },

    hideSettings: function() {
      const modal = document.getElementById('cookie-settings-modal');
      if (modal) modal.classList.remove('show');
    },

    toggleCategory: function(categoryId) {
      const toggle = document.querySelector(\`[data-category="\${categoryId}"]\`);
      if (toggle) toggle.classList.toggle('active');
    },

    savePreferences: function() {
      const prefs = getConsentPreferences() || {};
      const preferences = {
        accepted: false,
        timestamp: new Date().toISOString(),
        categories: categories.reduce((acc, cat) => {
          const toggle = document.querySelector(\`[data-category="\${cat.id}"]\`);
          acc[cat.id] = cat.required || (toggle?.classList.contains('active') || false);
          return acc;
        }, {})
      };
      saveConsentPreferences(preferences);
      this.hideSettings();
      this.hide();
      initAnalytics();
    }
  };

  // Check if consent already given
  const existingConsent = getConsentPreferences();
  if (!existingConsent) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => cookieConsent.show());
    } else {
      cookieConsent.show();
    }
  } else {
    // Consent already given, initialize analytics if accepted
    initAnalytics();
  }
})();
  `.trim();

  const snippet = `<style>
${css}
</style>

${html}

<script>
${js}
</script>`;

  const implementationGuide = `<!-- IMPLEMENTATION GUIDE -->
<!-- 
1. Copy the CSS, HTML, and JavaScript above into your website
  
2. Place the <style> tag in your <head> section or in a CSS file
  
3. Place the HTML before the closing </body> tag
  
4. Place the <script> tag before the closing </body> tag (after the HTML)
  
5. Customize the analytics initialization in the initAnalytics() function
   - Replace the placeholder code with your actual analytics setup
   - Only scripts in accepted categories will load
  
6. Test the consent flow:
   - Clear cookies and refresh to see the banner
   - Test Accept All, Decline, and Settings buttons
   - Verify analytics only loads after consent
  
7. Ensure your privacy policy includes cookie information
  
8. For GDPR compliance:
   - Don't load non-essential scripts until consent is given
   - Provide a way to change preferences later
   - Make it easy for users to decline

${s.analyticsProvider === "google-analytics" && s.analyticsId ? `
9. Google Analytics is configured. Add this to your <head>:
   <script async src="https://www.googletagmanager.com/gtag/js?id=${escapeJs(s.analyticsId)}"></script>
   The initAnalytics() function will configure it after consent.
` : s.analyticsProvider === "plausible" && s.analyticsId ? `
9. Plausible Analytics is configured and will load automatically after consent.
` : `
9. Configure your analytics provider in the initAnalytics() function.
`}
-->`;

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cookie Consent - ${escapeHtml(s.companyName)}</title>
  <style>
${css}
  </style>
</head>
<body>
  <!-- Your website content here -->
  
${html}
  
  <script>
${js}
  </script>
</body>
</html>`;

  // Create a preview-safe version of the JS (replace cookie storage with session storage for preview)
  const previewJs = js.replace(/document\.cookie/g, 'sessionStorage.setItem("preview_") || document.cookie').replace(/getCookie\(/g, 'sessionStorage.getItem("preview_") || getCookie(');

  const previewHtml = `
    <div>
      <div style="font-size:12px;color:rgba(120,120,120,1);margin-bottom:8px;">
        Cookie Consent ${s.style === "banner" ? "Banner" : s.style === "modal" ? "Modal" : "Inline"} Preview
      </div>
      <div style="position:relative;border:1px solid rgba(0,0,0,0.1);border-radius:6px;overflow:hidden;min-height:200px;">
        <style>${css}</style>
        ${html
          .replace(/id="cookie-consent"/, 'id="cookie-consent-preview"')
          .replace(/id="cookie-settings-modal"/, 'id="cookie-settings-modal-preview"')
          .replace(/id="cookie-categories-list"/, 'id="cookie-categories-list-preview"')
          .replace(/onclick="cookieConsent\./g, 'onclick="window.previewCookieConsent?.')
          .replace(/onclick="event\.target === this && cookieConsent\./g, 'onclick="event.target === this && window.previewCookieConsent?.')
          .replace(/class="cookie-consent/, 'style="position:relative;background:#ffffff;color:#000000;padding:1.5rem;max-width:100%;display:block;" class="cookie-consent show')}
      </div>
      <script>
(function() {
  'use strict';
  // Preview-safe version - use sessionStorage instead of cookies for demo
  const COOKIE_CONSENT_NAME = 'cookie_consent';
  const categories = ${categoriesJson};

  function setCookie(name, value, days) {
    sessionStorage.setItem('preview_' + name, value);
    return;
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const sameSite = location.protocol === 'https:' ? ';SameSite=None;Secure' : '';
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + expires.toUTCString() + ';path=/' + sameSite;
  }

  function getCookie(name) {
    const preview = sessionStorage.getItem('preview_' + name);
    if (preview) return preview;
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  }

  function getConsentPreferences() {
    const saved = getCookie(COOKIE_CONSENT_NAME);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return saved === 'accepted' ? { accepted: true } : null;
    }
  }

  function saveConsentPreferences(preferences) {
    setCookie(COOKIE_CONSENT_NAME, JSON.stringify(preferences), 365);
  }

  function renderCookieSettings() {
    const prefs = getConsentPreferences();
    const categoriesEl = document.getElementById('cookie-categories-list-preview');
    if (!categoriesEl) return;

    categoriesEl.innerHTML = categories.map(cat => {
      const isEnabled = cat.required || (prefs?.categories?.[cat.id] === true) || (prefs?.accepted === true);
      return \`
        <div class="cookie-category">
          <div class="cookie-category-header">
            <div>
              <div class="cookie-category-name">\${cat.name}\${cat.required ? ' (Required)' : ''}</div>
              <div class="cookie-category-description">\${cat.description}</div>
            </div>
            \${!cat.required ? \`<div class="cookie-category-toggle \${isEnabled ? 'active' : ''}" data-category="\${cat.id}" onclick="window.previewCookieConsent?.toggleCategory('\${cat.id}')">
              <span></span>
            </div>\` : '<span style="color:#666;">Required</span>'}
          </div>
        </div>
      \`;
    }).join('');
  }

  window.previewCookieConsent = {
    show: function() {
      const el = document.getElementById('cookie-consent-preview');
      if (el) el.classList.add('show');
    },
    hide: function() {
      const el = document.getElementById('cookie-consent-preview');
      if (el) el.classList.remove('show');
    },
    acceptAll: function() {
      const preferences = {
        accepted: true,
        timestamp: new Date().toISOString(),
        categories: categories.reduce((acc, cat) => {
          acc[cat.id] = true;
          return acc;
        }, {})
      };
      saveConsentPreferences(preferences);
      this.hide();
      alert('Cookies accepted! In production, analytics scripts would load now.');
    },
    declineAll: function() {
      const preferences = {
        accepted: false,
        timestamp: new Date().toISOString(),
        categories: categories.reduce((acc, cat) => {
          acc[cat.id] = cat.required;
          return acc;
        }, {})
      };
      saveConsentPreferences(preferences);
      this.hide();
      alert('Cookies declined. Only essential cookies will be used.');
    },
    showSettings: function() {
      const modal = document.getElementById('cookie-settings-modal-preview');
      if (modal) {
        modal.classList.add('show');
        renderCookieSettings();
      }
    },
    hideSettings: function() {
      const modal = document.getElementById('cookie-settings-modal-preview');
      if (modal) modal.classList.remove('show');
    },
    toggleCategory: function(categoryId) {
      const toggle = document.querySelector(\`[data-category="\${categoryId}"]\`);
      if (toggle) toggle.classList.toggle('active');
    },
    savePreferences: function() {
      const prefs = getConsentPreferences() || {};
      const preferences = {
        accepted: false,
        timestamp: new Date().toISOString(),
        categories: categories.reduce((acc, cat) => {
          const toggle = document.querySelector(\`[data-category="\${cat.id}"]\`);
          acc[cat.id] = cat.required || (toggle?.classList.contains('active') || false);
          return acc;
        }, {})
      };
      saveConsentPreferences(preferences);
      this.hideSettings();
      this.hide();
      alert('Preferences saved! In production, only selected cookie categories would load.');
    }
  };

  // Show banner if no consent
  const existingConsent = getConsentPreferences();
  if (!existingConsent) {
    setTimeout(() => window.previewCookieConsent?.show(), 100);
  }

  // Show banner if no consent
  const existingConsent = getConsentPreferences();
  if (!existingConsent) {
    setTimeout(() => window.previewCookieConsent?.show(), 100);
  }
})();
      </script>
      <div style="margin-top:12px;padding:12px;background:rgba(59,130,246,0.1);border-radius:6px;font-size:12px;">
        <strong>💡 Interactive Preview:</strong> Click buttons to test the functionality. This is a working preview - the generated code will work the same way on your site.
      </div>
    </div>
  `.trim();

  return {
    type: "files",
    content: snippet,
    files: [
      {
        filename: "cookie-consent.html",
        content: fullHtml,
        mimeType: "text/html",
      },
      {
        filename: "cookie-consent-snippet.html",
        content: snippet + "\n\n" + implementationGuide,
        mimeType: "text/html",
      },
      {
        filename: "cookie-consent.js",
        content: js,
        mimeType: "text/javascript",
      },
      {
        filename: "cookie-consent.css",
        content: css,
        mimeType: "text/css",
      },
      {
        filename: "IMPLEMENTATION.md",
        content: implementationGuide.replace(/<!-- | -->/g, ""),
        mimeType: "text/markdown",
      },
    ],
    preview: previewHtml,
  };
}
