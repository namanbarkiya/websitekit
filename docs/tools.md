# websitekit — Tool Catalog

This document lists all planned tools for **websitekit**, split into two categories:

-   **Top 10 (v1 launch tools)**
-   **Extended Tool Set (roadmap)**

Each tool is designed to be **independent, context-aware, and scalable**.

---

## 🚀 Top 10 Tools (v1 Launch)

These tools provide maximum value at launch and form the foundation of websitekit.

### 1. Website Asset Manager

Defines and manages shared website assets such as name, domain, description, brand color, and logo.  
Acts as the global context for all other tools.

---

### 2. Meta Tags Generator

Generates SEO, Open Graph, Twitter, and AI-friendly meta tags using website context with optional overrides.

---

### 3. Favicon Generator

Creates complete favicon and app icon sets for browsers, iOS, Android, and Windows from a single image or logo.

---

### 4. robots.txt Generator

Generates crawler rules for search engines and AI bots with sensible, production-ready defaults.

---

### 5. Sitemap.xml Generator

Creates XML sitemaps from user-provided URLs with configurable priority and change frequency.

---

### 6. PWA Manifest Generator

Generates `manifest.json` for installable web apps, including icons, theme colors, and display modes.

---

### 7. Social Preview Image Generator

Generates Open Graph and Twitter preview images using brand color, title, and description.

---

### 8. Basic Security Headers Generator

Creates baseline HTTP security headers with explanations and export-ready snippets.

---

### 9. HTML Head Exporter

Combines outputs from multiple tools into a single, production-ready `<head>` snippet.

---

### 10. SEO & AI Readiness Checklist

Audits basic SEO, metadata, and AI discoverability with actionable recommendations.

---

## 🧰 Extended Tool Set (Roadmap)

These tools expand coverage and can be added incrementally without affecting core UX.

### 11. Canonical URL Generator

Generates canonical URL tags to avoid duplicate content issues across domains or paths.

---

### 12. JSON-LD Generator

Creates structured data for organizations, products, articles, profiles, and websites.

---

### 13. Preload & Preconnect Generator

Generates resource hints for fonts, APIs, and critical assets to improve performance.

---

### 14. Font Loading Strategy Tool

Generates optimized font-loading patterns using modern best practices.

---

### 15. Image Optimization Guide Generator

Provides recommendations for image formats, sizes, compression, and lazy loading.

---

### 16. Content Security Policy (CSP) Generator

Builds Content Security Policies with safe defaults and incremental tightening options.

---

### 17. Permissions Policy Generator

Generates browser permissions policies for controlling access to sensitive features.

---

### 18. Brand Color Palette Helper

Generates accessible color palettes derived from a primary brand color.

---

### 19. Logo Usage & Export Helper

Creates logo variants and exports for light/dark backgrounds and multiple formats.

---

### 20. Platform-Specific Export Tool

Exports generated outputs tailored for platforms like Next.js, Vercel, Netlify, or Nginx.

---

### 21. Environment Metadata Generator

Generates environment-aware metadata (production, staging, preview).

---

### 22. Accessibility Meta Helper

Checks and generates accessibility-related metadata and best-practice hints.

---

### 23. Web Standards Checklist

Audits usage of modern web standards and highlights gaps or improvements.

---

### 24. File Structure Template Generator

Generates a clean starter file and folder structure for public assets and configs.

---

### 25. Full Website Kit Generator

Bundles selected tools and outputs into a single downloadable production-ready package.

---

## Notes

-   All tools are **independent by design**
-   Global website context is **read-only**
-   Tools may override context locally
-   New tools must fit into this structure without altering core UX

This catalog defines the **long-term surface area** of websitekit while keeping the v1 scope focused and achievable.
