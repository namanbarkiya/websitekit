"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { ToolProps } from "@/lib/utils/tool-registry";

import { generatePreviewHTML } from "./preview";

export interface MetaTagsState {
  // Basic SEO
  title: string;
  description: string;
  keywords: string;
  author: string;
  canonicalUrl: string;
  robots: string;

  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogUrl: string;
  ogSiteName: string;

  // Twitter Card
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  twitterCreator: string;
}

const DEFAULT_STATE: MetaTagsState = {
  title: "",
  description: "",
  keywords: "",
  author: "",
  canonicalUrl: "",
  robots: "index, follow",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  ogType: "website",
  ogUrl: "",
  ogSiteName: "",
  twitterCard: "summary_large_image",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  twitterSite: "",
  twitterCreator: "",
};

export function MetaTagsComponent({
  assets,
  state,
  setState,
  onGenerate,
  setHeaderGenerate,
}: ToolProps) {
  const [basicOpen, setBasicOpen] = useState(true);
  const [ogOpen, setOgOpen] = useState(false);
  const [twitterOpen, setTwitterOpen] = useState(false);

  // Memoize assets for stable reference
  const assetsKey = useMemo(
    () =>
      `${assets.name}|${assets.domain}|${assets.description}|${assets.logo}`,
    [assets.name, assets.domain, assets.description, assets.logo]
  );

  // Initialize state from assets on mount or when assets change
  useEffect(() => {
    const currentState = state as Partial<MetaTagsState>;
    const updates: Partial<MetaTagsState> = {};

    // Only set defaults if fields are empty
    if (!currentState.title && assets.name) {
      updates.title = assets.name;
    }
    if (!currentState.description && assets.description) {
      updates.description = assets.description;
    }
    if (!currentState.ogTitle && assets.name) {
      updates.ogTitle = assets.name;
    }
    if (!currentState.ogDescription && assets.description) {
      updates.ogDescription = assets.description;
    }
    if (!currentState.ogSiteName && assets.name) {
      updates.ogSiteName = assets.name;
    }
    if (!currentState.twitterTitle && assets.name) {
      updates.twitterTitle = assets.name;
    }
    if (!currentState.twitterDescription && assets.description) {
      updates.twitterDescription = assets.description;
    }
    if (!currentState.ogImage && assets.logo) {
      updates.ogImage = assets.logo;
    }
    if (!currentState.twitterImage && assets.logo) {
      updates.twitterImage = assets.logo;
    }
    if (!currentState.canonicalUrl && assets.domain) {
      const protocol = assets.domain.startsWith("http") ? "" : "https://";
      updates.canonicalUrl = `${protocol}${assets.domain}`;
    }
    if (!currentState.ogUrl && assets.domain) {
      const protocol = assets.domain.startsWith("http") ? "" : "https://";
      updates.ogUrl = `${protocol}${assets.domain}`;
    }

    if (Object.keys(updates).length > 0) {
      setState(updates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetsKey, setState]);

  const currentState = useMemo(
    () => (state as Partial<MetaTagsState>) || {},
    [state]
  );
  const currentStateRef = useRef(currentState);
  useEffect(() => {
    currentStateRef.current = currentState;
  }, [currentState]);

  // Generate real-time preview as user types
  const previewStateKey = useMemo(
    () =>
      JSON.stringify({
        title: currentState.title || "",
        description: currentState.description || "",
        ogTitle: currentState.ogTitle || "",
        ogDescription: currentState.ogDescription || "",
        ogImage: currentState.ogImage || "",
        twitterImage: currentState.twitterImage || "",
        canonicalUrl: currentState.canonicalUrl || "",
        ogUrl: currentState.ogUrl || "",
        ogSiteName: currentState.ogSiteName || "",
        twitterTitle: currentState.twitterTitle || "",
        twitterDescription: currentState.twitterDescription || "",
      }),
    [
      currentState.title,
      currentState.description,
      currentState.ogTitle,
      currentState.ogDescription,
      currentState.ogImage,
      currentState.twitterImage,
      currentState.canonicalUrl,
      currentState.ogUrl,
      currentState.ogSiteName,
      currentState.twitterTitle,
      currentState.twitterDescription,
    ]
  );

  useEffect(() => {
    const metaState = { ...DEFAULT_STATE, ...currentState };
    const preview = generatePreviewHTML(metaState, assets.primaryColor);
    const html = generateMetaTagsHTML(metaState);

    // Only update if there's meaningful content
    if (
      metaState.title ||
      metaState.description ||
      metaState.ogTitle ||
      metaState.ogDescription
    ) {
      onGenerate({
        type: "html",
        content: html,
        preview: preview,
        filename: "meta-tags.html",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewStateKey]);

  const handleChange = (field: keyof MetaTagsState, value: string) => {
    setState({ [field]: value });
  };

  const handleGenerate = useCallback(() => {
    const metaState = { ...DEFAULT_STATE, ...currentStateRef.current };
    const html = generateMetaTagsHTML(metaState);
    const preview = generatePreviewHTML(metaState, assets.primaryColor);
    onGenerate({
      type: "html",
      content: html,
      preview: preview,
      filename: "meta-tags.html",
    });
  }, [assets.primaryColor, onGenerate]);

  // Register global header "Generate" button handler
  useEffect(() => {
    if (!setHeaderGenerate) return;
    setHeaderGenerate({ onGenerate: handleGenerate, label: "Generate" });
    return () => setHeaderGenerate(null);
  }, [handleGenerate, setHeaderGenerate]);

  return (
    <div className="space-y-4">
      {/* Basic SEO Meta Tags */}
      <Collapsible open={basicOpen} onOpenChange={setBasicOpen} className="rounded-lg border">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-sm font-semibold">Basic SEO</span>
            <ChevronDownIcon
              className={[
                "size-4 text-muted-foreground transition-transform",
                basicOpen ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={currentState.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Page title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={currentState.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Page description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={currentState.keywords || ""}
                onChange={(e) => handleChange("keywords", e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={currentState.author || ""}
                onChange={(e) => handleChange("author", e.target.value)}
                placeholder="Author name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input
                id="canonicalUrl"
                type="url"
                value={currentState.canonicalUrl || ""}
                onChange={(e) => handleChange("canonicalUrl", e.target.value)}
                placeholder="https://example.com/page"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="robots">Robots</Label>
              <Input
                id="robots"
                value={currentState.robots || "index, follow"}
                onChange={(e) => handleChange("robots", e.target.value)}
                placeholder="index, follow"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Open Graph Meta Tags */}
      <Collapsible open={ogOpen} onOpenChange={setOgOpen} className="rounded-lg border">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-sm font-semibold">Open Graph</span>
            <ChevronDownIcon
              className={[
                "size-4 text-muted-foreground transition-transform",
                ogOpen ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ogTitle">OG:Title</Label>
              <Input
                id="ogTitle"
                value={currentState.ogTitle || ""}
                onChange={(e) => handleChange("ogTitle", e.target.value)}
                placeholder="Open Graph title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogDescription">OG:Description</Label>
              <Textarea
                id="ogDescription"
                value={currentState.ogDescription || ""}
                onChange={(e) => handleChange("ogDescription", e.target.value)}
                placeholder="Open Graph description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogImage">OG:Image URL</Label>
              <Input
                id="ogImage"
                type="url"
                value={currentState.ogImage || ""}
                onChange={(e) => handleChange("ogImage", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogType">OG:Type</Label>
              <Input
                id="ogType"
                value={currentState.ogType || "website"}
                onChange={(e) => handleChange("ogType", e.target.value)}
                placeholder="website, article, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogUrl">OG:URL</Label>
              <Input
                id="ogUrl"
                type="url"
                value={currentState.ogUrl || ""}
                onChange={(e) => handleChange("ogUrl", e.target.value)}
                placeholder="https://example.com/page"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogSiteName">OG:Site Name</Label>
              <Input
                id="ogSiteName"
                value={currentState.ogSiteName || ""}
                onChange={(e) => handleChange("ogSiteName", e.target.value)}
                placeholder="Site name"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Twitter Card Meta Tags */}
      <Collapsible
        open={twitterOpen}
        onOpenChange={setTwitterOpen}
        className="rounded-lg border"
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-sm font-semibold">Twitter Card</span>
            <ChevronDownIcon
              className={[
                "size-4 text-muted-foreground transition-transform",
                twitterOpen ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="twitterCard">Card Type</Label>
              <Input
                id="twitterCard"
                value={currentState.twitterCard || "summary_large_image"}
                onChange={(e) => handleChange("twitterCard", e.target.value)}
                placeholder="summary_large_image or summary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitterTitle">Twitter:Title</Label>
              <Input
                id="twitterTitle"
                value={currentState.twitterTitle || ""}
                onChange={(e) => handleChange("twitterTitle", e.target.value)}
                placeholder="Twitter card title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitterDescription">Twitter:Description</Label>
              <Textarea
                id="twitterDescription"
                value={currentState.twitterDescription || ""}
                onChange={(e) =>
                  handleChange("twitterDescription", e.target.value)
                }
                placeholder="Twitter card description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitterImage">Twitter:Image URL</Label>
              <Input
                id="twitterImage"
                type="url"
                value={currentState.twitterImage || ""}
                onChange={(e) => handleChange("twitterImage", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitterSite">Twitter:Site</Label>
              <Input
                id="twitterSite"
                value={currentState.twitterSite || ""}
                onChange={(e) => handleChange("twitterSite", e.target.value)}
                placeholder="@username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitterCreator">Twitter:Creator</Label>
              <Input
                id="twitterCreator"
                value={currentState.twitterCreator || ""}
                onChange={(e) => handleChange("twitterCreator", e.target.value)}
                placeholder="@username"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// Export DEFAULT_STATE for use in preview component
export { DEFAULT_STATE };

function generateMetaTagsHTML(state: MetaTagsState): string {
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
