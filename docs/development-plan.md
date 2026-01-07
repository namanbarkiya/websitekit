# websitekit — Development Plan & Missing Components

This document outlines what's currently implemented and what needs to be built to start product development.

---

## 📋 Executive Summary

**Current Status:** Basic UI infrastructure is in place, but core platform functionality is missing.

**Critical Gaps:**
1. Website Asset Context system (global state management)
2. Tool Definition Contract & Registry
3. Output System (shared renderer)
4. Tool Host Page (dynamic tool loading)
5. Tools Dashboard page
6. All tool implementations are placeholders

---

## ✅ What's Currently Implemented

### UI Infrastructure (Complete)
- ✅ Sidebar navigation with categories
- ✅ Sidebar search functionality
- ✅ Landing page (`/`)
- ✅ Responsive layout system
- ✅ UI component library (shadcn/ui)
- ✅ Dark mode support
- ✅ Breadcrumbs system
- ✅ Settings popover

### Routing & Structure (Partial)
- ✅ All tool routes exist (`/tools/[toolId]`)
- ✅ Tool pages created (but only placeholders)
- ✅ Sidebar configuration with 24 tools defined
- ❌ Tools Dashboard page (`/tools`) - **MISSING**
- ❌ Dynamic tool host page - **MISSING**

### State Management (Complete)
- ✅ App store (errors, loading states)
- ✅ UI store (sidebar state, theme)
- ✅ Breadcrumb store
- ✅ Website Asset Context store (`lib/store/asset-store.ts`)
- ✅ Asset hooks (`lib/hooks/use-website-assets.ts`)

### Search (Complete)
- ✅ Keyword-based search
- ✅ Category filtering
- ✅ Tool discovery via sidebar

---

## 🚨 Critical Missing Components

### 1. Website Asset Context System

**Status:** ✅ Implemented  
**Priority:** 🔴 Critical (Blocks all tool development)

**What's Needed:**
- Global state store for website assets:
  - `name` (string)
  - `domain` (string)
  - `description` (string)
  - `primaryColor` (string - hex)
  - `logo` (string - base64 or URL)
- localStorage persistence
- Read-only access for tools (no setters exposed)
- Asset Modal component to edit assets
- Hook for tools to access assets: `useWebsiteAssets()`

**Implementation Location:**
```
lib/store/
  asset-store.ts      # Zustand store for assets (includes types)
lib/hooks/
  use-website-assets.ts  # useWebsiteAssets hook
components/
  asset-modal.tsx     # Modal to edit website assets
```

**Key Requirements:**
- Assets stored in localStorage key: `websitekit-assets`
- Tools can read but never write
- Changes only via Asset Modal
- Default values when no assets set

---

### 2. Tool Definition Contract & Registry

**Status:** ✅ Implemented  
**Priority:** 🔴 Critical (Required for tool system)

**What's Needed:**
- TypeScript interfaces for tool definitions:
  ```typescript
  interface ToolDefinition {
    id: string;
    name: string;
    description: string;
    category: string;
    keywords: string[];
    acceptedContext: string[];  // e.g., ["name", "domain", "logo"]
    outputs: OutputType[];       // e.g., ["html", "json", "file"]
    Component: React.ComponentType<ToolProps>;
    run?: (state: ToolState, context: WebsiteAssets) => ToolOutput;
  }
  ```
- Tool registry to map tool IDs to definitions
- Tool metadata validation
- Integration with sidebar config

**Implementation Location:**
```
lib/utils/
  tool-registry.ts    # ToolDefinition, ToolProps, ToolOutput types and registry
lib/hooks/
  use-tool-state.ts   # Hook for tool state management
  use-tool-context.tsx # Tool context provider and hook
lib/tools/
  {tool-id}/
    index.ts          # Tool definition export
    component.tsx     # Tool UI component
    logic.ts          # Tool generation logic (optional)
```

**Key Requirements:**
- Tools must export a manifest
- Tools are isolated (no cross-tool imports)
- Tools cannot mutate global state
- Registry built from sidebar config + tool definitions

---

### 3. Output System (Shared Renderer)

**Status:** ✅ Implemented  
**Priority:** 🔴 Critical (Required for tool outputs)

**What's Needed:**
- Output renderer component that handles:
  - **Preview Tab** - Live preview of output (if applicable)
  - **Code Tab** - Syntax-highlighted code view
  - **Files Tab** - File download UI (for multi-file outputs)
- Copy-to-clipboard functionality
- Download actions (single file or zip for multiple)
- File naming conventions
- Support for output types:
  - HTML
  - JSON
  - Text/Plain
  - File(s)
  - Image/Blob
  - Multiple files (zip)

**Implementation Location:**
```
components/
  output-renderer.tsx   # Main output renderer (includes Preview/Code/Files tabs)
lib/utils/
  output-utils.ts       # Output formatting utilities, copy, download functions
lib/utils/
  tool-registry.ts      # ToolOutput, ToolOutputFile types (shared with registry)
```

**Key Requirements:**
- Consistent UX across all tools
- Tools return structured output, not rendered UI
- Copy buttons with toast notifications
- Download handling (browser download or zip)
- Syntax highlighting for code outputs

---

### 4. Tool Host Page

**Status:** ❌ Not Implemented  
**Priority:** 🔴 Critical (Required to display tools)

**What's Needed:**
- Dynamic page at `/app/tools/[toolId]/page.tsx`
- Responsibilities:
  - Load tool definition from registry
  - Inject website asset context
  - Render tool UI component
  - Handle tool state management
  - Render outputs using shared renderer
  - Error handling for missing/invalid tools
- Tool state management (local state per tool)
- Context passing to tool components

**Implementation Location:**
```
app/tools/[toolId]/
  page.tsx              # Dynamic tool host page
lib/hooks/
  use-tool-state.ts     # Hook for tool state management
  use-tool-context.tsx  # Tool context provider and hook
```

**Key Requirements:**
- Tools receive website assets as read-only context
- Tools manage their own local state
- Tools return outputs, host renders them
- 404 handling for invalid tool IDs

---

### 5. Tools Dashboard Page

**Status:** ❌ Not Implemented  
**Priority:** 🟡 High (Better UX than landing page for tools)

**What's Needed:**
- Page at `/app/tools/page.tsx`
- Display categorized tools
- Search and filter functionality
- "Set Website Assets" button/link
- Quick access to popular/recent tools (future)

**Implementation Location:**
```
app/tools/
  page.tsx              # Tools dashboard
```

**Key Requirements:**
- Reuses sidebar config for tool listing
- Integrates with search functionality
- Prominent "Set Website Assets" CTA
- Visual grid/list view of tools

---

### 6. Asset Modal Component

**Status:** ✅ Implemented  
**Priority:** 🔴 Critical (Required for global context)

**What's Needed:**
- Modal/Drawer component to edit website assets
- Form fields:
  - Website name (text input)
  - Domain (text input with validation)
  - Description (textarea)
  - Primary color (color picker)
  - Logo (file upload with preview)
- Save to localStorage
- Close/cancel actions
- Accessible from:
  - Settings popover
  - Tools dashboard
  - Tool pages (via header button)

**Implementation Location:**
```
components/
  asset-modal.tsx       # Main modal component (includes form and validation)
lib/store/
  asset-store.ts        # Asset store with validation helpers
```

**Key Requirements:**
- Single source of truth for asset editing
- Validation (domain format, color hex, etc.)
- Image upload handling (base64 or blob URL)
- Changes propagate to tools as defaults
- Persistent across sessions

---

## 🛠️ Tool Implementation Status

All 24 tools have placeholder pages. None are fully implemented.

### Priority 1: Foundation Tools (Must implement first)
1. **Website Assets** (`/tools/assets`) - ✅ **Functional** (Asset modal integrated)
2. **Meta Tags** (`/tools/meta-tags`) - ❌ Placeholder
3. **robots.txt** (`/tools/robots`) - ❌ Placeholder
4. **Sitemap** (`/tools/sitemap`) - ❌ Placeholder

### Priority 2: SEO Tools
5. **Canonical URL** (`/tools/canonical-url`) - ❌ Placeholder
6. **JSON-LD Schema** (`/tools/json-ld`) - ❌ Placeholder
7. **SEO Checklist** (`/tools/seo-checklist`) - ❌ Placeholder

### Priority 3: Social & Branding
8. **Social Preview** (`/tools/social-preview`) - ❌ Placeholder
9. **Logo Export** (`/tools/logo-export`) - ❌ Placeholder
10. **Brand Colors** (`/tools/brand-colors`) - ❌ Placeholder

### Priority 4: Performance
11. **Preload Hints** (`/tools/preload`) - ❌ Placeholder
12. **Font Loading** (`/tools/font-loading`) - ❌ Placeholder
13. **Image Guide** (`/tools/image-guide`) - ❌ Placeholder
14. **Minifier** (`/tools/minifier`) - ❌ Placeholder

### Priority 5: Security
15. **Security Headers** (`/tools/security-headers`) - ❌ Placeholder
16. **CSP Generator** (`/tools/csp`) - ❌ Placeholder
17. **Permissions** (`/tools/permissions`) - ❌ Placeholder
18. **Privacy Policy** (`/tools/privacy-policy`) - ❌ Placeholder
19. **Cookie Consent** (`/tools/cookie-consent`) - ❌ Placeholder

### Priority 6: Utilities
20. **Placeholder** (`/tools/placeholder`) - ❌ Placeholder
21. **Gradient** (`/tools/gradient`) - ❌ Placeholder
22. **SVG Shapes** (`/tools/svg-shapes`) - ❌ Placeholder
23. **QR Code** (`/tools/qr-code`) - ❌ Placeholder

### Priority 7: Advanced (Future)
24. **Favicon** (`/tools/favicon`) - ❌ Placeholder
25. **HTML Head** (`/tools/html-head`) - ❌ Placeholder

---

## 📦 Recommended Implementation Order

### Phase 1: Core Platform (Week 1)
**Goal:** Enable tool development infrastructure

1. **Website Asset Context System**
   - Create asset store (`lib/store/asset-store.ts`) with types included
   - Create `useWebsiteAssets()` hook (`lib/hooks/use-website-assets.ts`)
   - Add localStorage persistence

2. **Asset Modal Component**
   - Build modal UI (`components/asset-modal.tsx`)
   - Implement form validation
   - Add logo upload handling
   - Integrate with asset store

3. **Tool Definition Contract**
   - Define TypeScript interfaces and registry (`lib/utils/tool-registry.ts`)
   - Create tool state hook (`lib/hooks/use-tool-state.ts`)
   - Create tool context provider (`lib/hooks/use-tool-context.tsx`)

4. **Output System**
   - Create output renderer (`components/output-renderer.tsx`)
   - Implement Preview/Code/Files tabs
   - Add output utilities (`lib/utils/output-utils.ts`)
   - Add copy-to-clipboard and download functionality

### Phase 2: Tool Hosting (Week 1-2)
**Goal:** Enable dynamic tool rendering

5. **Tool Host Page**
   - Create dynamic route (`app/tools/[toolId]/page.tsx`)
   - Implement tool loading from registry
   - Add context injection
   - Integrate output renderer

6. **Tools Dashboard**
   - Create dashboard page (`app/tools/page.tsx`)
   - Display categorized tools
   - Add "Set Assets" CTA

### Phase 3: First Tool Implementation (Week 2)
**Goal:** Validate architecture with working tool

7. **Meta Tags Tool**
   - Implement tool component
   - Add form inputs (title, description, etc.)
   - Generate meta tags HTML
   - Test with output renderer
   - Validate context integration

### Phase 4: Tool Expansion (Week 3+)
**Goal:** Build remaining tools

8. **Website Assets Tool** (Priority 1)
9. **robots.txt Tool** (Priority 1)
10. **Sitemap Tool** (Priority 1)
11. Continue with remaining tools in priority order

---

## 🏗️ Architecture Overview

### Directory Structure (Actual)

```
/
├── app/
│   ├── tools/
│   │   ├── page.tsx                    # Dashboard (MISSING)
│   │   └── [toolId]/
│   │       └── page.tsx                # Dynamic host (MISSING)
│   └── ...
├── components/
│   ├── asset-modal.tsx                 # Asset editor ✅
│   ├── output-renderer.tsx             # Output UI ✅
│   └── ...
├── lib/
│   ├── store/
│   │   ├── asset-store.ts              # Asset store with types ✅
│   │   ├── app-store.ts                # App state ✅
│   │   ├── ui-store.ts                 # UI state ✅
│   │   └── breadcrumb-store.ts         # Breadcrumb state ✅
│   ├── hooks/
│   │   ├── use-website-assets.ts       # Asset access hook ✅
│   │   ├── use-tool-state.ts           # Tool state management ✅
│   │   ├── use-tool-context.tsx        # Tool context provider ✅
│   │   └── ...                         # Other hooks
│   ├── utils/
│   │   ├── tool-registry.ts            # Tool registry & types ✅
│   │   ├── output-utils.ts             # Output utilities ✅
│   │   └── ...                         # Other utilities
│   └── tools/                          # Individual tools (FUTURE)
│       ├── meta-tags/
│       │   ├── index.ts                # Tool definition
│       │   ├── component.tsx           # Tool UI
│       │   └── logic.ts                # Generation logic
│       └── ...
└── ...
```

**Note:** The project follows this structure:
- `lib/store/` - All Zustand stores
- `lib/hooks/` - All React hooks
- `lib/utils/` - Utility functions and shared logic
- `components/` - React components

---

## 🔍 Key Technical Decisions Needed

### 1. State Management
- **Decision:** Use Zustand for asset store (consistent with existing stores)
- **Rationale:** Already in use, simple API, good TypeScript support

### 2. Tool Loading Strategy
- **Option A:** Static imports (all tools bundled)
- **Option B:** Dynamic imports (code splitting per tool)
- **Recommendation:** Option B for better performance as tool count grows

### 3. Output Formatting
- **Decision:** Tools return structured data, host formats for display
- **Rationale:** Separation of concerns, consistent UX

### 4. File Handling
- **Decision:** Use browser APIs (Blob, File) for downloads
- **For ZIP:** Use `jszip` library
- **For Images:** Canvas API for generation

### 5. Syntax Highlighting
- **Decision:** Use `react-syntax-highlighter` or `shiki`
- **Recommendation:** `shiki` for better performance (server-side highlighting)

---

## 📝 Implementation Checklist

### Core Platform
- [ ] Website Asset Context store
- [ ] Asset types & interfaces
- [ ] `useWebsiteAssets()` hook
- [ ] Asset Modal component
- [ ] Tool Definition types
- [ ] Tool Registry
- [ ] Tool loader utilities
- [ ] Output renderer component
- [ ] Output Preview tab
- [ ] Output Code tab (with syntax highlighting)
- [ ] Output Files tab
- [ ] Copy-to-clipboard utility
- [ ] Download utility (single & zip)

### Tool Hosting
- [ ] Dynamic tool host page
- [ ] Tool context provider
- [ ] Tool state management hook
- [ ] Error handling for invalid tools
- [ ] Tools Dashboard page

### First Tool (Meta Tags)
- [ ] Tool definition
- [ ] Tool component UI
- [ ] Form inputs (title, description, OG tags, etc.)
- [ ] Generation logic
- [ ] Output formatting
- [ ] Integration with asset context
- [ ] Testing & validation

---

## 🚀 Getting Started

### Immediate Next Steps

1. **Create asset context system** (2-3 hours)
   - Start with `lib/store/asset-store.ts` (includes types)
   - Create hook in `lib/hooks/use-website-assets.ts`

2. **Build asset modal** (3-4 hours)
   - Create `components/asset-modal.tsx`
   - Add form fields
   - Integrate with store

3. **Create tool registry** (2-3 hours)
   - Define interfaces and registry in `lib/utils/tool-registry.ts`
   - Create hooks in `lib/hooks/use-tool-state.ts` and `lib/hooks/use-tool-context.tsx`

4. **Build output renderer** (4-5 hours)
   - Create `components/output-renderer.tsx`
   - Add utilities in `lib/utils/output-utils.ts`
   - Implement tabs
   - Add copy/download functionality

5. **Create tool host page** (2-3 hours)
   - Dynamic route with tool loading
   - Context injection

**Total estimated time for Phase 1:** 13-18 hours

---

## 📚 References

- Product Documentation: `docs/product.md`
- Technical Documentation: `docs/technical.md`
- Tool List: `docs/tools.md`
- Sidebar Config: `config/sidebar.ts`

---

## 🎯 Success Criteria

The platform is ready for tool development when:

1. ✅ Website assets can be set and persist in localStorage
2. ✅ Tools can read website assets as read-only context
3. ✅ Tool definitions can be registered and loaded
4. ✅ Tools can return structured outputs
5. ✅ Output renderer displays outputs consistently
6. ✅ At least one tool (Meta Tags) is fully functional
7. ✅ Tool host page dynamically loads and renders tools
8. ✅ Tools Dashboard exists and displays all tools

---

**Last Updated:** 2025-01-XX  
**Status:** Phase 1 Complete ✅ - Ready for Phase 2 (Tool Host Page & Dashboard)
