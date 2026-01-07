# websitekit — Product Core Document

## 1. Product Vision

**websitekit** is an open, community-driven toolkit that helps developers start websites the _right way_ by generating essential assets, configurations, and best-practice files in one place.

The product focuses on **web fundamentals**, not frameworks or page building.

> websitekit is not about building websites.  
> It is about preparing websites for production.

---

## 2. Problem Statement

Starting a website today requires developers to:

-   Jump between multiple tools for favicons, meta tags, SEO, PWA, performance, security
-   Understand scattered best practices
-   Manually stitch outputs together
-   Repeat the same setup across projects

Existing tools:

-   Solve isolated problems
-   Don’t share context
-   Don’t scale well as a system
-   Don’t encourage consistency or standards

---

## 3. Product Goals

### Primary Goals

-   Provide a **single place** to generate all essential website setup assets
-   Reduce cognitive load during project startup
-   Encourage best practices by default
-   Scale to many tools without UX degradation
-   Enable community contributions without architectural decay

### Non-Goals

-   Not a framework
-   Not a website builder
-   Not a CMS
-   Not AI-first or AI-dependent
-   Not opinionated about frontend stacks

---

## 4. Core Product Principles

These principles guide **every feature and UX decision**.

### 1. Context over repetition

Users should enter basic website information once and reuse it everywhere.

### 2. Isolation by default

Each tool must be independent. No tool should break or depend on another.

### 3. Progressive complexity

Simple by default. Advanced options are discoverable but not forced.

### 4. Predictable UX

Different tools may behave differently, but interaction patterns must remain familiar.

### 5. Zero commitment

No login required. No forced onboarding. Immediate value.

---

## 5. User Personas

### Persona A: “Starting a new project”

-   Wants to get everything right from the beginning
-   Open to guidance
-   Values correctness and completeness

### Persona B: “I just need one thing”

-   Knows exactly what they need
-   Wants speed
-   Minimal interaction, copy and go

websitekit must serve **both personas equally well**.

---

## 6. Product Flows

### Flow 1: Landing Page (Intent Selection)

The landing page asks one clear question:

> How do you want to use websitekit?

Two equal options:

-   **Browse Tools** — targeted usage
-   **Generate Full Website Kit** — full setup (future)

No forced explanation. No complexity upfront.

---

### Flow 2: Browse Tools (Primary v1 Experience)

This is the main user experience at launch.

#### A. Website Asset Context

Users can optionally set shared website information:

-   Website name
-   Domain
-   Description
-   Primary color
-   Logo

This context:

-   Is stored locally
-   Is editable from a single place
-   Acts as defaults for all tools
-   Is never silently mutated by tools

#### B. Tools Dashboard

Users see:

-   Categorized tools
-   Search and filtering
-   Recently used or popular tools (future)

Tool discovery is:

-   Keyword-based
-   Category-based
-   Immediate (no navigation friction)

#### C. Tool Interaction

Each tool:

-   Uses website assets as defaults
-   Maintains its own local state
-   Allows overrides without affecting global context

Outputs are:

-   Previewable
-   Copyable
-   Downloadable
-   Clearly typed (HTML, files, images, JSON, etc.)

---

### Flow 3: Generate Full Website Kit (Future)

This flow is designed but intentionally deferred.

High-level behavior:

1. User enters website assets
2. Chooses which generators to include
3. Reviews optional settings
4. Receives a full downloadable package

This flow builds on the same underlying tools and context.

---

## 7. Tool System (Conceptual Model)

### Tools as Independent Units

Each tool:

-   Solves a single, well-defined problem
-   Declares what it needs and what it outputs
-   Does not depend on other tools
-   Can evolve independently

### Shared Capabilities

The platform provides:

-   Shared context (read-only)
-   Shared UI patterns
-   Shared export and preview handling
-   Discovery and search

---

## 8. Tool Discovery & Search

Search is a **first-class feature**, not an afterthought.

Each tool declares:

-   Name
-   Category
-   Description
-   Keywords (including synonyms)

Search supports:

-   Exact matches
-   Partial matches
-   Synonyms
-   Category filtering

Users should be able to find tools even if they don’t know the exact name.

---

## 9. Scalability Considerations

### UX Scalability

-   Categories prevent visual overload
-   Search replaces long lists
-   Consistent layouts prevent re-learning
-   Tool count can grow without redesign

### Product Scalability

-   New tools slot in without affecting existing ones
-   Future bundles and presets can be built on top
-   CLI or API versions can reuse the same logic

### Community Scalability

-   Clear boundaries prevent architectural drift
-   Contributions are additive, not invasive
-   Quality is enforced by structure, not policing

---

## 10. Open Source & Community Philosophy

websitekit is:

-   Open-source by default
-   Built for contributors as much as users
-   Designed to avoid bikeshedding

Contributor experience is a product feature.

Good tooling should be:

-   Easy to extend
-   Hard to misuse
-   Easy to reason about

---

## 11. Success Metrics (Product-Level)

websitekit succeeds when:

-   Users can complete setup tasks without external tools
-   Contributors can add tools without touching core UX
-   The product remains usable as tools grow
-   Developers trust the defaults

---

## 12. Long-Term Direction (Intent, Not Commitment)

Possible future extensions:

-   Presets for common site types
-   Full-kit generation
-   CLI version
-   Export templates per platform
-   Community-curated best practices

These are **enabled**, not **required**, by the current design.

---

## Closing Statement

websitekit is a **foundational utility**, not a trend-driven product.

Its value comes from:

-   Consistency
-   Correctness
-   Composability
-   Community trust

This document exists to protect that value as the product grows.
