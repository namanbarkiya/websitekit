# websitekit — Technical + UX Execution Document (for Cursor AI)

This document is the **single source of truth** for building **websitekit**.  
It captures **product intent, UX rules, architectural boundaries, and scalability constraints** discussed so far.

This is **not framework-specific** in terms of implementation details, but assumes a modern React-style app with routing, client-side state, and modular architecture.

---

## 1. Product Overview

**websitekit** is an open-source, community-driven toolkit that helps developers generate essential website setup assets (SEO, icons, PWA, performance, security, etc.) from a single interface.

Key ideas:

-   One shared website context
-   Many isolated tools
-   No forced onboarding
-   No login
-   No framework lock-in

---

## 2. Core Architectural Principles (Non-Negotiable)

### 2.1 Tool Isolation

-   Every tool is **fully isolated**
-   Tools do not depend on each other
-   Tools do not import from other tools
-   Tools cannot mutate global state

> Tools behave like plugins.  
> websitekit is the host.

---

### 2.2 Global Context is Read-Only

-   Website assets (name, domain, logo, color, etc.) are **defaults**
-   Stored in local storage
-   Editable **only** from a dedicated Asset Modal
-   Tools may **read** assets but **never write** to them

If a tool needs to change something:

-   It changes **local tool state only**
-   Global updates require explicit user action via the Asset Modal

---

### 2.3 UX Consistency Over Behavioral Consistency

-   Tools may behave differently internally
-   But must respect shared layout, navigation, and output patterns
-   UX consistency is enforced by the host, not the tool

---

## 3. High-Level Project Structure

/app
/ ← Landing page
/tools ← Tools dashboard
/tools/[toolId] ← Tool host page

/core
asset-context
tool-registry
tool-types
output-types
search-index

/tools
/meta-tags
/favicon
/robots
...

/ui
button
input
modal
tabs
sidebar
layout

### Folder Intent

-   `/core` → system-level logic only
-   `/tools` → isolated plugins
-   `/ui` → dumb UI primitives (no business logic)
-   `/app` → routing & composition

---

## 4. Pages & Navigation

### 4.1 Landing Page (`/`)

Purpose:

-   Ask user intent
-   Nothing else

Two equal CTAs:

-   **Browse Tools**
-   **Generate Full Website Kit** (future / disabled / beta)

No onboarding, no explanation overload.

---

### 4.2 Tools Dashboard (`/tools`)

This is the **main product surface**.

Layout:

## Top Bar

Sidebar | Main Content Area

Top Bar:

-   websitekit logo
-   Global search input
-   “Set Website Assets” button

---

### 4.3 Tool Host Page (`/tools/[toolId]`)

Responsible for:

-   Loading tool definition
-   Injecting global context
-   Rendering tool UI
-   Rendering outputs using a shared renderer

Tools **do not handle routing, layout, or exports**.

---

## 5. Website Asset Context

### 5.1 Asset Model (Conceptual)

WebsiteAssets:

-   name
-   domain
-   description
-   primaryColor
-   logo

### 5.2 Asset Modal

-   Single place to edit assets
-   Opens as modal/drawer
-   Persists to localStorage
-   Changes propagate to tools only as defaults

Rules:

-   No direct localStorage access inside tools
-   No setters exposed to tools

---

## 6. Tool Definition Contract

Every tool must export a **manifest**.

Conceptual structure:

ToolDefinition:

-   id
-   name
-   description
-   category
-   keywords[]
-   acceptedContext[]
-   outputs[]
-   UI components
-   run() logic

This enables:

-   Discovery
-   Search
-   Categorization
-   Output handling
-   Future automation

---

## 7. Tool-Level State Rules

-   Tools initialize state from global context
-   Tools manage their own local state
-   Overrides stay local
-   Reset behavior must be explicit

Example behavior:

-   Meta tool uses global title initially
-   User edits title locally
-   Global asset remains unchanged

---

## 8. Output System

### 8.1 Output Types (Conceptual)

Outputs are **typed**, not visual.

Examples:

-   HTML
-   File
-   Multiple files
-   JSON
-   Image / blob
-   Text snippet

Tools return structured output.
They never render export UI themselves.

---

### 8.2 Output Renderer (Host-Owned)

Responsibilities:

-   Tabs (Preview / Code / Files)
-   Copy buttons
-   Download actions
-   File naming
-   UX consistency

This ensures:

-   Tools remain logic-focused
-   UX remains consistent
-   New output types can be added centrally

---

## 9. Sidebar, Search & Filters

### 9.1 Sidebar Structure

Categories only:

-   Setup
-   SEO
-   Performance
-   Security
-   Social
-   Utilities

No flat lists.

---

### 9.2 Tool Search (First-Class Feature)

Search is:

-   Global
-   Always visible
-   Instant (no results page)

Search Index is built from tool metadata:

-   name
-   description
-   keywords
-   category

Example:
Search: `ico`, `preview icon`, `browser icon`
→ returns **Favicon Generator**

---

### 9.3 Keyword Rules

-   Each tool must define **at least 5 keywords**
-   Keywords must include:
    -   synonyms
    -   common terms
    -   non-technical phrasing

No inferred keywords. No auto-generation.

---

### 9.4 Filters (Present & Future)

Initial filters:

-   Category

Future-ready filters:

-   Output type
-   Tool complexity
-   Popular / recommended

---

## 10. UX Rules for Tools (Strict)

Every tool must:

-   Fit inside the host layout
-   Use provided UI primitives
-   Respect spacing and layout boundaries
-   Never trigger navigation
-   Never access global storage directly

Forbidden:

-   Custom download logic
-   Custom page routing
-   Tool-specific sidebars

---

## 11. Scalability Considerations

### UX Scalability

-   Sidebar + search scales to 100+ tools
-   Layout consistency prevents cognitive overload
-   Progressive disclosure keeps tools usable

### Code Scalability

-   Tools added without modifying core
-   Tool removal does not affect others
-   Registry-based discovery

### Community Scalability

-   Predictable contracts
-   Minimal review surface
-   No UX debates per tool

---

## 12. Contributor Expectations (Summary)

Contributors:

-   Add one tool at a time
-   Follow the tool contract
-   Declare keywords properly
-   Do not modify global UX
-   Do not touch other tools

This keeps the project healthy.

---

## 13. Future-Proofing (Intentional Design)

This architecture supports:

-   Full website kit generation
-   Preset bundles
-   CLI / API reuse
-   Platform-specific exports
-   Community-curated tools

Without refactoring core assumptions.

---

## 14. Final Note

websitekit is a **platform**, not a collection of generators.

This document exists to:

-   protect isolation
-   preserve UX quality
-   scale tools without chaos
-   help contributors build confidently

If something feels easy to hack but violates these rules —  
**it should not be merged.**
